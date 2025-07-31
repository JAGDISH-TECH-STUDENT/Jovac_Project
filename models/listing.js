const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listingSchema= new Schema({
    title:{
        type:String,
        required: true,
    },
    description:String,
    image: {
        filename: { type: String, default: "no-image" },
        url: {
            type: String,
            default: "https://thumbs.dreamstime.com/z/no-photo-available-missing-image-no-image-symbol-isolated-white-background-no-photo-available-missing-image-no-image-272386839.jpg"
        },
    },
    price:{
        type:Number,
        min:1,
        
    },
    location:String,
    country:String,
    reviews:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review",
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews } });
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

 