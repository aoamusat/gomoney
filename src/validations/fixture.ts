import Joi from "joi";

export const fixtureSchema = Joi.object({
  homeTeam: Joi.string().required(),
  awayTeam: Joi.string().required(),
  date: Joi.date().required(),
  score: Joi.string().required(),
  status: Joi.string()
    .required()
    .valid(...["pending", "completed"]),
}).unknown();
