const app = {
	baseUrl:'https://aware-blue-rooster.cyclic.app',
	body:find('body'),
	app:find('#app'),
	menu:find('#menu'),
	bodydiv:find('#body'),
	menuButtons:findall('#menu div'),
	topLayer:find('#toplayer'),
	async init(){
		this.menuButtonsInit();
		this.generateHomeContent();
	},
	menuButtonsInit(){
		this.menuButtons.forEach(btn=>{
			btn.onclick = ()=>{
				this.hideAndShow();
				this[`open${btn.id}`]();
			}
		})
	},
	hideAndShow(){
		this.body.style.overflow = 'hidden';
		this.topLayer.show('flex');
	},
	openOrder(){
		this.topLayer.replaceChild(view.orderPage());
	},
	openFeedback(state){
		this.topLayer.replaceChild(view.feedbackPage(state));
	},
	openPrice(){
		this.topLayer.replaceChild(view.pricePage());
	},
	openConfig(){
		this.topLayer.replaceChild(view.configPage());
	},
	showOrderCurve(){
		return new Promise(async (resolve,reject)=>{
			//getting visitor data
			const visitor = await new Promise((resolve,reject)=>{
				cOn.get({
					url:`${app.baseUrl}/getordersdata`,
					onload(){
						resolve(this.getJSONResponse());
					}
				})
			})
			this.bodydiv.addChild(view.orderChartInfo(visitor));
			resolve(true);	
		})
		
	},
	showVisitorCurve(){
		return new Promise(async (resolve,reject)=>{
			//getting visitor data
				const visitor = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/getvisitordata`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
			this.bodydiv.addChild(view.visitorChartInfo(visitor));	
			resolve(true);
		})
		
	},
	showProfitCurve(){
		return new Promise(async (resolve,reject)=>{
			//getting visitor data
			const visitor = await new Promise((resolve,reject)=>{
				cOn.get({
					url:`${app.baseUrl}/getordersdata`,
					onload(){
						resolve(this.getJSONResponse());
					}
				})
			})
			this.bodydiv.addChild(view.profitChartInfo(visitor));
			resolve(true);	
		})
	},
	openBanner(){
		this.topLayer.replaceChild(view.bannerEdit());
	},
	openBroadcast(){
		this.topLayer.replaceChild(view.sendBroadcast());
	},
	showStatistick(){
		this.bodydiv.addChild(view.statistickInfo());
	},
	async generateHomeContent(){
		//statistik, fonnte sended message, digi products, orders count and more.
		await this.showVisitorCurve();
		await this.showOrderCurve();
		await this.showProfitCurve();
		this.showStatistick();
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
		    z-index:15;
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
	openPaymentDetails(param,param2=false){
		this.topLayer.replaceChild(view.paymentDetails(param,param2));
	}
}

app.init();
