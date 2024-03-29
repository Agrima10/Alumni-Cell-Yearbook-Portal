const mongoose = require('mongoose')
const Auth = require('./authModel')

const approvedSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ApprovedCommetns', approvedSchema)
