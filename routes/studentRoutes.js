const express = require('express');

const studentController = require('../controllers/studentController');

const router = express.Router();

router
  .route('/')
  .get(studentController.studentStats)
  .post(studentController.subscribeStudent);

router.route('/comission/:year').get(studentController.notConfirmedStudents);
router.route('/:user').get(studentController.studentsAcess);

module.exports = router;
