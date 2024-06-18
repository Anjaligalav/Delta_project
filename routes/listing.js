const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js")
const Listing = require('../models/listing.js')
const {isLoggedIn,validateListing,isOwner} = require('../middelwhere.js')
const listingController = require('../controllers/listing.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })


router
    .route('/')
    //INDEX ROUTE
    .get(wrapAsync(listingController.index))
    //CREATE ROUTE
    .post(isLoggedIn,
        
        upload.single('listing[imageUrl]'),
        validateListing,
        wrapAsync(listingController.createListing)
    )
    
   

//new route
router.get('/createNew',isLoggedIn,listingController.renderNewForm)

router
    .route('/:id')
    //Show ROUTE 
    .get(isLoggedIn,wrapAsync(listingController.showListings))
    //UPDATE ROUTE
    .put(isLoggedIn,isOwner,upload.single('listing[imageUrl]'),validateListing, wrapAsync(listingController.updateListing))
    //DEETE ROUTE
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

//EDIT ROUTE.
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports = router;

// router.post('/listings',wrapAsync((req,res,next)=>{
//         let {title,description,price,image,location,country} = req.body;
//         if (isNaN(price)) {
//             throw new Error("Price must be a number.");
//         }
//         let newlisting = new Listing({
//             title:title,
//             description:description,
//             image:{
//                 filename: 'listingimage',
//                 url:image,
//             },
//             price:price,
//             location:location,
//             country:country,
//         })
//         newlisting.save()
//         res.redirect('/listings')
    
//     })
// )
