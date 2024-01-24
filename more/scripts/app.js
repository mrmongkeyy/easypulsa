const app = {
	baseUrl:'https://aware-blue-rooster.cyclic.app',
	usernameCheckerUrl:'https://api.kitadigital.my.id/api/game',
	webtitle:find('title'),
	headertitle:find('.bigtitle'),
	theslogan:find('.theslogan'),
	homelabel:find('#beranda'),
	footer:find('#footer'),
	body:find('body'),
	development:false,
	app:find('#app'),
	menu:find('#menu'),
	bodydiv:find('#body'),
	menuButtons:findall('#menu div'),
	topLayer:find('#toplayer'),
	carouselParent:find('.owl-carousel'),
	async init(){
		this.provideScurities();
		await this.handleFrontData();
		this.menuButtonsInit();
		let {products,paymentMethods,carousel,valid} = await this.getPriceList();
		if(!valid){
			const old = this.getOldList();
			products = old.products;
			paymentMethods = old.paymentMethods;
			carousel = old.carousel;
		}else{
			this.saveOldList({products,paymentMethods,carousel});
		}
		this.products = products;
		this.paymentMethods = paymentMethods;
		this.carousel = carousel;
		this.generateBanner();
		this.generateRandomProduct();
		this.handleCustomerSupport();
		//record guest
		await this.handleVisitor();
	},
	menuButtonsInit(){
		this.menuButtons.forEach(btn=>{
			btn.onclick = ()=>{
				this.hideAndShow();
				this[`open${btn.id}`]();
			}
		})
	},
	handleFrontData(){
		return new Promise((resolve,reject)=>{
			cOn.get({
				url:`${this.baseUrl}/getfrontdata`,
				onload(){
					const response = this.getJSONResponse();
					console.log(response);
					app.setFrontView(response);
					resolve(true);
				}
			})
		})
	},
	setFrontView(param){
		/*
			param [webtitle, headertitle, theslogan, homelabel, footer]
		*/
		if(!param)
			return;
		this.webtitle.innerHTML = param.webtitle;
		this.headertitle.innerHTML = param.headertitle;
		this.theslogan.innerHTML = param.theslogan;
		this.homelabel.innerHTML = param.homelabel;
		this.footer.innerHTML = param.footer;
	},
	getOldList(){
		return JSON.parse(localStorage.getItem('easyolddata'));
	},
	saveOldList(param){
		localStorage.setItem('easyolddata',JSON.stringify(param));
	},
	openPulsa(){
		this.topLayer.replaceChild(view.pulsaProducts());
	},
	openData(){
		this.topLayer.replaceChild(view.dataProducts());
	},
	openHistory(){
		this.topLayer.replaceChild(view.transactionHistories());
	},
	openGames(){
		this.topLayer.replaceChild(view.gameProducts());
	},
	openPLN(){
		this.topLayer.replaceChild(view.plnProducts());
	},
	openEmoney(){
		this.topLayer.replaceChild(view.emoneyProducts());
	},
	hideAndShow(){
		this.body.style.overflow = 'hidden';
		this.topLayer.show('flex');
	},
	openDetailsProduct(productId='defaultid'){
		this.hideAndShow();
		this.topLayer.replaceChild(view.productDetails(productId));
	},
	confirmAction(param){
		this.body.addChild(view.confirmAction(param));
	},
	openTransactionHistoriesSettings(){
		this.body.addChild(view.transactionSettings());
	},
	openPaymentDetails(param,param2=false){
		this.topLayer.replaceChild(view.paymentDetails(param,param2));
	},
	openFeedBackSender(param){
		this.body.addChild(view.feedBack(param));
	},
	openGuaranteeType(param){
		this.body.addChild(view.guaranteeType(param));
	},
	getSaldoId(){
		this.body.addChild(view.getSaldoId());
	},
	clearHistory(){
		const sure = confirm('Sistem akan menghapus histori transaksi anda! Apakah anda yakin?');
		if(sure){
			localStorage.removeItem('easypulsatransactionhistories');
			this.showWarnings('Histori Transaksi Berhasil Dihapus!');
		}
	},
	getPriceList(){
		return new Promise((resolve,reject)=>{
			cOn.get({
				url:`${this.baseUrl}/pricelist`,
				onload(){
					resolve(this.getJSONResponse());
				}
			})
		});
	},
	pushNewTransactionData(param){
		const oldData = JSON.parse(localStorage.getItem('easypulsatransactionhistories'))||[];
		oldData.push(param);
		localStorage.setItem('easypulsatransactionhistories',JSON.stringify(oldData));
	},
	showWarnings(message){
		this.body.addChild(makeElement('div',{
			style:`
				position: fixed;
		    background: rgb(137, 115, 223);
		    padding: 20px;
		    color: white;
		    border-radius: 10px;
		    display: flex;
		    gap: 15px;
		    align-items: center;
		    top: 10px;
		    right: 10px;
		    max-width: 300px;
		    font-size: 14px;
		    border:1px solid gainsboro;
		    z-index:20;
			`,
			innerHTML:`
				<div>
					<img src=./more/media/warningicon.png>
				</div>
				<div>${message}</div>
			`,
			onadded(){
				setTimeout(()=>{this.remove()},2000);
			}
		}))
	},
	handleCustomerSupport(){
		this.body.addChild(view.customerSupport());
	},
	openCsInput(){
		this.body.addChild(view.csInput());
	},
	order(){

	},
	handleVisitor(){
		return new Promise(async (resolve,reject)=>{
			const dateStamp = new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).split(' ')[0] + ' 00:00:00 AM';
			const timeString = Date.parse(dateStamp);
			const savedStamp = JSON.parse(localStorage.getItem('easypulsaloadtime'))||{};
			const ip = await new Promise((resolve,reject)=>{
				cOn.get({
					url:'https://api.ipify.org/?format=json',
					onload(){
						if(!this.getJSONResponse().ip)
							return resolve(null);
						resolve(this.getJSONResponse().ip.replaceAll('.','-'));
					}
				})
			})
			if(!ip)
				return resolve(true);

			if(!savedStamp[timeString]){
				// send server
				cOn.post({
					url:`${app.baseUrl}/addmorevisitor`,
					someSettings:[['setRequestHeader','content-type','application/json']],
					data:jsonstr({ip,timeString}),
					onload(){
						const obj = {};
						obj[timeString] = true;
						localStorage.setItem('easypulsaloadtime',JSON.stringify(obj));
						resolve(true);
					}
				})
			}else{
				resolve(true);
			}
		})
	},
	provideScurities(){
		document.onkeydown = (e)=>{
			if(!this.development && e.key === 'F12'){
				this.showWarnings('Galat!!!<br>Akses terbatas!');
				e.preventDefault();	
			}
		}
		//some defense code.
		if(!this.development){
			document.oncontextmenu = (e)=>{
				this.showWarnings('Galat!!!<br>Akses terbatas!');
				e.preventDefault();
			}
		}
	},
	generateRandomProduct(){
		const productsRandom = [];
		const allproducts = [];
		const skuinside = [];
		for(let i in this.products){
			for(let j in this.products[i]){
				this.products[i][j].data.forEach((product)=>{
					allproducts.push(product);
				})
			}
		}
		while(productsRandom.length<6){
			const choosed = allproducts.getRandom();
			if(!skuinside.includes(choosed.brand)){
				skuinside.push(choosed.brand);
				productsRandom.push(choosed);
			}
		}
		app.bodydiv.replaceChild(view.randomProducts(productsRandom));
	},
	generateBanner(){
		for(let i in this.carousel){
			const carousel = this.carousel[i];
			if(carousel.active){
				this.carouselParent.addChild(makeElement('div',{
					innerHTML:`
						<img src="${carousel.bannerUrl}">
					`,command:carousel.command.split(' '),
					onadded(){
						if(this.command.length === 3)
							this.command[1] = this.command[1]+' '+this.command[2];
					},
					onclick(){
						const category = this.command[0][0].toUpperCase() + this.command[0].toLowerCase().slice(1);
						const brand = this.command[1][0].toUpperCase() + this.command[1].toLowerCase().slice(1);
						app.openDetailsProduct({
							title:`${category + ' ' +brand}`,
							details:app.products[this.command[0]][this.command[1]].details,
							products:app.products[this.command[0]][this.command[1]].data
						});
					}
				}))
			}
		}
		$('.owl-carousel').owlCarousel({
      loop:true,
      margin:10,
      nav:false,
      dots:false,
      items:1,
      stagePadding:30,
    });
    let isHover = false;
    $('.owl-carousel').mouseover(()=>{
      isHover = true;
    })
    $('.owl-carousel').mouseout(()=>{
      isHover = false;
    })
    setInterval(()=>{
      if(!isHover)
        $('.owl-carousel').trigger('next.owl.carousel',[1000]);
    },2000)
	}
}

app.init();
