const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    places: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "place",
      },
    ],
  },
  {
    writeConcern: {
      j: true,
      wtimeout: 1000,
    },
  }
);
module.exports = mongoose.model("user", userSchema);
