const view = {
	orderPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:white;
				border:1px solid gainsboro;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					border-bottom:1px solid gainsboro;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div>Order List</div>
				</div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
					background:whitesmoke;
				" id=pplace>
					
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.pplace = this.find('#pplace');
				this.anim({
					targets:this,
					height:['0','95%'],
					duration:1000
				})
				this.generateOrders();
			},
			async generateOrders(){
				const orders = objToArray(await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/orderlist`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				}))
				for(let i=orders.length-1;i>0;i--){
					this.pplace.addChild(makeElement('div',{
						orderId:orders[i].payments.orderId,
						innerHTML:`
							<div style="
								display:flex;
								justify-content:space-between;
								align-items:flex-start;
								gap:10px;
							">
								<div style="
									padding:10px;width:5%
								">${orders.length - i}.</div>
								<div style="width:75%;">
									<div style="padding:10px 0;">${orders[i].products.varianName}</div>
									<div style="display:flex;flex-direction:column;font-size:12px;color:gray;gap:5px;padding:5px 0;">
										<div style=display:flex;gap:10px;justify-content:space-between;>
											<div>Tanggal Order</div>
											<div>${orders[i].payments.dateCreate}</div>
										</div>
										<div  style=display:flex;gap:10px;justify-content:space-between;>
											<div>Status</div>
											<div>${orders[i].payments.status === 'Pending' ? 'Menunggu Pembayaran' : orders[i].products.status}</div>
										</div>
									</div>
								</div>
								<div style="width:20%;white-space:nowrap;text-align:center;display:flex;flex-direction:column;">
									<div style=padding:10px;>Rp ${getPrice(orders[i].products.price)}</div>
									<div style="
										padding:10px;
										border-radius:5px;
										color:white;
										cursor:pointer;
										background:#8973df;
									" id=cek>Cek</div>
								</div>
							</div>
						`,
						onadded(){
							this.find('#cek').onclick = async ()=>{
								const orderdetails = await new Promise((resolve,reject)=>{
									cOn.get({
										url:`${app.baseUrl}/orderdetails?orderId=${this.orderId}`,
										onload(){
											resolve(this.getJSONResponse());
										}
									})
								})
								if(orderdetails.valid)
									return app.openPaymentDetails(orderdetails.data);
								app.showWarnings('Transaksi tidak ditemukan!');
							}
						},
						style:`
							background:white;
							padding:10px;
							border:1px solid gainsboro;
							margin-bottom:5px;
							border-radius:5px;
						`,
					}))
				}
				if(!orders.length)
					this.pplace.addChild(makeElement('div',{
						innerHTML:'Belum ada data order!',
						style:`
							font-size: 12px;
					    color: gray;
					    text-align: center;
					    margin-top: 200px;
						`
					}))
			}
		})
	},
	feedbackPage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:white;
				border:1px solid gainsboro;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					border-bottom:1px solid gainsboro;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div>Feedback's</div>
				</div>
				<div style="
					overflow:auto;
					padding:10px;
					background:white;
					border-bottom:1px solid gainsboro;
					display:flex;
					gap:10px;
					color:white;
				">
					<div style="background:silver;padding:15px;border-radius:5px;display: flex;
				    align-items: center;
				    justify-content: center;
				    cursor:pointer;width:100%;
				    gap:10px;
				  ">
						<img src=./more/media/order.png>
					</div>
					<div style="background:#8973df;padding:15px;border-radius:5px;display: flex;
				    align-items: center;
				    justify-content: center;
				    cursor:pointer;width:100%;
				    gap:10px;
				  ">
						<img src=./more/media/customersupport.png>
					</div>
				</div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
					background:whitesmoke;
				" id=pplace>
					
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.pplace = this.find('#pplace');
				this.anim({
					targets:this,
					height:['0','95%'],
					duration:1000
				})
				this.generateOrders();
			},
			async generateOrders(){
				const feedback = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/feedbacklist`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				let count = 0;
				for(let i in feedback){
					count += 1;
					this.pplace.addChild(makeElement('div',{
						feedback:feedback[i],
						style:`
							padding:20px;
							background:white;
							border-radius:10px;
							margin-bottom:5px;
							border:1px solid gainsboro;
							display:flex;
							flex-direction:column;
							gap:10px;
						`,
						innerHTML:`
							<div id=ratings style="
								display:flex;
								gap:10px;
							"></div>
							<div>
								<div style="font-size:12px;color:gray;">"${feedback[i].feedValue}"</div>
							</div>
							<div>- ${i}</div>
						`,
						onadded(){
							if(!this.feedback.ratevalue)
								this.feedback.ratevalue = 5;
							this.ratings = this.find('#ratings');
							for(let i=0;i<5;i++){
								this.ratings.addChild(makeElement('div',{
									innerHTML:`
										<img src="./more/media/${i <= this.feedback.ratevalue - 1? 'activestar' : 'inactivestar'}.png">
									`
								}))
							}
						}
					}))
				}
				if(!objToArray(feedback).length)
					this.pplace.addChild(makeElement('div',{
						innerHTML:'Belum ada feedback!',
						style:`
							font-size: 12px;
					    color: gray;
					    text-align: center;
					    margin-top: 200px;
						`
					}))
			}
		})
	},
	pricePage(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:white;
				border:1px solid gainsboro;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					border-bottom:1px solid gainsboro;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div>Atur Markup Price</div>
					<div style="
						position: absolute;
				    right: 10px;
				    padding: 10px;
				    width: 24px;
				    height: 24px;
				    cursor: pointer;
				    background: #8973df;
				    border-radius: 5px;
					" id=updatebutton>
						<img src=./more/media/refreshicon.png style=width:100%;>
					</div>
				</div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
					background:whitesmoke;
				" id=pplace>
					<div style="
						padding:20px;
						background:white;
						border:1px solid gainsboro;
						border-radius:5px;
						display:flex;
						gap:10px;
						flex-direction:column;
						margin-bottom:20px;
					">
						<div>Quick Search</div>
						<div style=display:flex;>
							<input placeholder="Gunakan Pencarian Cepat..." id=qsearch>
						</div>
					</div>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			processSearch(){
				const key = this.qsearch.value;
				for(let i in this.feeels){
					if(i.toLowerCase().search(key.toLowerCase())===-1){
						this.feeels[i].hide();
					}else this.feeels[i].show('block');
				}
			},feeels:{},
			async forceUpdate(){
				const response = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/updatefeelist`,
						onload(){resolve(this.getJSONResponse())}
					})
				})
				if(response.valid)
					return app.openPrice();
				app.showWarnings('Gagal memperbarui data!');
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.find('#updatebutton').onclick = ()=>{
					this.forceUpdate();
				}
				this.pplace = this.find('#pplace');
				this.qsearch = this.find('#qsearch');
				this.qsearch.onchange = ()=>{
					this.processSearch();
				}
				this.anim({
					targets:this,
					height:['0','95%'],
					duration:1000
				})
				this.generateOrders();
			},
			async generateOrders(){
				const fee = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/feelist`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				console.log(fee);
				let count = 0;
				for(let i in fee){
					count += 1;
					this.feeels[i] = this.pplace.addChild(makeElement('div',{
						innerHTML:`
							<div style="
								display:flex;
								justify-content:space-between;
								align-items:flex-start;
								gap:10px;
							">
								<div style="
									padding:10px;width:5%
								">${count}.</div>
								<div style="width:75%;">
									<div style="padding:10px 0;">${i}</div>
									<div style=display:flex;flex-direction:column;font-size:12px;color:gray;gap:5px;>
										<div style=display:flex;gap:10px;justify-content:space-between;>
											<input placeholder="Input nilai baru">
										</div>
									</div>
								</div>
								<div style="width:20%;white-space:nowrap;text-align:center;display:flex;flex-direction:column;">
									<div style=padding:10px; id=label>Rp ${getPrice(fee[i])}</div>
									<div style="
										padding:14px;
										border-radius:5px;
										color:white;
										cursor:pointer;
										background:#8973df;
									" id=setbutton>Set</div>
								</div>
							</div>
						`,
						flag:i,
						async setNewValue(){
							const newPrice = this.find('input').value;
							const result = await new Promise((resolve,reject)=>{
								cOn.get({
									url:`${app.baseUrl}/setnewprice?value=${newPrice}&&flag=${this.flag}`,
									onload(){
										resolve(this.getJSONResponse());
									}
								})
							})
							if(result.valid){
								this.find('#label').innerHTML = `Rp ${getPrice(newPrice)}`;
								this.find('input').value = '';
								app.showWarnings('Data disimpan!');
							}else app.showWarnings('Gagal menyimpan data!');
						},
						onclick(){
							this.find('#setbutton').onclick = ()=>{
								this.setNewValue();
							}
						},
						style:`
							background:white;
							padding:10px;
							border:1px solid gainsboro;
							margin-bottom:5px;
							border-radius:5px;
						`,
					}))
				}
				
				if(!count)
					this.pplace.addChild(makeElement('div',{
						innerHTML:'Belum ada data produk!',
						style:`
							font-size: 12px;
					    color: gray;
					    text-align: center;
					    margin-top: 200px;
						`
					}))
			}
		})
	},
	configPage(param){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:white;
				border:1px solid gainsboro;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					border-bottom:1px solid gainsboro;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div>Atur konfigurasi web</div>
				</div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
					background:whitesmoke;
				" id=pplace>
					<div style="
						padding:10px;
						background:white;
						border-radius:5px;
						border:1px solid gainsboro;
						margin-bottom:10px;
						position:sticky;top:0;
					">
						<div style="
							padding: 20px;
					    display: flex;
					    align-items: center;
					    justify-content: center;
					    color: white;
					    border-radius: 10px;
					    background: #8973df;
					    cursor: pointer;
						" id=savechanges>Simpan Perubahan</div>
					</div>
					<div style="
						padding:20px;
						border-radius:5px;
						background:white;
						border:1px solid gainsboro;
						display:flex;flex-direction:column;gap:10px;
						margin-bottom:10px;
					">
						<div>Web Page Data</div>
						<div style=font-size:12px;color:gray;display:flex;flex-direction:column;gap:10px;>
							<div>
								<div>Web Title</div>
								<div style=display:flex;>
									<input id=dataFront-webtitle>
								</div>
							</div>
							<div>
								<div>Big Title</div>
								<div style=display:flex;>
									<input id=dataFront-headertitle>
								</div>
							</div>
							<div>
								<div>The Slogan</div>
								<div style=display:flex;>
									<input id=dataFront-theslogan>
								</div>
							</div>
							<div>
								<div>Home Label</div>
								<div style=display:flex;>
									<input id=dataFront-homelabel>
								</div>
							</div>
							<div>
								<div>Footer</div>
								<div style=display:flex;>
									<input id=dataFront-footer>
								</div>
							</div>
						</div>
					</div>
					<div style="
						padding:20px;
						border-radius:5px;
						background:white;
						border:1px solid gainsboro;
						display:flex;flex-direction:column;gap:10px;
						margin-bottom:10px;
					">
						<div>Digiflazz Data</div>
						<div style=font-size:12px;color:gray;display:flex;flex-direction:column;gap:10px;>
							<div>
								<div>Username</div>
								<div style=display:flex;>
									<input id=digiData-username>
								</div>
							</div>
							<div>
								<div>Dev Key</div>
								<div style=display:flex;>
									<input id=digiData-devKey>
								</div>
							</div>
							<div>
								<div>Production Key</div>
								<div style=display:flex;>
									<input id=digiData-productionKey>
								</div>
							</div>
						</div>
					</div>
					<div style="
						padding:20px;
						border-radius:5px;
						background:white;
						border:1px solid gainsboro;
						display:flex;flex-direction:column;gap:10px;
						margin-bottom:10px;
					">
						<div>Duitku Data</div>
						<div style=font-size:12px;color:gray;display:flex;flex-direction:column;gap:10px;>
							<div>
								<div>Merchant Id</div>
								<div style=display:flex;>
									<input id=duitkuData-merchantCode>
								</div>
							</div>
							<div>
								<div>Api Key</div>
								<div style=display:flex;>
									<input id=duitkuData-apiKey>
								</div>
							</div>
							<div>
								<div>Return Url</div>
								<div style=display:flex;>
									<input id=duitkuData-returnUrl>
								</div>
							</div>
							<div>
								<div>Callback Url</div>
								<div style=display:flex;>
									<input id=duitkuData-callbackUrl>
								</div>
							</div>
						</div>
					</div>
					<div style="
						padding:20px;
						border-radius:5px;
						background:white;
						border:1px solid gainsboro;
						display:flex;flex-direction:column;gap:10px;
						margin-bottom:10px;
					">
						<div>Fontte Data</div>
						<div style=font-size:12px;color:gray;display:flex;flex-direction:column;gap:10px;>
							<div>
								<div>Owner Number</div>
								<div style=display:flex;>
									<input id=fonnteData-ownerNumber>
								</div>
							</div>
							<div>
								<div>Token</div>
								<div style=display:flex;>
									<input id=fonnteData-token>
								</div>
							</div>
						</div>
					</div>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			async saveAll(){
				const webConfig = {};
				this.inputs.forEach((input)=>{
					const ids = input.id.split('-');
					if(!webConfig[ids[0]]){
						webConfig[ids[0]] = {};
						webConfig[ids[0]][ids[1]] = input.value;
					}else{
						webConfig[ids[0]][ids[1]] = input.value;
					}
				})
				const savelog = await new Promise((resolve,reject)=>{
					cOn.post({
						url:`${app.baseUrl}/setwebconfig`,
						someSettings:[['setRequestHeader','content-type','application/json']],
						data:jsonstr(webConfig),
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				if(savelog.valid)
					app.showWarnings('Perubahan berhasil disimpan!');
				else app.showWarnings('Terjadi kesalahan pada proses penyimpanan!');
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.saveButton = this.find('#savechanges');
				this.saveButton.onclick = ()=>{
					this.saveAll();
				}
				this.inputs = this.findall('input');
				this.pplace = this.find('#pplace');
				this.anim({
					targets:this,
					height:['0','95%'],
					duration:1000
				})
				this.getPrevData();
			},
			async getPrevData(){
				const webConfig = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/givemewebconfig`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				console.log(webConfig);
				this.inputs.forEach((input)=>{
					const ids = input.id.split('-');
					input.value = webConfig[ids[0]][ids[1]];
				})
			}
		})
	},
	orderChartInfo(){
		return makeElement('div',{
			style:`
				width: 100%;
    		margin-top: 20px;
		    border: 1px solid gainsboro;
		    background: white;
		    border-radius: 10px;
		    padding: 20px;
			`,
			innerHTML:`
				<div style="font-weight:bold;margin-bottom:10px;">Kurva Order</div>
				<div id=chart style="
					background:white;
				"></div>
			`,
			onadded(){
				let options = {
				  chart: {
				    type: 'line'
				  },
				  stroke: {
					  curve: 'smooth',
					},
				  series: [{
				    name: 'sales',
				    data: [30,40,35,50,49,60,70,91,125]
				  }],
				  colors:['#8973df','#8973df'],
				  xaxis: {
				    categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
				  }
				}
				this.chart = new ApexCharts(this.find("#chart"), options);
				this.chart.render();
			}
		})
	},
	visitorChartInfo(){
		return makeElement('div',{
			style:`
				width: 100%;
    		margin-top: 10px;
		    border: 1px solid gainsboro;
		    background: white;
		    border-radius: 10px;
		    padding: 20px;
			`,
			innerHTML:`
				<div style="font-weight:bold;margin-bottom:10px;">Kurva Pengunjung</div>
				<div id=chart style="
					background:white;
				"></div>
			`,
			onadded(){
				let options = {
				  chart: {
				    type: 'line'
				  },
				  stroke: {
					  curve: 'smooth',
					},
				  series: [{
				    name: 'sales',
				    data: [30,40,35,50,49,60,70,91,125]
				  }],
				  colors:['#8973df','#8973df'],
				  xaxis: {
				    categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
				  }
				}
				this.chart = new ApexCharts(this.find("#chart"), options);
				this.chart.render();
			}
		})
	},
	profitChartInfo(){
		return makeElement('div',{
			style:`
				width: 100%;
    		margin-top: 20px;
		    border: 1px solid gainsboro;
		    background: white;
		    border-radius: 10px;
		    padding: 20px;
			`,
			innerHTML:`
				<div style="font-weight:bold;margin-bottom:10px;">Kurva Profit</div>
				<div id=chart style="
					background:white;
				"></div>
			`,
			onadded(){
				let options = {
				  chart: {
				    type: 'line'
				  },
				  stroke: {
					  curve: 'smooth',
					},
				  series: [{
				    name: 'sales',
				    data: [30,40,35,50,49,60,70,91,125]
				  }],
				  colors:['#8973df','#8973df'],
				  xaxis: {
				    categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
				  }
				}
				this.chart = new ApexCharts(this.find("#chart"), options);
				this.chart.render();
			}
		})
	},
	statistickInfo(){
		return makeElement('div',{

		})
	},
	paymentDetails(param,param2){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:white;
				border:1px solid gainsboro;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					border-bottom:1px solid gainsboro;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div>Detail Pesanan</div>
					<div style="
						position: absolute;
				    right: 10px;
				    padding: 5px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
				    background:mediumpurple;
				    display: flex;
				    align-items: center;
				    justify-content: center;
				    border-radius:10px;
					" id=refreshbutton>
						<img src=./more/media/refreshicon.png style=width:24px;height:24px;>
					</div>
				</div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
					background:whitesmoke;
				">
					<div style="
						padding:20px;
						border:1px solid gainsboro;
						background:white;
						margin-bottom:10px;
						border-radius:10px;
					">
						<div style="padding-bottom:10px;margin-bottom:20px;font-weight:bold;">Detail Pesanan</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Hp Tujuan</div>
							<div style=display:flex;><input placeholder=08-xxx-xxx-xxx value="${param.products.goalNumber}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Notifikasi Whatsapp</div>
							<div style=display:flex;><input placeholder=08-xxx-xxx-xxx value="${param.products.waNotif}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Produk</div>
							<div style=display:flex;><input value="${param.products.varianName}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Harga</div>
							<div style=display:flex;><input value="Rp ${getPrice(param.products.price)}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Status</div>
							<div style=display:flex;><input value="${param.payments.status === 'Pending' ? 'Menunggu Pembayaran' : param.products.status === 'Processing' ? 'Sedang di proses' : param.products.status === 'Success' ? 'Berhasil' : 'Gagal'}"></div>
						</div>
						<div>
							<div style=margin-bottom:10px;>Waktu Pemesanan</div>
							<div style=display:flex;><input value="${param.payments.dateCreate}"></div>
						</div>
					</div>
					<div style="
						padding:20px;
						border:1px solid gainsboro;
						background:white;
						margin-bottom:10px;
						border-radius:10px;
					">
						<div style="padding-bottom:10px;margin-bottom:20px;font-weight:bold;">Detail Pembayaran</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Metode Pembayaran</div>
							<div style=display:flex;><input value="${param.products.methodName}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Status</div>
							<div style=display:flex;><input value="${Date.parse(param.payments.dateCreate) + 600000 < Date.parse(new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })) ? 'Kadaluwarsa' : param.payments.status === 'Pending' ? 'Belum dibayar' : 'Dibayar'}"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>QR / VA</div>
							<div style=display:${param.payments.vaNumber ? 'flex' : 'none'};gap:10px;>
								<input value="${param.payments.vaNumber}" id=vanumberinput>
								<div style="
									background: #8973df;
							    display: flex;
							    align-items: center;
							    width: 32px;
							    height: 32px;
							    padding: 5px;
							    border-radius: 10px;
							    border:1px solid gainsboro;
							    cursor:pointer;
								">
									<img src=./more/media/copyicon.png id=vacopybutton>
								</div>
							</div>
							<div style="text-align:center;display:${param.payments.qrString ? 'block' : 'none'};
								    padding: 20px;
								    border: 1px solid gainsboro;
								    border-radius:10px;
								    position:relative;
								    overflow:hidden;
							">
								<img style="width:100%;height:100%;object-fit:cover;" src=" https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${param.payments.qrString}">
								<div style="
									position: absolute;
							    top: 0;
							    left: 0;
							    width: 100%;
							    height: 100%;
							    background: #f5f5f5ed;
							    display: ${Date.parse(param.payments.dateCreate) + 600000 < Date.parse(new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })) ? 'flex' : 'none'};
							    align-items: center;
							    justify-content: center;
							    font-weight: bold;
								">Waktu Pembayaran Telah Berakhir!</div>
							</div>
							<div ${!param.payments.qrString && !param.payments.vaNumber ? '' : 'hidden'} style="
							    background: #118eea;
							    color: white;
							    border-radius: 10px;
							    padding: 20px;
							    text-align: center;
							    cursor:pointer;
							" id=openeksternalpayment>${param.payments.status === 'Success' ? 'Telah dibayar' : param.payments.status === 'Canceled' ? 'Gagal' : param.products.methodName === 'DANA' ? 'Buka DANA' : 'Bayar Sekarang'}</div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Waktu Kadaluwarsa</div>
							<div style=display:flex;><input value="10 Menit"></div>
						</div>
						<div style=margin-bottom:20px;>
							<div style=margin-bottom:10px;>Tanggal Kadaluwarsa</div>
							<div style=display:flex;><input value="${new Date(Date.parse(param.payments.dateCreate) + 600000).toLocaleString()}"></div>
						</div>
						<div>
							<div style=margin-bottom:10px;>Instruksi Pembayaran</div>
							<div style=display:flex;><input value="${!param.payments.vaNumber && !param.payments.qrString ? 'Klik tombol bayar diatas' : param.payments.vaNumber ? 'Salin kode VA diatas' : 'Scan Qr diatas!'}"></div>
						</div>
					</div>
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			onadded(){
				console.log(param);
				if(param2)
					app.pushNewTransactionData(param);
				this.find('#backbutton').onclick = ()=>{
					app.openOrder();
				}
				this.find('#vacopybutton').onclick = ()=>{
					navigator.clipboard.writeText(this.find('#vanumberinput').value);
					app.showWarnings('Nomor VA berhasil disalin!');
				}
				this.find('#refreshbutton').onclick = async ()=>{
					const response = await new Promise((resolve,reject)=>{
						cOn.get({
							url:`${app.baseUrl}/orderdetails?orderId=${param.payments.orderId}`,
							onload(){
								resolve(this.getJSONResponse());
							}
						})
					})
					if(!response.valid)
						return app.showWarnings('Maaf, mohon periksa kembali data orderId anda!');
					app.openPaymentDetails(response.data);
				}
				this.find('#openeksternalpayment').onclick = ()=>{
					const expiredStamp = Date.parse(param.payments.dateCreate) + 600000;
					const timeNow = Date.parse(new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
					if(timeNow > expiredStamp)
						return app.showWarnings('Maaf, waktu pembayaran telah berakhir / kadaluwarsa!');
					window.open(param.payments.paymentUrl);
				}
				this.anim({
					targets:this,
					height:['0','95%'],
					duration:1000
				})
			}
		})
	},
	bannerEdit(){
		return makeElement('div',{
			className:'smartWidth',
			style:`
				background:white;
				border:1px solid gainsboro;
				display:flex;
				flex-direction:column;
				overflow:hidden;
				border-radius:10px 10px 0 0;
			`,
			innerHTML:`
				<div style="
					padding:10px;
					height:48px;
					border-bottom:1px solid gainsboro;
					display:flex;
					align-items:center;
					justify-content:center;
					position:relative;
				">
					<div style="
						position: absolute;
				    left: 10px;
				    padding: 10px;
				    width: 32px;
				    height: 32px;
				    cursor:pointer;
					" id=backbutton>
						<img src=./more/media/back.png>
					</div>
					<div>Carousel's Edit</div>
				</div>
				<div style="
					height:100%;
					overflow:auto;
					padding:10px;
					background:whitesmoke;
				" id=pplace>
					
				</div>
			`,
			close(){
				app.topLayer.hide();
				app.body.style.overflow = 'auto';
				this.remove();
			},
			onadded(){
				this.find('#backbutton').onclick = ()=>{
					this.close();
				}
				this.pplace = this.find('#pplace');
				this.anim({
					targets:this,
					height:['0','95%'],
					duration:1000
				})
				this.generateOrders();
			},
			async generateOrders(){
				const feedback = await new Promise((resolve,reject)=>{
					cOn.get({
						url:`${app.baseUrl}/carousellist`,
						onload(){
							resolve(this.getJSONResponse());
						}
					})
				})
				let count = 0;
				for(let i in feedback){
					count += 1;
					this.pplace.addChild(makeElement('div',{
						feedback:feedback[i],
						style:`
							padding:20px;
							background:white;
							border-radius:10px;
							margin-bottom:5px;
							border:1px solid gainsboro;
							display:flex;
							flex-direction:column;
							gap:10px;
						`,
						innerHTML:`
							<div style=position:relative;>
								<img src="${feedback[i].bannerUrl}" style="
									width:100%;
									height:100%;
									object-fit:cover;
								" id=imgPreview>
								<div style="
									background:silver;
									position:absolute;
									top:0;right:0;
									padding:10px;
									border-radius: 0 0 0 15px;
									cursor:pointer;
								" id=newImageButton>
									<img src=./more/media/refreshicon.png style="
										width:24px;height:24px;
									">
								</div>
							</div>
							<div>${i}</div>
							<div style=font-size:12px;>
								<div style=margin-bottom:10px>
									<div>Status</div>
									<div>
										<select>
											<option ${feedback[i].active ? 'selected' : ''}>On</option>
											<option ${!feedback[i].active ? 'selected' : ''}>Off</option>
										</select>
									</div>
								</div>
								<div>
									<div>Command</div>
									<div style=display:flex;>
										<input placeholder="Masukan Command..." value="${feedback[i].command}">
									</div>
								</div>
							</div>
							<div style="
								padding:15px;
								color:white;
								background:#8973df;
								border-radius:10px;
								cursor:pointer;
								text-align:center;
								margin-top:10px;
							" id=savebutton>Simpan</div>
						`,
						carouselId:i,
						file:makeElement('input',{type:'file',accept:'image/*'}),
						openNewImage(){
							this.file.click();
							this.file.onchange = ()=>{
								const fr = new FileReader();
								fr.onload = ()=>{
									this.imgPreview.src = fr.result;
								}
								fr.readAsDataURL(this.file.files[0]);
							}
						},
						async save(){
							const data = new FormData();
							data.append('bannerFile',this.file.files[0]);
							data.append('command',this.find('input').value);
							data.append('status',this.find('select').value);
							data.append('carouselId',this.carouselId);
							const response = await new Promise((resolve,reject)=>{
								cOn.post({
									url:`${app.baseUrl}/editbanner`,
									data,
									onload(){
										resolve(this.getJSONResponse());
									}
								})
							})
							if(response.valid)
								return app.showWarnings('Data carousel berhasil disimpan!');
							app.showWarnings('Terjadi kesalahan!');
						},
						onadded(){
							this.imgPreview = this.find('#imgPreview');
							this.newImageButton = this.find('#newImageButton');
							this.newImageButton.onclick = ()=>{
								this.openNewImage();
							}
							this.find('#savebutton').onclick = ()=>{
								this.save();
							}
						}
					}))
				}
				if(!objToArray(feedback).length)
					this.pplace.addChild(makeElement('div',{
						innerHTML:'Tidak ada carousel!',
						style:`
							font-size: 12px;
					    color: gray;
					    text-align: center;
					    margin-top: 200px;
						`
					}))
			}
		})
	}
}