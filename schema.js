const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(500),
    country: Joi.string()
  .pattern(/^[A-Za-z\s]+$/)
  .required()
  .messages({
    'string.pattern.base': 'Country must contain only letters'
  }),

location: Joi.string()
  .pattern(/^[A-Za-z\s]+$/)
  .required()
  .messages({
    'string.pattern.base': 'Location must contain only letters'
  }),

  }).required()
}).strict()// 👈 Apply strict mode here


module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})