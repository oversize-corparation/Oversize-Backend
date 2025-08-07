"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressValidator = exports.sendOtpValidator = exports.verifyOtpValidator = exports.loginValidator = exports.userValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const codeOtpPattern = /^[1-9][0-9]{5}$/;
const lastname = joi_1.default.string().max(100).min(3).required().messages({
    'string.base': 'lastname must be a string.',
    'string.empty': 'lastname can not be a empty.',
    'string.min': 'lastname must be at least 3 characters long.',
    'string.max': 'lastname must be no longer than 100 characters.',
    'any.required': 'lastname is required'
});
const firstname = joi_1.default.string().max(100).min(3).required().messages({
    'string.base': 'firstname must be a string.',
    'string.empty': 'firstname can not be a empty.',
    'string.min': 'firstname must be at least 3 characters long.',
    'string.max': 'firstname must be no longer than 100 characters.',
    'any.required': 'firstname is required'
});
const email = joi_1.default.string().email().pattern(emailPattern).required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email can not be a empty.',
    'string.email': 'Please enter a valid email address.',
    'string.pattern.base': 'Email does not match the required pattern.',
    'any.required': 'Email is required'
});
const avatar_url = joi_1.default.string().max(100).min(3).messages({
    'string.base': 'avatar_url must be a string.',
    'string.min': 'avatar_url must be at least 3 characters long.',
    'string.max': 'avatar_url must be no longer than 100 characters.'
});
const phone_number = joi_1.default.string().required().messages({
    'string.base': 'Phone must be a string.',
    'string.empty': 'Phone can not be a empty.',
    'any.required': 'Phone is required'
});
const password = joi_1.default.string().max(50).min(3).required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password can not be a empty.',
    'string.min': 'Password must be at least 3 characters long.',
    'string.max': 'Password must be no longer than 50 characters.',
    'any.required': 'Password is required'
});
const prev_password = joi_1.default.string().max(50).min(3).messages({
    'string.base': 'Prev password must be a string.',
    'string.empty': 'Prev password can not be a empty.',
    'string.min': 'Prev password must be at least 3 characters long.',
    'string.max': 'Prev password must be no longer than 50 characters.',
});
const verify_email = joi_1.default.boolean().messages({
    'string.base': 'verify_email must be a boolean.',
});
// export const createFlowerValidator = (updateData:UserRegisterInterface) => {
//   let validator = {};
//   if(updateData.hasOwnProperty("lastname")) validator.lastname = lastname;
//   if(updateData.hasOwnProperty("firstname")) validator.firstname = firstname;
//   if(updateData.hasOwnProperty("email")) validator.email = email;
//   if(updateData.hasOwnProperty("password")) validator.password = password;
//   if(updateData.hasOwnProperty("phone_number")) validator.phone_number = phone_number;
//   if(updateData.hasOwnProperty("avatar_url")) validator.avatar_url = avatar_url;
//   return Joi.object(validator);
// }
exports.userValidator = joi_1.default.object({ lastname, firstname, email, password, phone_number, avatar_url, verify_email, prev_password });
exports.loginValidator = joi_1.default.object({ email, password });
// OTP
const emailOtp = joi_1.default.string().email().pattern(emailPattern).required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email can not be a empty.',
    'string.email': 'Please enter a valid email address.',
    'string.pattern.base': 'Email does not match the required pattern.',
    'any.required': 'Email is required'
});
const codeOtp = joi_1.default.string().pattern(codeOtpPattern).required().messages({
    'string.empty': 'codeOtp can not be a empty.',
    'string.pattern.base': 'codeOtp does not match the required pattern.',
    'any.required': 'codeOtp is required'
});
const restoration = joi_1.default.boolean().required().messages({
    'boolean.base': 'restoration must be a boolean value.',
    'any.required': 'restoration is required.'
});
exports.verifyOtpValidator = joi_1.default.object({ email: emailOtp, code: codeOtp, restoration });
exports.sendOtpValidator = joi_1.default.object({ email: emailOtp });
exports.addressValidator = joi_1.default.object({
    title: joi_1.default.string().min(2).max(100).required().messages({
        'string.base': 'Title must be a string.',
        'string.empty': 'Title is required.',
        'string.min': 'Title must be at least 2 characters long.',
        'string.max': 'Title must be less than or equal to 100 characters.',
        'any.required': 'Title is required.',
    }),
    address_line: joi_1.default.string().min(5).max(255).required().messages({
        'string.base': 'Address must be a string.',
        'string.empty': 'Address is required.',
        'string.min': 'Address must be at least 5 characters long.',
        'string.max': 'Address must be less than or equal to 255 characters.',
        'any.required': 'Address is required.',
    }),
    map_url: joi_1.default.string().uri().allow(null, '').optional().messages({
        'string.uri': 'Map URL must be a valid URI.',
    }),
    is_default: joi_1.default.boolean().default(false).messages({
        'boolean.base': 'is_default must be a boolean.',
    }),
});
