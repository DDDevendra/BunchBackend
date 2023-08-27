import mongoose from "mongoose";
import user from "./user.model.js"

const Bunch = new mongoose.Schema({
    
    bunchName:{
        type:String
    },
    bunchSubheader:{
        type:String
    },
    bunchDescription:{
        type:String
    },
    bunchImage:{
        type:String
    },
    
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:user
    }],

    MyUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user   
    }
    
})

export default mongoose.model('bunch',Bunch);