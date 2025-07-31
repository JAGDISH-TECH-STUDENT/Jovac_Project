const express = require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing, isLoggedInForDelete,isLoggedInForEdit}=require("../middleware.js");



//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

// create New route..// create crud opera..
router.get("/new",isLoggedIn,(req,res,next)=>{
    res.render("listings/new.ejs");
});

//show Route//read crud opera.


router.get("/:id",wrapAsync(async (req,res)=>{
    let  { id } = req.params;
    const listing= await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    })
        .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
    
}));

//create route

router.post("/",isLoggedIn,validateListing,wrapAsync(async (req, res, next)=>{
    const newListing=new Listing(req.body.listing);
    
    if (newListing.image?.url?.trim() === "") {
        newListing.image.url = undefined;
    }

    if (newListing.image?.filename?.trim() === "") {
        newListing.image.filename = undefined;
    }
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing id created!");
    res.redirect("/listings"); 
    
}));  


// Edit Route
router.get("/:id/edit",isLoggedInForEdit,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=  await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ listing });
}));

// update route

router.put("/:id",isOwner,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
}));


// delete router

router.delete("/:id",isLoggedInForDelete,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id); 
    req.flash("success","Listing DELETED!");
    res.redirect("/listings");
}));

module.exports = router;