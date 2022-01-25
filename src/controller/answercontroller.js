const answerModel = require('../model/answerModel')

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

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// -------------------- ten api api to create answer --------------------------------------------------------------------------- ---------------


const createAnswer = async function (req, res) {
    try {
        const requestBody = req.body
        const { answeredBy, text, questionId } = requestBody

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide user details" })
            return
        }

        if (!isValid(answeredBy)) {
            return res.status(400).send({ status: false, message: 'answerd by is required in the request body' })
        }
        if (!isValidObjectId(answeredBy)) {
            return res.status(400).send({ status: false, message: `${answeredBy} is not a valid object id` })
        }

        if (!isValid(text)) {
            return res.status(400).send({ status: false, message: 'text is required in the request body' })
        }
        if (!isValid(questionId)) {
            return res.status(400).send({ status: false, message: 'questionId is required in the request body' })
        }
        if (!isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: `${questionId} is not a valid object id` })
        }

        const questioncheck = await questionModel.findOne({ _id: questionId, isDelted: false })

        if (!questioncheck) {
            return res.status(400).send({ status: false, message: 'question dosnt exist or lready deleted' })
        }

        // authroization

        if (questioncheck.askedBy == answeredBy) {
            return res.status(400).send({ status: false, message: 'user cant answered our own question' })
        }

        const createAnswer = await answerModel.create(requestBody)
        res.status(201).send({ status: true, msg: 'sucesfully created', data: createAnswer })


    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}


// -------------------- eleven api api to get anwer linke with the question --------------------------------------------------------------------------- ---------------



const getAllAnswer = async function (req, res) {
    try {

        const questionId = req.params.questionId

        const answerDetail = await answerModel.find({ questionId: questionId, isDeleted: false })
        if (!answerDetail) {
            return res.status(404).send({ status: false, message: 'no ans exist with this question id or invalid question id' })
        }

        res.status(200).send({ status: true, message: 'success', data: answerDetail })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}


// -------------------- tweleve api to update answer --------------------------------------------------------------------------- ---------------



const updateAnswer = async function (req, res) {
    try {
        const requestBody = req.body
        const answerId = req.params.answerId
        const answerCheck = await answerModel.findOne({ _id: answerId, isDeleted: false })

        if (!answerCheck) {
            return res.status(400).send({ status: false, message: 'answer doesnot exist or already deleted' });
        }

        // authorization 
        if (!(answerCheck.answeredBy === req.decodeToken.userId)) {
            return res.status(400).send({ status: false, msg: "unauthorized access" })
        }

        const { text } = requestBody
        const update = {}

        if (text) {
            if (!isValid(text)) {
                return res.status(400).send({ status: false, message: 'please provide valid answer' })
            }
            update.text = text
        }

        const updateAnswer = await answerModel.findOneAndUpdate({ _id: answerId, isDeleted: false }, update, { new: true })

        res.status(200).send({ status: true, message: `updated sucessfully `, data: updateAnswer });


    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}

// -------------------- thirteen api to delete a answer --------------------------------------------------------------------------- ---------------



const deleteAnswer = async function (req, res) {
    try {

        const answerId = req.params.answerId
        const answerCheck = await answerModel.findOne({ _id: answerId, isDeleted: false })

        if (!answerCheck) {
            return res.status(400).send({ status: false, message: 'answer doesnot exist or already deleted' });
        }

        // authorization 
        if (!(answerCheck.answeredBy === req.decodeToken.userId)) {
            return res.status(400).send({ status: false, msg: "unauthorized access" })
        }


        const deleteAnswer = await questionModel.findOneAndUpdate({ _id: answerId, isDeleted: false }, { isDeleted: true }, { new: true })

        res.status(200).send({ status: true, message: `deleted sucessfully `, data: deleteAnswer });


    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}


// -------------------- featur three completed --------------------------------------------------------------------------- ---------------

module.exports.createAnswer = createAnswer
module.exports.getAllAnswer = getAllAnswer
module.exports.updateAnswer = updateAnswer
module.exports.deleteAnswer = deleteAnswer


// -------------------- five api api to create quetion --------------------------------------------------------------------------- ---------------
