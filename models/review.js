const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    comment:{
        type:String
    },
    rating:{
        type:Number,
        min:[1,"not less than 1"],
        max:[5,"not more than 5"],
        default:1
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;