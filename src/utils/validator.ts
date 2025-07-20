import Joi from 'joi';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const lastname = Joi.string().max(100).min(3).required().messages({
    'string.base': 'lastname must be a string.',
    'string.empty': 'lastname can not be a empty.',
    'string.min': 'lastname must be at least 3 characters long.',
    'string.max': 'lastname must be no longer than 100 characters.',
    'any.required': 'lastname is required' 
});

const firstname = Joi.string().max(100).min(3).required().messages({
    'string.base': 'firstname must be a string.',
    'string.empty': 'firstname can not be a empty.',
    'string.min': 'firstname must be at least 3 characters long.',
    'string.max': 'firstname must be no longer than 100 characters.',
    'any.required': 'firstname is required' 
});

const email = Joi.string().email().pattern(emailPattern).required().messages({
    'string.base': 'Email must be a string.',
    'string.empty': 'Email can not be a empty.',
    'string.email': 'Please enter a valid email address.',
    'string.pattern.base': 'Email does not match the required pattern.',
    'any.required': 'Email is required' 
});

const avatar_url = Joi.string().max(100).min(3).messages({
    'string.base': 'avatar_url must be a string.',
    'string.min': 'avatar_url must be at least 3 characters long.',
    'string.max': 'avatar_url must be no longer than 100 characters.'
});

const phone_number = Joi.string().required().messages({
    'string.base': 'Phone must be a string.',
    'string.empty': 'Phone can not be a empty.',
    'any.required': 'Phone is required' 
});

const password = Joi.string().max(50).min(3).required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password can not be a empty.',
    'string.min': 'Password must be at least 3 characters long.',
    'string.max': 'Password must be no longer than 50 characters.',
    'any.required': 'Password is required' 
});

const verify_email = Joi.boolean().messages({
    'string.base': 'verify_email must be a boolean.',
})
export const userValidator = Joi.object({ lastname, firstname, email, password, phone_number, avatar_url, verify_email });
export const loginValidator = Joi.object({ email, password });