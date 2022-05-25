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
<<<<<<< HEAD
}

let isValidPassword = function (password) {
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passwordRegex.test(password)
}


module.exports = { isValid, isValidRequestBody, isValidObjectId, isValidName, isValidEmail, isValidPhoneNumber, isValidPincode, isValidPassword}
=======
}



module.exports = { isValid, isValidRequestBody, isValidObjectId, isValidName, isValidEmail, isValidPhoneNumber, isValidPincode}
>>>>>>> 87edd36eb630433a940ffeee4b24aff332c6848f
