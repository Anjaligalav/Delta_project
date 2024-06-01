const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0), // Ensuring price is a number
        imageFilename: Joi.string().optional().allow("", null), // Allow empty or null values
        imageUrl: Joi.string().optional().allow("", null), // Allow empty or null values
        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null) // Assuming image URL is required
        }).optional() // Make the image object optional
    }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required()
})
