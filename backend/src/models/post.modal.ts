import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String
  },
  imgURL: {
    type: String
  },
  likes: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      text: {
        type: String,
        required: true,
      },
      userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ]
}, { timestamps: true });


const postModel = mongoose.model('Post', postSchema);

export default postModel;