const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js")
const Listing = require('../models/listing.js');
const Review = require('../models/review.js')
const {validateReview, isLoggedIn,isReviewAutor} = require('../middelwhere')
const reviwController = require('../controllers/review.js');



//Review 
//Post Route
router.post('/',isLoggedIn,validateReview,wrapAsync(reviwController.addReview))

//Delete Review Route
router.delete('/:r_id',isLoggedIn,isReviewAutor,wrapAsync(reviwController.deleteReview))

module.exports = router;
