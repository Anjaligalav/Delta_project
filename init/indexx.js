const mongoose  = require("mongoose");
const initData = require('./data.js');
const Listing = require('../models/listing.js')


main()
.then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log('you are encounting an error related to DB',err);
})

async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '664a1fdcf7f453b448742dc0' }));
    await Listing.insertMany(initData.data)
    console.log('data was initialized')
};

initDB();