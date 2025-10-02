const mongoose=require("mongoose");
const initData=require("./data");
const Listing=require("../models/listing");

//database connection
const MONGO_URL="mongodb://127.0.0.1:27017/property";
main()
.then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    await mongoose.connection.close();
}

initDB();