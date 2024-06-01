const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res)=>{
    const allListing = await Listing.find();
    res.render('listings/Home_page',{allListing});

}

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/newListing.ejs');
}

module.exports.showListings = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({path:'reviews',populate:{
        path:'author'
    }})
    .populate('owner');
    if(!listing){
        req.flash('error',"Listing you requested for does not exist!");
        res.redirect('/listings');
    }
    res.render('listings/show.ejs',{listing});
}

module.exports.createListing = async(req,res,next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    // console.log(response.body.features[0].geometry.coordinates);

    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image= {url,filename};
    newlisting.geometry= response.body.features[0].geometry
    let savedlisting = await newlisting.save();
    console.log(savedlisting);
    req.flash('success',"New Listing Created.")
    res.redirect('/listings');
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash('error',"Listing you requested for does not exist!");
        res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload','/upload/h_200,w_300');
    res.render('listings/edit.ejs',{listing,originalImageUrl});
}

module.exports.updateListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save()
    }
    listing.geometry= response.body.features[0].geometry
    await listing.save();
    
    req.flash('success',"Listing is Updated.")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id).then(()=>{
        console.log("Listing is deleted");
    })
    req.flash('success',"Listing is Deleted.")
    res.redirect('/listings')
}

