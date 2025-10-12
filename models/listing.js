const mongoose = require("mongoose");
const Review=require("./review");
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY9pvV_P9h91LRghihGic-Bfd2J6gmTUeG8Q&s",
    set: (v) =>
  !v || v.trim() === ""
    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY9pvV_P9h91LRghihGic-Bfd2J6gmTUeG8Q&s"
    : v,
  },
  price: {
    type: Number,
    min: [500, "price was less"],
    default: 500,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    }
  ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
       await Review.deleteMany({_id: {$in :listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
