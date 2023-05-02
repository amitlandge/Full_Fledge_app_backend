const fs = require("fs");
const Place = require("../model/placeSchema");
const User = require("../model/userSchema");
const mongoose = require("mongoose");
const getPlacesById = async (req, res) => {
  try {
    const placeId = req.params.placeId;
    const getPlace = await Place.findById(placeId);
    if (getPlace.length === 0) {
      throw {
        message: "No result Found",
      };
    }
    res.json(getPlace);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getPlaceById = async (req, res) => {
  const placeId = req.params.placeId;
  const place = await Place.findOne({ _id: placeId });

  if (place) {
    res.json(place);
  }
};
const createPlaces = async (req, res) => {
  const { title, description, userId, address } = req.body;
  if (!(title && description && address)) {
    res.json("please enter all valid data");
  }

  const createPlaces = await Place.create({
    title,
    description,
    address,
    imageUrl: req.file.path,
    location: {
      lat: 27.1751448,
      lng: 78.0399535,
    },
    userId,
  });

  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      throw new Error("Could not find user");
    }
  } catch (error) {
    res.send(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createPlaces.save({ session: sess });
    user.places.push(createPlaces);
    await user.save({ session: sess });
    await sess.commitTransaction();
    res.json({ place: createPlaces });
  } catch (error) {
    res.json(error);
  }
  console.log(process.env.SECRETE_KEY)
};
const updatePlace = async (req, res) => {
  const placeId = req.params.placeId;
  const { title, description } = req.body;
  if (!(title && description)) {
    res.json({ message: "please fill valid info" });
  }
  try {
    const updatePlace = await Place.findByIdAndUpdate(
      { _id: placeId },
      { title: title, description: description }
    );
    res.json(updatePlace);
  } catch (error) {
    res.status(400).json(error);
  }
};
const deletePlace = async (req, res) => {
  const placeId = req.params.placeId;
  let place = await Place.findById(placeId).populate("userId");

  await Place.findByIdAndDelete(placeId);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    place.userId.places.pull(place);
    await place.userId.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {}
};
const getPlacesByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const getPlace = await Place.find({ userId: userId });
    if (getPlace.length === 0) {
      throw {
        message: "No Result faound",
      };
    }
    if (getPlace) {
      res.json({ getPlace });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.getPlacesById = getPlacesById;
exports.getPlaceById = getPlaceById;
exports.createPlaces = createPlaces;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.getPlacesByUserId = getPlacesByUserId;
