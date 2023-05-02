const mongoose = require("mongoose");
const placeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user",
  },
  
},
{
  writeConcern: {
    j: true,
    wtimeout: 1000
  }
});
module.exports = mongoose.model("place", placeSchema);
