const Listing = require('../models/listing.js');
const Review = require('../models/review.js')

module.exports.addReview = async(req,res,next)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash('success',"New Review added.")
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview = async(req,res)=>{
    let {id,r_id} = req.params;

    await Listing.findByIdAndUpdate( id, {$pull: { reviews: r_id } } )//pull mean extract and delete.
    await Review.findByIdAndDelete(r_id)
    console.log("review delete")
    req.flash('success',"Review is Deleted.")
    res.redirect(`/listings/${id}`)
}