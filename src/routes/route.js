const express = require('express')
const userController=require('../controller/userController')
const questionController =require('../controller/questionController')
const answerController= require('../controller/answercontroller')
const mid= require('../middleware/authentication')

const router = express.Router()



router.post("/register", userController.createUser);
router.post("/login", userController.userlogin);
router.get("/user/:userId/profile",mid.auth, userController.userGetById);
router.put("/user/:userId/profile",mid.auth, userController.userUpdate);


router.post(" /question",mid.auth, questionController.createQuestion);
router.get("/questions", questionController.getquestions);
router.get("/questions/:questionId", questionController.getQuestionsById);
router.put("/questions/:questionId",mid.auth, questionController.updateQuestionById);
router.delete("/questions/:questionId",mid.auth, questionController.deleteQuestionById);


router.post("/answer", answerController.createAnswer);
router.get("questions/:questionId/answer", answerController.getAllAnswer);
router.put("/answer/:answerId", answerController.updateAnswer);
router.delete("/answers/:answerId", answerController.deleteAnswer);





module.exports = router;

