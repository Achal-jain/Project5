const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
};

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId){
    return mongoose.Types.ObjectId.isValid(objectId);
}

const isValidName =function (name) {
    let validNameRegex = /^[#.a-zA-Z\s,-]+$/
    return validNameRegex.test(name);
}

const isValidEmail = function (email) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
}
 
const isValidPhoneNumber = function (number) {
    let phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
}

const isValidPincode = function (pincode) {
    let pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
}

const isValidPrice = function (pincode) {
    let priceRegex = /^\d{0,8}(\.\d{1,4})?$/;
    return priceRegex.test(pincode);
}

let checkImage = (img) => {
    let imageRegex = /(jpeg|png|jpg)$/
    return imageRegex.test(img)
}

let titleCheck = (string) => {
    let titleRegex = /^[#.a-zA-Z0-9\s,-]+$/
    return titleRegex.test(string)
}

let isValidInstallment = (num) => {
    let installmentsRegex = /^[0-9]{1,2}$/
    return installmentsRegex.test(string)
}



module.exports = { isValid, isValidRequestBody, isValidObjectId, isValidName, isValidEmail, isValidPhoneNumber, isValidPincode, isValidPrice, checkImage, titleCheck, isValidInstallment }
