import mongoose from "mongoose";
import user from './user.model.js'

const Message =  new mongoose.Schema({
  
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },
    
    to:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },

    text:{
        type:String,
    },

    time:{ type: Date, default: Date.now }
})

export default mongoose.model('message',Message);