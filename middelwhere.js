const Listing = require("./models/listing.js")
const Review = require('./models/review.js')
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");



module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error',"you must be logged in!");
        return res.redirect('/login');
    }
    next();
} 

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=> {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        throw new ExpressError(400, errorMessage);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        throw new ExpressError(400, errorMessage);
    }
    next();
};

module.exports.isReviewAutor = async(req,res,next)=> {
    let { id,r_id } = req.params;
    let review = await Review.findById(r_id);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash('error',"You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}