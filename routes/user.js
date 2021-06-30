// required modules
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

// initialize the router
const router = express.Router();

// models
const users = require('../model/users');
const posts = require('../model/instaPost');
const likeComments = require('../model/likesComments');



// helpers
const common = require('../helpers/common');
const cloudinary = require('../helpers/cloudinary');
const encdec = require('../helpers/endecryption');

var storage = multer.diskStorage({
	filename:function(req,file,cb){
		cb(null,file.originalname);
	}
});

var upload = multer({storage:storage});

router.post('/registeration',(req,res,next)=>{
	let userData = req.body;
	// let pwd = encdec.encrypt(userData.password);
	
		if(userData.password != userData.confirmPassword){
			res.json({status:false,message:"The password and confirm password is not same"})
		}
		else
		{
			let password = encdec.encrypt(userData.password);
			let confirmPassword = encdec.encrypt(userData.confirmPassword);

			userData.password = password;
			userData.confirmPassword = confirmPassword;
			users.find({"mobileNumber" : userData.mobileNumber},(err,response)=>{
				if (err) {
					res.json({status:false,message:"Query error"})
				}
				else{
					if (response.length == 0) {
						users.create(userData,(err,response)=>{
							if (err) {
								res.json({status:false,message:"Query error"})
							}
							else{
								res.json({status:true,message:"Successfully registered"})
							}
						})
					}
					else
					{
						res.json({status:true,message:"Already registered.! please try another Mobile Number"})
					}
				}
			})
		}
})

router.post('/login',(req,res,next)=>{
	let userData = req.body;
	let password = userData.password;
	password = encdec.encrypt(password);
	
	users.find({$and:[{"mobileNumber":userData.mobileNumber},{"password": password}]},(err,response)=>{
		if(err){
			res.json({status:false,message:"Query error"})
		}
		else
		{
			if (response.length == 0) {
				res.json({status:false,message:"Invalid login credentials"})
			}
			else
			{
				let userId = response[0]._id
				let authKey = common.createPayload(userId);
				res.json({status:true,message:"Login Successfully",token:authKey})
			}
		}
	})
})

router.post('/viewMyProfile',common.userVerification,(req,res,next)=>{
	let userId = req.userId;
	users.find({"_id":userId},{"firstName":1,"lastName":1,"mobileNumber":1,"dob":1},(err,response)=>{
		if (err) {
			res.json({status:false,message:"Failed"})
		}
		else{
			let myProfile = {};
			myProfile.firstName = response[0].firstName;
			myProfile.lastName = response[0].lastName;
			myProfile.mobileNumber = response[0].mobileNumber;
			myProfile.dob = response[0].dob;

			res.json({status:true,message:"Success",myProfile:myProfile})
		}
	})
})

router.post('/updateProfile',upload.single('profileImage'),common.userVerification,(req,res,next)=>{
	
	let info = req.body;
	info.userId = req.userId;
	uploadImageCloud(req, function(data){
		updateProfileData(info,data,req,res);
	})
})

// upload image

function uploadImageCloud(req,callback){
	var uploadImg = "";
	if (typeof req.file != 'undefined' && typeof req.file != undefined && req.file.path != "") {
		cloudinary.uploadImage(req.file.path,(images)=>{
			uploadImg = images.secure_url;
			callback(uploadImg)
		});
	}
	else{
		callback(uploadImg);
	}
}

function updateProfileData(info,uploadImg,req,res){
	if (typeof uploadImg != 'undefined' && typeof uploadImg != undefined){
		users.findOneAndUpdate({"_id":info.userId},{$set:{"profileImage":uploadImg,"bio":info.bio,"firstName":info.firstName,"lastName":info.lastName,"mobileNumber":info.mobileNumber,"info":info.dob}},(err,response)=>{
			if (err) {
				res.json({status:false,message:"Failed"})
			}
			else
			{
				res.json({status:true,message:"profile updated Successfully"})
			}
		})
	}
}

// create post

router.post('/createPost',upload.single('postImage'),common.userVerification,(req,res,next)=>{
	let postData = req.body;
	postData.userId = req.userId;
	users.find({"_id":postData.userId},(err,response)=>{
		if (err) {
			res.json({status:false,message:"Failed"});
		}
		else
		{
			if(response.length == 0)
			{
				res.json({status:false,message:"The user not exists"});
			}
			else{
				uploadImageCloud(req, function(data){
					updatePost(postData,data,req,res);
				})
			}
		}
	})
})

function updatePost(info,uploadImg,req,res){
	info['postImage'] = uploadImg;
	if (typeof uploadImg != 'undefined' && typeof uploadImg != undefined){
		posts.create(info,(err,response)=>{
			if(err){
				res.json({status:false,message:"Failed"});
			}
			else
			{
				res.json({status:true,message:"Finished"});
			}
		})
	}
}

// another person post
router.post('/viewPost',common.userVerification,(req,res,next)=>{
	console.log(req.userId)
	posts.find({$and:[{"userId":{$ne:req.userId}},{"deleteStatus":{$ne:1}}]},(err,response)=>{
		if (err) {
			res.json({status:false,message:"Failed"});
		}
		else{
			if (response.length == 0) {
				res.json({status:false,message:"No posts available"})	
			}else{
				res.json({status:true,message:"Success",response})
			}
		}
	})
})

router.post('/likeAndComment',common.userVerification,(req,res,next)=>{
	let likes = req.body;
	likes.userId = req.userId;
	likeComments.find({$and:[{"postId":likes.postId},{"userId":likes.userId}]},(err,response)=>{
		if (err) {
			res.json({status:false,message:"Failed"})
		}
		else
		{
			if (response.length == 0) {
				likeComments.create(likes,(err,response)=>{
					if (err) {
						res.json({status:false,message:"Failed"})
					}
					else
					{
						res.json({status:true,message:"Liked"})
					}
				})
			}
			else{
				res.json({status:false,message:"Already liked"})
			}
		}
	})
	
})

router.post('/myLikes',common.userVerification,(req,res,next)=>{
	let userId = req.userId;
	likeComments.find({"receiverId":userId},{"userId":1,"comment":1,"like":1},(err,response)=>{
		if (err) {
			res.json({status:false,message:"Failed"})
		}
		else{
			if(response.length == 0){
				res.json({status:false,message:"There is no likes and comments"})
			}
			else
			{
				let likes = response.length;
				res.json({status:true,response,message:"you have" + " " + likes + " " + "likes" })
			}
		}
	})
})

router.post("/editPost",common.userVerification,(req,res,next)=>{
	let data = req.body;
	data.userId = req.userId;

	posts.findOneAndUpdate({$and:[{"userId":data.userId},{"_id":data._id}]},{$set:{"content":data.content}},(err,response)=>{
		if (err) {
			res.json({status:false,message:"Failed"})
		}
		else
		{
			res.json({status:true,message:"The post detail is edited"})
		}
	})
})


router.post("/deletePost",common.userVerification,(req,res,next)=>{
	let data = req.body;
	data.userId = req.userId;
	posts.findOneAndUpdate({$and:[{"_id":data.postId},{"userId":data.userId}]},{$set:{"deleteStatus":1}},(err,response)=>{
		if(err){
			res.json({status:false,message:"Failed"})
		}
		else{
			likeComments.deleteMany({"postId":data.postId},(err,resDelete)=>{
				if(err){
					res.json({status:false,message:"Failed"})
				}
				else{
					res.json({status:true,message:"The post is deleted"})
				}
			})
		}
	})
})


module.exports = router;