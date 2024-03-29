const mongoose = require('mongoose')
const Auth = require('./authModel')

const newSchema = new mongoose.Schema({
  friend_email: {
    type: String,
  },

  comments: [
    {
      user_email: String,
      user_name: String,
      comment: String,
    },
  ],
})

module.exports = mongoose.model('NewComments', newSchema)
