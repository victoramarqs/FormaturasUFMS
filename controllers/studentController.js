const Student = require('../models/studentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.subscribeStudent = catchAsync(async (req, res, next) => {
  const newStudent = await Student.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      patient: newStudent,
    },
  });
});

exports.studentStats = catchAsync(async (req, res, next) => {
  const stats = await Student.aggregate([
    {
      $match: { confirmationAllEvents: true },
    },
    {
      $group: {
        _id: '$yearGraduation',
        numStudents: { $sum: 1 },
        avgPriceSuggested: { $avg: '$cost' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.notConfirmedStudents = catchAsync(async (req, res, next) => {
  const students = await Student.find({ confirmationAllEvents: false }).select([
    '-rga',
    '-email',
    '-__v',
  ]);

  res.status(200).json({
    status: 'success',
    results: students.length,
    data: {
      students,
    },
  });
});

exports.studentsAcess = catchAsync(async (req, res, next) => {
  let year;
  if (req.params.user === 'matheus') {
    year = 2023;
  } else if (req.params.user === 'victoramarqs') {
    year = 2024;
  }

  if (year === undefined) return next(new AppError('Acess Denied', 403));

  const students = await Student.find({
    confirmationAllEvents: true,
    yearGraduation: year,
  }).select('-__v');

  res.status(200).json({
    status: 'success',
    results: students.length,
    data: {
      students,
    },
  });
});
