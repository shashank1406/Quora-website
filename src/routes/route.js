const express = require('express')
const userController=require('../controller/userController')
const questionController =require('../controller/questionController')
const answerController= require('../controller/answercontroller')

const router = express.Router()



router.post("/register", userController.createUser);
router.post("/login", userController.userlogin);
router.get("/user/:userId/profile", userController.userGetById);
router.put("/user/:userId/profile", userController.userUpdate);


router.post(" /question", questionController.createQuestion);
router.get("/questions", questionController.getquestions);
router.get("/questions/:questionId", questionController.getQuestionsById);
router.put("/questions/:questionId", questionController.updateQuestionById);
router.delete("/questions/:questionId", questionController.deleteQuestionById);




router.post("/answer", answerController.createAnswer);
router.get("questions/:questionId/answer", answerController.getAllAnswer);
router.put("/answer/:answerId", answerController.updateAnswer);
router.delete("/answers/:answerId", answerController.deleteAnswer);





module.exports = router;

