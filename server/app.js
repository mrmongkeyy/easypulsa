const express = require('express');
const cors = require('cors');
const formidable = require('express-formidable');
const axios = require('axios');
const crypto = require('crypto');
const md5 = require('md5');
const adminfb = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');
const { getStorage, getDownloadURL, getFileBucket } = require('firebase-admin/storage');
const serviceAccount = require("./thebattlehit-firebase-adminsdk-grujt-b725b54b6c.json");
adminfb.initializeApp({
  credential: adminfb.credential.cert(serviceAccount),
  databaseURL: "https://thebattlehit-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageUrl:"gs://thebattlehit.appspot.com"
});

const db = getDatabase();
const st = getStorage().bucket('gs://thebattlehit.appspot.com');

const app = express();

app.use(formidable());
app.use(cors());

//define the routes

app.get('/getfrontdata',async (req,res)=>{
	return res.json((await db.ref('dataFront').get()).val());
})

app.post('/setwebconfig',async (req,res)=>{
	for(let i in req.fields){
		await db.ref(i).set(req.fields[i]);
	}
	res.json({valid:true});
})

app.get('/givemewebconfig',async (req,res)=>{
	const webconfig = {};
	webconfig.dataFront = (await db.ref('dataFront').get()).val();
	webconfig.digiData = (await db.ref('digiData').get()).val();
	webconfig.duitkuData = (await db.ref('duitkuData').get()).val();
	webconfig.fonnteData = (await db.ref('fonnteData').get()).val();
	return res.json(webconfig);
})

app.get('/setnewprice',async (req,res)=>{
	try{
		await db.ref(`admin/fee/${req.query.flag}`).set(Number(req.query.value));
		res.json({valid:true});
	}catch(e){
		console.log(e);
		res.json({valid:false});
	}
	

})

app.get('/feelist',async (req,res)=>{
	res.json((await db.ref('admin/fee').get()).val());
})

app.get('/orderlist',async (req,res)=>{
	res.json((await db.ref('orders').get()).val());
})

app.get('/feedbacklist',async (req,res)=>{
	res.json((await db.ref('feedback').get()).val());
})

app.get('/updatefeelist',async (req,res)=>{
	const digiData = (await db.ref('digiData').get()).val();
	const url = 'https://api.digiflazz.com/v1/price-list';
	const response = await axios.post(url,{
		cmd:'prepaid',
		username:digiData.username,
		sign:md5(digiData.username+digiData.devKey+'pricelist')
	})
	if(response.data.data.forEach){
		const feelist = (await db.ref('admin/fee').get()).val();
		//st1 looping digi => db
		const dataSigns = [];
		response.data.data.forEach((item)=>{
			const sign = item.category + '-' + item.brand.replaceAll('.','');
			if(!feelist[sign]){
				feelist[sign] = 2000;
			}
			dataSigns.push(sign);
		})
		//st2 looping db => digi
		for(let i in feelist){
			if(!dataSigns.includes(i)){
				delete feelist[i];
			}
		}
		//now saving the newest feelist.
		await db.ref('admin/fee').set(feelist);
		return res.json({valid:true});
	}
	res.json({valid:false});
})

app.get('/pricelist',async (req,res)=>{
	const digiData = (await db.ref('digiData').get()).val();
	const url = 'https://api.digiflazz.com/v1/price-list';
	const response = await axios.post(url,{
		cmd:'prepaid',
		username:digiData.username,
		sign:md5(digiData.username+digiData.devKey+'pricelist')
	})
	//update data
	const admin = (await db.ref('admin').get()).val();
	const products = {};
	if(response.data.data.forEach){
		response.data.data.forEach((data)=>{
			if(!data.buyer_product_status && !data.seller_product_status)
				return
			if(admin.fee[data.category + '-' + data.brand.replaceAll('.','')]){
				data.price += admin.fee[data.category + '-' + data.brand.replaceAll('.','')];
			}else data.price += 2000;
			data.thumbnail = admin.thumbnails[data.brand.replaceAll('.','')];
			if(products[data.category]){
				if(products[data.category][data.brand])
					products[data.category][data.brand].data.push(data);
				else
					products[data.category][data.brand] = {details:{bannerUrl:admin.carousel[data.category + '-' + data.brand.replaceAll('.','')].bannerUrl},data:[data]};
			}else{
				const innerData = {};
				innerData[data.brand] = {details:{bannerUrl:admin.carousel[data.category + '-' + data.brand.replaceAll('.','')].bannerUrl},data:[data]};
				products[data.category] = innerData;	
			}
		})
		res.json({products,paymentMethods:admin.paymentSettings,carousel:admin.carousel,valid:true});	
	}else {
		res.json({valid:false});
	}
	
})

app.get('/carousellist',async (req,res)=>{
	res.json((await db.ref('admin/carousel').get()).val());
})

app.post('/sendbroadcast',async (req,res)=>{
	try{
		const response = await fonnte.sendBroadcast(req.fields.message);
		res.json({valid:response.data.status});
	}catch(e){
		console.log(e);
		res.json({valid:false})
	}
})

app.post('/editbanner',async (req,res)=>{
	let bannerUrl;let fileId;
	const currentCarouselData = (await db.ref(`admin/carousel/${req.fields.carouselId}`).get()).val();
	if(req.files && req.files.bannerFile){
		const newfileid = `${new Date().getTime()}.${req.files.bannerFile.type.split('/')[1]}`;
		try{
			await st.upload(req.files.bannerFile.path,{destination:newfileid,resumable:true});
			bannerUrl = await getDownloadURL(st.file(newfileid));
			fileId = newfileid;
			if(currentCarouselData.fileId)
				await st.file(currentCarouselData.fileId).delete();
		}catch(e){
			console.log(e);
			return res.json({valid:false});
		}
	}
	currentCarouselData.command = req.fields.command;
	currentCarouselData.active = req.fields.status === 'On';
	if(bannerUrl && fileId){
		currentCarouselData.bannerUrl = bannerUrl;
		currentCarouselData.fileId = fileId;
	}
	await db.ref(`admin/carousel/${req.fields.carouselId}`).set(currentCarouselData);
	res.json({valid:true});
})

app.get('/getpayment',async (req,res)=>{
	const duitkuData = (await db.ref('duitkuData').get()).val();
	let formattedDateTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
	const nospacies = formattedDateTime.replace(',','').split(' ');
	nospacies[0] = nospacies[0].split('/');
	nospacies[0] = `${nospacies[0][2]}-${nospacies[0][1]}-${nospacies[0][0]}`;
	const datetime = `${nospacies[0]} ${nospacies[1]}`;
	const merchantCode = duitkuData.merchantCode;
	const apiKey = duitkuData.apiKey;
	const paymentAmount = Number(req.query.price);
	const signature = crypto.createHash('sha256')
    .update(merchantCode + paymentAmount + datetime + apiKey)
    .digest('hex');
	const params = {
    merchantcode: merchantCode,
    amount: paymentAmount,
    datetime: datetime,
    signature: signature
	};

	const url = 'https://passport.duitku.com/webapi/api/merchant/paymentmethod/getpaymentmethod';

	axios.post(url, params, {
    headers: {
        'Content-Type': 'application/json'
    }
	})
  .then(response => {
      res.json({ok:true,results:response.data});
  })
  .catch(error => {
      if (error.response) {
          const httpCode = error.response.status;
          const errorMessage = "Server Error " + httpCode + " " + error.response.data.Message;
          console.log(errorMessage);
      } else {
          console.log(error.message);
      }
      res.json({ok:false});
  });
})

app.post('/newcsfeedback',async (req,res)=>{
	try{
		await db.ref(`feedback/${req.fields.timeId}`).set(req.fields);
		res.json({valid:true});
	}catch(e){
		res.json({valid:false});
	}
})

app.get('/getvisitordata',async (req,res)=>{
	res.json({data:(await db.ref('visitor').get()).val()||{}});
})
app.get('/getordersdata',async (req,res)=>{
	res.json({data:(await db.ref('orders').get()).val()||{}});
})


app.post('/addmorevisitor',async (req,res)=>{
	if(!req.fields.ip)
		return res.json({valid:false});
	await db.ref(`visitor/${req.fields.timeString}/${req.fields.ip}`).set(true);
	res.json({valid:true});
})

app.post('/newvoucher',async (req,res)=>{
	await db.ref(`vouchers/${req.fields.data.code}`).set(req.fields.data);
	res.json({valid:true});
})

app.get('/voucherstatus',async (req,res)=>{
	const voucherData = (await db.ref(`vouchers/${req.query.code}`).get()).val();
	if(!voucherData)
		return res.json({valid:false,message:'Voucher tidak ditemukan!'});
	//validation, voucher having some property. category, type, value;
	if(voucherData.category !== '*' && voucherData.category !== req.query.category)
		return res.json({valid:false,message:'Voucher tidak dapat digunakan pada produk kategori ini!'});
	if(voucherData.brand !== '*' && voucherData.brand !== req.query.brand)
		return res.json({valid:false,message:'Voucher tidak dapat digunakan pada produk brand ini!'});
	if(voucherData.sku !== '*' && voucherData.sku !== req.query.sku)
		return res.json({valid:false,message:'Voucher tidak dapat digunakan pada produk varian ini!'});
	res.json({valid:true,message:'Voucher dapat digunakan!'});
})

const useSaldoGuarantee = async (req,res,digiproduct)=>{
	const dateCreate = new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
	const merchantOrderId = Date.parse(dateCreate).toString();
	console.log('Method used is saldo guarantee');
	if(!req.fields.saldoId)
		return res.json({ok:false,message:'SaldoId dibutuhkan!'});
	let userSaldo = (await db.ref(`saldo/${req.fields.saldoId}`).get()).val();
	if(userSaldo < req.fields.price)
		return res.json({ok:false,message:'Saldo anda tidak mencukupi!'});
	userSaldo -= req.fields.price;
	await db.ref(`saldo/${req.fields.saldoId}`).set(userSaldo);
	//time to make order.
	const orderData = {payments:{orderId:merchantOrderId,dateCreate,status:'Success',profit:req.fields.price - digiproduct.price},products:req.fields};
	let digiresponse = await digiOrder(orderData,{sku:orderData.products.productVarian,nocustomer:orderData.products.goalNumber,refid:merchantOrderId});
	console.log('digi response, ',digiresponse);
	if(digiresponse.data && digiresponse.data.status)
		orderData.products.status = digiresponse.data.status;
	orderData.digiresponse = digiresponse.data;
	await db.ref(`orders/${merchantOrderId}`).set(orderData);
	res.json({ok:true,data:orderData.payments});
}

const reorder = async (req,res,productStatus)=>{
	console.log('trying to reorder!');

	const oldOrderData = (await db.ref(`orders/${req.fields.payments.orderId}`).get()).val();
	if(oldOrderData.payments.status !== 'Success')
		return res.json({ok:false,message:'Garansi reorder tidak tersedia!'});
	if(oldOrderData.products.status === 'Sukses')
		return res.json({ok:false,message:'Garansi reorder tidak tersedia!'});
	if(oldOrderData.rg)
		return res.json({ok:false,message:'Garansi telah dipakai!'});
	//ordering new product.
	return res.json(oldOrderData);
	const dateCreate = new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
	const merchantOrderId = Date.parse(dateCreate).toString();
	const orderData = req.fields;
	let digiresponse = await digiOrder(orderData,{sku:orderData.products.productVarian,nocustomer:orderData.products.goalNumber,refid:merchantOrderId});
	if(digiresponse.data && digiresponse.data.status)
		orderData.products.status = digiresponse.data.status;
	orderData.digiresponse = digiresponse.data;
	await db.ref(`orders/${merchantOrderId}`).set(orderData);
	oldOrderData.rg = true;
	await db.ref(`orders/${req.fields.payments.orderId}`).set(oldOrderData);
	res.json({ok:true,data:orderData});
}

const processVoucher = (param)=>{
	return new Promise(async (resolve,reject)=>{
		console.log('User using voucher');

		/*
			getting voucher info.
			apply it to the price.
		*/

		const voucherData = (await db.ref(`vouchers/${param.voucher}`).get()).val();
		if(voucherData){
			if(voucherData.category !== '*' && voucherData.category !== param.category)
				return resolve(param.price);
			if(voucherData.brand !== '*' && voucherData.brand !== param.brand)
				return resolve(param.price);
			if(voucherData.sku !== '*' && voucherData.sku !== param.productVarian)
				return resolve(pram.price);
			let price = Math.round(Number(param.price) - (Number(param.price)*Number(voucherData.percent)/100));
			voucherData.quota = Number(voucherData.quota);
			voucherData.quota -= 1;
			if(voucherData.quota === 0)
				await db.ref(`vouchers/${param.voucher}`).remove();
			else await db.ref(`vouchers/${param.voucher}`).set(voucherData);
			return	resolve(price);
		}
		resolve(param.price);
	})
}

app.post('/dopayment',async (req,res)=>{

	//make sure to check newest status of the product.
	const productStatus = await productRechecker(req.fields.productVarian);
	if(!productStatus)
		return res.json({ok:false,message:'Terjadi kesalahan, harap coba sesaat lagi!'});
	if(!productStatus.buyer_product_status || !productStatus.seller_product_status)
		return res.json({ok:false,message:'Maaf, tidak dapat melakukan order. Product sedang bermasalah, silahkan coba beberapa saat lagi'});

	if(req.fields.reorder)
		return reorder(req,res,productStatus);

	//working with voucher.
	if(req.fields.voucher){
		req.fields.price = await processVoucher(req.fields);
	}
	//some route, to handling saldo guarantee method selected.
	if(req.fields.paymentMethod === 'gs')
		return useSaldoGuarantee(req,res,productStatus);

	
	//payment sections.
	const duitkuData = (await db.ref('duitkuData').get()).val();

	const merchantCode = duitkuData.merchantCode;
	const apiKey = duitkuData.apiKey;
	const paymentAmount = req.fields.price;
	const paymentMethod = req.fields.paymentMethod;
	const dateCreate = new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
	const merchantOrderId = Date.parse(dateCreate).toString();
	const productDetails = `Pembayaran ${req.fields.varianName}`;
	const email = 'gemalagifrominfinitydreams@gmail.com';
	const phoneNumber = req.fields.goalNumber;
	const expiryPriod = 10;
	const returnUrl = duitkuData.returnUrl;
	const callbackUrl = duitkuData.callbackUrl;

	const firstName = 'John';
	const lastName = 'Doe';
	const alamat = 'Jl. Kembangan Raya';
	const city = 'Jakarta';
	const postalCode = '11530';
	const countryCode = 'ID';

	const address = {
	  firstName: firstName,
	  lastName: lastName,
	  address: alamat,
	  city: city,
	  postalCode: postalCode,
	  phone: phoneNumber,
	  countryCode: countryCode,
	};

	const customerDetail = {
	  firstName,
	  lastName,
	  email,
	  phoneNumber,
	  billingAddress: address,
	  shippingAddress: address,
	};

	const item1 = {
	  name: req.fields.varianName,
	  price: paymentAmount,
	  quantity: 1,
	};

	const itemDetails = [item1];

	const signature = crypto.createHash('md5').update(merchantCode + merchantOrderId + paymentAmount + apiKey).digest('hex');

	const params = {
	  merchantCode,
	  paymentAmount,
	  paymentMethod,
	  merchantOrderId,
	  productDetails,
	  email,
	  phoneNumber,
	  itemDetails,
	  customerDetail,
	  signature,
	  expiryPriod,
	  returnUrl,
	  callbackUrl
	};

	axios.post('https://passport.duitku.com/webapi/api/merchant/v2/inquiry', params, {
	  headers: {
	    'Content-Type': 'application/json',
	  },
	})
	  .then(async response => {
	    const result = response.data;
	    if(result.statusCode === '00'){
	    	const orderId = merchantOrderId;
	    	const response = {ok:true,data:{orderId,dateCreate,status:'Pending',profit:req.fields.price - productStatus.price,paymentUrl:result.paymentUrl,vaNumber:result.vaNumber||null,qrString:result.qrString||null}};
	    	const savingStatus = await db.ref(`orders/${orderId}`).set({products:req.fields,payments:response.data});
	    	res.json(response);
	    }else{
	    	res.json({ok:false,message:result.statusMessage});
	    }
	  })
	  .catch(error => {
	    if (error.response) {
	      const httpCode = error.response.status;
	      const errorMessage = 'Server Error ' + httpCode + ' ' + error.response.data.Message;
	      console.log(errorMessage);
	    	res.json({ok:false,message:errorMessage});
	    } else {
	      console.log(error.message);
	      res.json({ok:false,message:error.message});
	    }
	  });
})

app.post('/newdigidepo',async (req,res)=>{
	const digiData = (await db.ref('digiData').get()).val();
	const url = 'https://api.digiflazz.com/v1/deposit';
	try{
		const digiReks = {
			MANDIRI:'',
			BRI:'',
			BNI:'',
			BCA:''
		}
		const response = await axios.post(url,{
			username:digiData.username,
			amount:Number(req.fields.amount),
			Bank:req.fields.bank,
			owner_name:req.fields.rekname,
			sign:md5(digiData.username+digiData.devKey+'deposit')
		})
		const data = response.data.data;
		if(data.rc && data.rc === '00'){
			data.valid = true;
			data.rekdigi = digiReks[req.fields.bank];
			Object.assign(data,req.fields);
		}
		res.json(data);	
	}catch(e){
		const response = {valid:false,message:'Terjadi kesalahan!'};
		if(e.response)
			response.message = e.response.data.data.message;
		res.json(response);
	}
})

app.get('/duitkubalance',async (req,res)=>{
	const duitkuData = (await db.ref('duitkuData').get()).val();
	const secretKey = duitkuData.disbursementSecret || '';
	const userId = duitkuData.merchantCode;
	const email = duitkuData.email || 'gemalagifrominfinitydreams@gmail.com';
	const timestamp = Math.round(new Date().getTime());
	const paramSignature = email + timestamp + secretKey;

	const signature = crypto.createHash('sha256').update(paramSignature).digest('hex');

	const params = {
	  userId,
	  email,
	  timestamp,
	  signature,
	};

	const paramsString = JSON.stringify(params);
	// const url = 'https://sandbox.duitku.com/webapi/api/disbursement/checkbalance'; // Sandbox
	const url = 'https://passport.duitku.com/webapi/api/disbursement/checkbalance'; // Production

	console.log('called');
	axios.post(url, paramsString, {
	  headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': paramsString.length.toString(),
	  },
	  // httpsAgent: { rejectUnauthorized: false }, // Disabling SSL verification (not recommended for production)
	})
	  .then(response => {
	    if (response.status === 200) {
	      res.json({valid:true,message:'Informasi saldo berhasil di load!',data:response.data});
	    } else {
	    	res.json({valid:false,message:'Terjadi kesalahan saat memuat informasi saldo Duitku anda!'});  
	    }
	  })
	  .catch(error => {
	    console.error(error);
	    res.json({valid:false,message:'Terjadi kesalahan saat memuat informasi saldo Duitku anda!'});
	  });


})

const requestInquiryOnlineTF = (param,duitkuData)=>{
	return new Promise(async (resolve,reject)=>{
		const userId = duitkuData.merchantCode;
		const secretKey = duitkuData.disbursementSecret;
		const amountTransfer = param.amount;
		const bankAccount = param.bankAccount;
		const bankCode = param.bankCode;
		const email = duitkuData.email || 'gemalagifrominfinitydreams@gmail.com';
		const purpose = 'Tarik Uang...';
		const timestamp = Math.round(new Date().getTime());
		const senderId = timestamp;
		const senderName = 'EasyPulsa Admin';
		const paramSignature = email + timestamp + bankCode + bankAccount + amountTransfer + purpose + secretKey;

		const signature = crypto.createHash('sha256').update(paramSignature).digest('hex');

		const params = {
		  userId,
		  amountTransfer,
		  bankAccount,
		  bankCode,
		  email,
		  purpose,
		  timestamp,
		  senderId,
		  senderName,
		  signature,
		};

		const paramsString = JSON.stringify(params);
		const url = 'https://sandbox.duitku.com/webapi/api/disbursement/inquirysandbox'; // Sandbox
		// const url = 'https://passport.duitku.com/webapi/api/disbursement/inquiry'; // Production

		try{
			const response = await axios.post(url, paramsString, {
			  headers: {
			    'Content-Type': 'application/json',
			    'Content-Length': paramsString.length.toString()
			  },
			  // httpsAgent: { rejectUnauthorized: false }, // Disabling SSL verification (not recommended for production)
			});
	    if (response.status === 200 && response.data.responseCode && response.data.responseCode === '00') {
	    	const result = response.data;
	    	result.valid = true;
	    	result.message = 'Request Berhasil!';
	    	resolve(result);
	    } else {
	      resolve({valid:false,message:'Terjadi kesalahan!'});
	    }
		}catch(e){
			resolve({valid:false,e,message:'Terjadi Kesalahan!'});
		}
	})
}
const requestOnlineTransfer = (param,inquiryData,duitkuData)=>{
	return new Promise(async (resolve,reject)=>{
		const disburseId = inquiryData.disburseId;
		const secretKey = duitkuData.disbursementSecret;
		const userId = duitkuData.merchantCode;
		const email = duitkuData.email;
		const bankCode = param.bankCode;
		const bankAccount = param.bankAccount;
		const amountTransfer = param.amount;
		const accountName = inquiryData.accountName;
		const custRefNumber = inquiryData.custRefNumber;
		const purpose = 'Tarik Uang...';
		const timestamp = Math.round(new Date().getTime());
		const paramSignature = email + timestamp + bankCode + bankAccount + accountName + custRefNumber + amountTransfer + purpose + disburseId + secretKey;

		const signature = crypto.createHash('sha256').update(paramSignature).digest('hex');

		const params = {
		  disburseId,
		  userId,
		  email,
		  bankCode,
		  bankAccount,
		  amountTransfer,
		  accountName,
		  custRefNumber,
		  purpose,
		  timestamp,
		  signature,
		};

		const paramsString = JSON.stringify(params);
		const url = 'https://sandbox.duitku.com/webapi/api/disbursement/transfersandbox'; // Sandbox
		// const url = 'https://passport.duitku.com/webapi/api/disbursement/transfer'; // Production

		axios.post(url, paramsString, {
		  headers: {
		    'Content-Type': 'application/json',
		    'Content-Length': paramsString.length.toString()
		  },
		  // httpsAgent: { rejectUnauthorized: false }, // Disabling SSL verification (not recommended for production)
		})
		  .then(response => {
		    if (response.status === 200 && response.data.responseCode && response.data.responseCode === '00') {
		      const result = response.data;
		      result.valid = true;
		      result.message = 'Request Berhasil!';
		      resolve(result);
		    } else {
		      resolve({valid:false,message:'Terjadi kesalahan!'});
		    }
		  })
		  .catch(error => {
		    resolve({valid:false,message:'Terjadi kesalahan!'});
		  });

	})
}

app.post('/disbursement',async (req,res)=>{
	const duitkuData = (await db.ref('duitkuData').get()).val();
	const inquiryData = await requestInquiryOnlineTF(req.fields,duitkuData);
	if(!inquiryData.valid)
		return res.json(inquiryData);
	const onlineTf = await requestOnlineTransfer(req.fields,inquiryData,duitkuData);
	res.json(onlineTf);
})

app.get('/orderdetails',async (req,res)=>{
	/*
		simpel flow.

		1. get order id from user
		2. get order data on db
		3. make request to digi
		4. comparing that 2 data
		5. merge data, get new data
		6. update data on db
		7. send this data to client
		8. client must be handling this data

	*/
	const digiData = (await db.ref('digiData').get()).val();
	const orderData = (await db.ref(`orders/${req.query.orderId}`).get()).val();

	if(!orderData)
		return res.json({valid:false});

	if(orderData.payments.status === 'Success' && orderData.products.status === 'Pending'){
		const url = 'https://api.digiflazz.com/v1/transaction';
		const response = await axios.post(url,{
			username:digiData.username,
			buyer_sku_code:orderData.products.productVarian,
			customer_no:orderData.products.goalNumber,
			ref_id:orderData.payments.orderId,
			sign:md5(digiData.username+digiData.devKey+orderData.payments.orderId)
		})
		orderData.products.status = response.data.status;
		orderData.digiresponse = response.data;
		await db.ref(`orders/${req.query.orderId}`).set(orderData);
	}
	res.json({valid:true,data:orderData});
})

app.get('/getsaldo',async (req,res)=>{
	const digiData = (await db.ref('digiData').get()).val();
	const url = 'https://api.digiflazz.com/v1/cek-saldo';
	const response = await axios.post(url,{
		cmd:'deposit',
		username:digiData.username,
		sign:md5(digiData.username+digiData.devKey+'depo')
	})
	res.json(response.data);
})

app.post('/duitkunotify',async (req,res)=>{
	console.log(req.fields);
	const duitkuData = (await db.ref('duitkuData').get()).val();
	const apiKey = duitkuData.apiKey;
	const {
    merchantCode,
    amount,
    merchantOrderId,
    signature,
    paymentMethod,
    productDetail,
    additionalParam,
    resultCode,
    settlementDate,
    issuerCode
  } = req.fields;
	if (merchantCode && amount && merchantOrderId && signature) {
    const params = merchantCode + amount + merchantOrderId + apiKey;
    const calcSignature = md5(params);
		if (signature === calcSignature) {
      /*
				simple actions

				1. get the merchantOrderId
				2. get data to db
				3. check callback data
				4. when success, yes process the digi order.
    	*/
    	const orderData = (await db.ref(`orders/${merchantOrderId}`).get()).val();
    	orderData.payments.changedDate = new Date().toLocaleString('en-US',{ timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    	if(orderData){
    		if(resultCode === '00'){
    			//when the status is success.
    			orderData.payments.status = 'Success';
					let digiresponse = await digiOrder(orderData,{sku:orderData.products.productVarian,nocustomer:orderData.products.goalNumber,refid:merchantOrderId});
					if(digiresponse.data && digiresponse.data.status)
    				orderData.products.status = digiresponse.data.status;
    			orderData.digiresponse = digiresponse.data;
    			console.log('digi response',digiresponse);
    		}else{
    			orderData.payments.status = 'Canceled';
    			orderData.products.status = 'Gagal';
    		}
    		orderData.duitkuresponse = req.fields;
    		await db.ref(`orders/${merchantOrderId}`).set(orderData);
    	}
			res.status(200).send('Success');
    } else {
      res.status(400).send('Bad Signature');
    }
  } else {
    res.status(400).send('Bad Parameter');
  }
})

app.post('/diginotify',async (req,res)=>{
	const digiData = (await db.ref('digiData').get()).val();
	const secret = digiData.webhookSecret;
	const post_data = req.fields;
  const signature = crypto.createHmac('sha1', secret).update(JSON.stringify(post_data)).digest('hex');
  if (req.headers['x-hub-signature'] === `sha1=${signature}`) {
    console.log('data fields from digi webhook',req.fields);
    // Process the webhook payload here
    const orderData = (await db.ref(`orders/${post_data.data.ref_id}`).get()).val();
    if(orderData){
    	orderData.products.status = post_data.data.status;
    	orderData.digiresponse = post_data.data;
    	await db.ref(`order/${post_data.data.ref_id}`).set(orderData);
    	//sending fonnte notification
    	await fonnte.sendMessage(orderData,'digiStatusChanged');
    }
    res.status(200).send('Webhook received successfully');
  } else {
    res.status(401).send('Invalid signature');
  }
})


app.post('/newfeedback',async (req,res)=>{
	const feedValue = req.fields.value;
	const ratevalue = req.fields.ratevalue;
	await db.ref(`feedback/${req.fields.orderId}`).set({feedValue,ratevalue});
	res.send('Feed back berhasil dikirim');
})

app.post('/feedbackreply',async (req,res)=>{
	try{
		const response = await fonnte.reply(req.fields);
		if(response.data.status)
			await db.ref(`feedback/${req.fields.feedId}`).remove();
		res.json({valid:response.data.status});
	}catch(e){
		res.json({valid:false});
	}
})

app.get('/saldoclaim',async (req,res)=>{
	const orderData = (await db.ref(`orders/${req.query.orderId}`).get()).val();
	if(orderData.payments.status != 'Success'){
		return res.json({valid:false,message:'Order tidak mendapat garansi!'});
	}
	if(orderData.products.status === 'Sukses'){
		return res.json({valid:false,message:'Order tidak mendapat garansi!'});
	}
	if((await db.ref(`claimedsaldo/${req.query.orderId}`).get()).val())
		return res.json({valid:false,message:'Saldo sudah diklaim!'});
	await db.ref(`claimedsaldo/${req.query.orderId}`).set(true);
	const saldoId = req.query.saldoId || new Date().getTime();
	let saldo = (await db.ref(`saldo/${saldoId}`).get()).val()||0;
	saldo += orderData.products.price;
	await db.ref(`saldo/${saldoId}`).set(saldo);
	res.json({valid:true,message:'Saldo berhasil diklaim!',saldoId});
})

app.get('/guaranteesaldo',async (req,res)=>{
	const price = (await db.ref(`saldo/${req.query.saldoId}`).get()).val();
	if(!price)
		return res.json({valid:false});
	res.json({valid:true,price});
})

//functions

const productRechecker = (buyyerProductCode) => {
	return new Promise(async (resolve,reject)=>{
		const digiData = (await db.ref('digiData').get()).val();
		const url = 'https://api.digiflazz.com/v1/price-list';
		const response = await axios.post(url,{
			cmd:'prepaid',
			username:digiData.username,
			sign:md5(digiData.username+digiData.devKey+'pricelist'),
			code:buyyerProductCode
		})
		resolve(response.data.data[0]);
	})
}
const digiOrder = (orderData,param) => {
	return new Promise(async (resolve,reject)=>{
		const digiData = (await db.ref('digiData').get()).val();
		const digiSaldo = await getDigiSaldo();
		if(digiSaldo.data.deposit >= digiData.minSaldoToMakeOrder || 50000){
			//process digi order
			const url = 'https://api.digiflazz.com/v1/transaction';
			const response = await axios.post(url,{
				username:digiData.username,
				buyer_sku_code:param.sku,
				customer_no:param.nocustomer,
				ref_id:param.refid,
				sign:md5(digiData.username+digiData.devKey+param.refid)
			})
			resolve(response);
		}else{
			//send notifications to owner, that no saldo left on digi acount | digi saldo is currently small.
			await fonnte.sendMessage(Object.assign(orderData,digiSaldo),'needMoreSaldo');
			resolve({data:{status:'Gagal',message:'Saldo digi tidak mencukupi, order dibatalkan'}});
		}
	})
}
const getDigiSaldo = () => {
	return new Promise(async (resolve,reject)=>{
		const digiData = (await db.ref('digiData').get()).val();
		const url = 'https://api.digiflazz.com/v1/cek-saldo';
		const response = await axios.post(url,{
			cmd:'deposit',
			username:digiData.username,
			sign:md5(digiData.username+digiData.devKey+'depo')
		})
		resolve(response);	
	})
}

//object app
const fonnte = {
	apiUrl:'https://api.fonnte.com/send',
	sendMessage(commands,templateId){
		return new Promise(async (resolve,reject)=>{
			const fonnteData = (await db.ref('fonnteData').get()).val();
			/*
				token, ownerNumber, messageTemplate
			*/
		  const requestData = {
		    target: fonnteData.ownerNumber,
		    message: this.getMessage(commands,fonnteData.messageTemplate[templateId])
		  };
		  const response = await axios.post(this.apiUrl, requestData, {
	      headers: {
	        Authorization: fonnteData.token
	      },
	    });
	    resolve(response);
		})
		
	},
	sendBroadcast(message){
		return new Promise(async (resolve,reject)=>{
			const fonnteData = (await db.ref('fonnteData').get()).val();
			/*
				token, ownerNumber, messageTemplate
			*/
			let customerNumbers = '';
			const orders = (await db.ref('orders').get()).val();
			for(let i in orders){
				customerNumbers += `${orders[i].products.waNotif},`;
			}
		  const requestData = {
		    target: customerNumbers,
		    delay:fonnteData.delayBroadcast || '2',
		    message
		  };
		  const response = await axios.post(this.apiUrl, requestData, {
	      headers: {
	        Authorization: fonnteData.token
	      },
	    });
	    resolve(response);
		})
	},
	reply(param){
		return new Promise(async (resolve,reject)=>{
			const fonnteData = (await db.ref('fonnteData').get()).val();
			/*
				token, ownerNumber, messageTemplate
			*/
		  const requestData = {
		    target: param.to,
		    message:param.message
		  };
		  const response = await axios.post(this.apiUrl, requestData, {
	      headers: {
	        Authorization: fonnteData.token
	      },
	    });
	    resolve(response);
		})
	},
	getMessage(commands,templateMsg){
		let text = templateMsg;
		//working with variable '{}'
		const parsed = text.split('{');
		const lparsed = [];
		parsed.forEach(string=>{
		    const indexC = string.indexOf('}');
		    if(indexC !== -1){
		        const indexStrings = string.split('}');
		        lparsed.push(commands[indexStrings[0]]);
		        lparsed.push(indexStrings[1]);
		    }else
		        lparsed.push(string);
		})
		return lparsed.join('');
	}
}


app.listen(8080,()=>{
	console.log('Listening on port 8080');
})
