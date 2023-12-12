/******************************************************************************
 *   ITE5315 – Project
 *   I declare that this assignment is my own work in accordance with Humber Academic Policy.
 *   No part of this assignment has been copied manually or electronically from any other source
 *   (including web sites) or distributed to other students.
 *
 *   Group member Name: Spencer Standish     Student IDs: N01576620      Date: 05/12/2023
 *   Group member Name: Ishita Arora     Student IDs: N01543414      Date: 05/12/2023
 ******************************************************************************/

const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    address: {
      building: String,
      coord: [Number],
      street: String,
      zipcode: String,
    },
    borough: String,
    cuisine: String,
    grades: [
      {
        date: {
          $date: {
            $numberLong: String,
          },
        },
        grade: String,
        score: {
          $numberInt: String,
        },
      },
    ],
    name: String,
    restaurant_id: String,
  },
  { versionKey: false }
);

const Restaurant = mongoose.model(
  "Restaurant",
  restaurantSchema,
  "restaurants"
);

module.exports = Restaurant;
