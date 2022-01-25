const questionModel = require('../model/questionModel')
const QuestionModel = require('../model/questionModel')
const answerModel= require('../model/answerModel')



// function for validation 

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (value === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


// -------------------- five api api to create quetion --------------------------------------------------------------------------- ---------------


const createQuestion = async function (req, res) {
    try {

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}



// -------------------- six api to get question ------------------------------------------------------------------------------------------------


const getquestions = async function (req, res) {
    try {

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}



// -------------------- seven api to get question by id ---------------------------------------------------------------------------


const getQuestionsById = async function (req, res) {
    try {
        const questionId = req.params.questionId
        const questiondetail = await QuestionModel.findOne({ _id: questionId, isDeleted: false })
        if (!questiondetail) {
            return res.status(404).send({ status: false, message: 'question does not exist' })
        }

        const answers= await answerModel.find({questionId:questionId})
        let result = {question:{...questiondetail.toObject()},answer:answers}
        res.status(200).send({ status: true, message: 'success', data:result })


    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}



// -------------------- eight api to update question by id ---------------------------------------------------------------------------


const updateQuestionById = async function (req, res) {
    try {
        const questionId = req.params.questionId
        const requestBody = req.body

        const questionCheck= await questionModel.findOne({_id:questionId,isDeleted:false})

        if(!questionCheck){
            return res.status(400).send({ status: false, message: 'question doesnot exist or already deleted' });
        }

        // authorization 

        if (!(questionCheck.askedBy === req.decodeToken.userId)) {
            return res.status(400).send({ status: false, msg: "unauthorized access" })
        }

        const { description, tag } = requestBody
        const update = {}

        if (description) {
            if (!isValid(description)) {
                return res.status(400).send({ status: false, message: 'please provide text' })
            }
            update.description = description
        }
        if (tag) {
            if (!isValid(tag) && tag.length === 0) {
                return res.status(400).send({ status: false, message: 'please provide valid tag' })
            }
            update.$addToSet = { tag: tag }
        }

        
        const updateUser = await questionModel.findOneAndUpdate({ _id: questionId,isDeleted:false }, update, { new: true })

        res.status(200).send({ status: true, message: `updated sucessfully `, data: updateUser });

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}



// -------------------- nine api to delete question by id ---------------------------------------------------------------------------


const deleteQuestionById = async function (req, res) {
    try {
        const questionId = req.params.questionId
        const questionCheck= await questionModel.findOne({_id:questionId,isDeleted:false})

        if(!questionCheck){
            return res.status(400).send({ status: false, message: 'question doesnot exist or already deleted' });
        }
        
        // authorization 
        if (!(questionCheck.askedBy === req.decodeToken.userId)) {
            return res.status(400).send({ status: false, msg: "unauthorized access" })
        }


        const deletequestion = await questionModel.findOneAndUpdate({ _id: questionId,isDeleted:false },{isDeleted:true}, { new: true })

        res.status(200).send({ status: true, message: `deleted sucessfully `, data: deletequestion });

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}




// -------------------- feature two completed ---------------------------------------------------------------------------


module.exports.createQuestionr = createQuestion
module.exports.getquestions = getquestions
module.exports.getQuestionsById = getQuestionsById
module.exports.updateQuestionById = updateQuestionById
module.exports.deleteQuestionById = deleteQuestionById