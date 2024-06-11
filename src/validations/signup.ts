import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
}).unknown();
