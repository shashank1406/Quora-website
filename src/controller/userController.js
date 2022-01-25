const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const validator = require('validator')
let saltRound = 12


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

const isValidPassword = function (password) {
    if (password.length > 7 && password.length < 16)
        return true
}


// -------------------- first api to create user ---------------------------------------------------------------------------

const createUser = async function (req, res) {
    try {
        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide user details" })
            return
        }
        const { fname, lname, email, phone, password } = requestBody

        // required validation 

        if (!isValid(fname)) {
            res.status(400).send({ status: false, Message: "Please provide user's first name" })
            return
        }
        if (!isValid(lname)) {
            res.status(400).send({ status: false, Message: "Please provide user's last name name" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, Message: "Please provide user's emails" })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, Message: "Please provide user's pasword" })
            return
        }

        // validation email and password and phone correct formet or not

        if (!(validator.isEmail(email.trim()))) {
            return res.status(400).send({ status: false, msg: 'enter valid email' })
        }
        if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(phone))) {
            res.status(400).send({ status: false, message: `phone no should be a valid phone no` })
            return
        }
        if (!isValidPassword(password)) {
            res.status(400).send({ status: false, Message: "password must be 8 to 15 carecter" })
            return
        }

        // email and phone is unique or not

        let Email = email.split(' ').join('')

        const isEmailAlreadyUsed = await userModel.findOne({ email: email });
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${Email} email address is already registered` })
            return
        }

        const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone });
        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone}  phone is already registered` })
            return
        }

        // create a doc with encrypt pasword
        const encryptedPassword = await bcrypt.hash(password, saltRounds)

        let FEmail = email.split(' ').join('')

        const userData = {
            fname: fname, lname: lname, email: FEmail,
            phone: phone, password: encryptedPassword
        }
        const newUser = await userModel.create(userData);

        res.status(201).send({ status: true, message: `User registered successfully`, data: newUser });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}


// -------------------- second api to login user ---------------------------------------------------------------------------

const userlogin = async function (req, res) {
    try {
        let requestBody=req.boy
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "request body is emptey" })
        }
        const { email, password } = requestBody

        let user = await userModel.findOne({ email: email });

        if (!user) return res.status(400).send({ message: "invalid login credentials" })

        // const { _id, password } = user
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).send({ message: "Invalid login credentials" })
        }

        const generatedToken = jwt.sign({ userId: user._id }, "project6");

        res.header('user-login-key', generatedToken);
        return res.status(200).send({
            Message: "Login successfull !!",
            token: generatedToken,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
    }
}

// -------------------- third api to get user detail ---------------------------------------------------------------------------


const userGetById = async function (req, res) {
    try {
        if (!isValid(req.params.userId) || !isValidObjectId(req.params.userId)) {
               return res.status(400).send({ status: false, message: 'Provided userId is not valid' })
        }
        if ((req.decodeToken.userId).toString()!== req.params.userId) {
           return res.status(400).send({ status: false, message: 'Authentication denide !!' })
        }
        const user = await userModel.findById(req.params.userId)
        if (!user) {
           return res.status(404).send({ status: false, message: 'profile does not exist' })
        }
        return res.status(200).send({ status: true, message: 'user profile details', data: user })
    } catch (error) {
      
        console.log(error)
        return res.status(500).send({ status: false, message: error.message });
   }
}


// -------------------- fourth api to update auser ---------------------------------------------------------------------------


const userUpdate = async function (req, res) {
    try {
        let requestBody = req.body
        let userId = req.parama.userId
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide user details" })
            return
        }

        // authorization 

        if (!(userId === req.decodeToken.userId)) {
            return res.status(400).send({ status: false, msg: "unauthorized access" })
        }
        const { fname, lname, email, phone, password } = requestBody
        const userData = {}

        if (fname) {
            if (!isValid(fname)) {
                res.status(400).send({ status: false, Message: "Please provide user's first name" })
                return
            }
            userData.fname = fname
        }
        if (lname) {
            if (!isValid(lname)) {
                res.status(400).send({ status: false, Message: "Please provide user's lat name" })
                return
            }
            userData.lname = lname
        }

        if (email) {
            if (!isValid(email)) {
                res.status(400).send({ status: false, Message: "Please provide user's email" })
                return
            }
            if (!(validator.isEmail(email))) {
                return res.status(400).send({ status: false, msg: 'enter valid email' })
            }

            let email = email.split(' ').join('')

            const isEmailAlreadyUsed = await userModel.findOne({ email: email });

            if (isEmailAlreadyUsed) {
                res.status(400).send({ status: false, message: `${email} email address is already registered` })
                return
            }
            userData.email = email

        }

        if (phone) {
            if (!isValid(phone)) {
                res.status(400).send({ status: false, Message: "Please provide user's phone" })
                return
            }
            if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(phone))) {
                res.status(400).send({ status: false, message: `phone no should be a valid phone no` })
                return
            }
            const isPhoneAlreadyUsed = await userModel.findOne({ phone: phone });

            if (isPhoneAlreadyUsed) {
                res.status(400).send({ status: false, message: `${phone}  phone is already registered` })
                return
            }
            userData.phone = phone

        }

        if (password) {
            if (!isValid(password)) {
                res.status(400).send({ status: false, Message: "Please provide user's first name" })
                return
            }
            if (!isValidPassword(password)) {
                res.status(400).send({ status: false, Message: "Please provide a vaild password ,Password should be of 8 - 15 characters" })
                return
            }
            const encryptedPassword = await bcrypt.hash(password, saltRounds)

            userData.password = encryptedPassword


        }

        const newUser = await userModel.findOneAndUpdate({ _id: userId }, userData, { new: true })

        res.status(200).send({ status: true, message: `updated sucessfully `, data: newUser });




    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


// -------------------- feature one completed ---------------------------------------------------------------------------


module.exports.createUser = createUser
module.exports.userlogin = userlogin
module.exports.userGetById = userGetById
module.exports.userUpdate = userUpdate