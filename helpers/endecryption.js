// var CryptoJS  = require('crypto-js');
var crypto = require('crypto');

// var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
// var mystr = mykey.update('abc', 'utf8', 'hex')
// mystr += mykey.final('hex');

// console.log(mystr); 

exports.encrypt = function (txt){
    var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update(txt, 'utf8', 'hex')
    return mystr += mykey.final('hex');
}

exports.decrypt = function(txt){
    var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
    var mystr = mykey.update(txt, 'hex', 'utf8')
    return mystr += mykey.final('utf8');
}
// var key = "#Keyinstaclone@insta";
// var iv = "BtarigaTcIroNiynbeiOoK";

// key = CryptoJS.enc.Base64.parse(key);
// iv = CryptoJS.enc.Base64.parse(iv);

// exports.encrypt = function (txt){
//   return CryptoJS.AES.encrypt(txt,key,{iv:iv}).toString()
// }

// exports.decrypt = function(txt){
//   let bytes = CryptoJS.AES.decrypt(txt.toString(),key,{iv:iv});
//   return bytes.toString(CryptoJS.enc.utf8)
// }

