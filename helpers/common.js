var jwt = require('jsonwebtoken');

var authkey = 'T3Zpc2NjYW5ibG9ja2NoYWlu';

exports.createPayload = (key) =>{
	let payload = { secret : key}
	let token = jwt.sign(payload,authkey,{expiresIn : 180 * 60});
	return token;
}

exports.getUserId = (token) =>{
	try{
		let payload = jwt.verify(token,authkey);
		if(payload){
			return payload.secret;
		}
		return false;
	}
	catch(e){
		return false;
	}
}

exports.userVerification = (req,res,next)=>{
	var origin = req.headers['origin'];
	console.log(origin)
	if(origin == 'http://127.0.0.1:3000'|| origin == 'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop'){
		let token = req.headers['x-access-token'] || req.headers['authorization'];
		if (!token) {
			console.log("1")
			return res.json({status:false,message:"Unauthorized"})
		}
		token = token.split(' ')[1];
		if (token === 'null') {
			console.log("2")
			return res.json({status:false,message:"Unauthorized"})
		}
		else
		{
			let payload = jwt.verify(token,authkey);
			if (!payload) {
				console.log("3")
				return res.json({status:false,message:"Unauthorized"})
			}
			req.userId = payload.secret;
			next();
		}
	}
	else{
		console.log("4")
		return res.json({status:false,message:"Unauthorized"})
	}
}