const mongoose = require('mongoose');
const validator = require('validator');

const studentSchema = new mongoose.Schema(
  {
    confirmationAllEvents: {
      type: Boolean,
      required: true,
    },
    yearGraduation: {
      type: Number,
      required: true,
      enum: [2023, 2024],
    },
    rga: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (el) {
          const year = el.substr(0, 4);
          const acceptedYears = ['2018', '2019', '2020', '2021', '2022'];
          const course = el.substr(5, 4);
          const acceptedCourses = ['1902', '1904', '1905', '1906', '1907'];

          return (
            el.length === 15 &&
            acceptedYears.includes(year) &&
            acceptedCourses.includes(course)
          );
        },
        message:
          "This RGA is not from FACOM or it is invalid! Please contact graduation's committee",
      },
    },
    name: {
      type: String,
      validate: {
        validator: function (el) {
          return el.includes(' ');
        },
        message: 'You must enter a correct and complete name',
      },
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (el) {
          return validator.isMobilePhone(el, 'pt-BR');
        },
        message: 'The phone number provided is invalid!',
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isEmail, 'The email provided is invalid!'],
    },
    cost: {
      type: Number,
    },
    course: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// studentSchema.virtual('course').get(function () {
//   const code = this.rga.substr(5, 4);
//   if (code === '1902')
//     return 'Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas';
//   if (code === '1904') return 'Ciência da Computação';
//   if (code === '1905') return 'Engenharia de Computação';
//   if (code === '1906') return 'Engenharia de Software';
//   if (code === '1907') return 'Sistemas de Informação';
// });

studentSchema.pre('save', function (next) {
  const code = this.rga.substr(5, 4);
  if (code === '1902')
    this.course =
      'Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas';
  else if (code === '1904') this.course = 'Ciência da Computação';
  else if (code === '1905') this.course = 'Engenharia de Computação';
  else if (code === '1906') this.course = 'Engenharia de Software';
  else if (code === '1907') this.course = 'Sistemas de Informação';
  next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
