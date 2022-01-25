const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const answerSchema = new mongoose.Schema({

    answeredBy: {type:ObjectId,ref:userCollection, required:true},
    text: {type:String,required:true},
    questionId: {type:ObjectId,ref:QuestionCollection,required:true},
    isDeleted : {type:Boolean,default:false}
   
}, { timestamps: true });

module.exports = mongoose.model('AnswerCollection', answerSchema)