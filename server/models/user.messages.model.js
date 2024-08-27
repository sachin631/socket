const mongoose = require("mongoose");

const user_message_Schema = new mongoose.Schema({
  sender_id:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  receiver_id:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  message:{
    type:String,
    required:true
  }
});

const message_model=new mongoose.model("UserMessage",user_message_Schema);

module.exports = message_model ;