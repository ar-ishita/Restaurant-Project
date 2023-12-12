/******************************************************************************
 *   ITE5315 – Project
 *   I declare that this assignment is my own work in accordance with Humber Academic Policy.
 *   No part of this assignment has been copied manually or electronically from any other source
 *   (including web sites) or distributed to other students.
 *
 *   Group member Name: Spencer Standish     Student IDs: N01576620      Date: 05/12/2023
 *   Group member Name: Ishita Arora     Student IDs: N01543414      Date: 05/12/2023
 ******************************************************************************/
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const database = require("./config/database");
const restaurantRoutes = require("./routes/restaurants");
const loginRoutes = require("./routes/loginRoutes");
const clientSessions = require("client-sessions");

const app = express();
const port = 8000;

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

/*database.initialize(
  "mongodb+srv://spencerstandish:Date425143@cluster0.ljjlxrv.mongodb.net/sample_restaurants"
);
database.initialize(
  "mongodb+srv://root:root@ishita.6b8hnxo.mongodb.net/sample_restaurants"
);*/
database.initializeMongoDB(process.env.MONGODB_URI);

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true, // Disable the warning for accessing non-own properties
      allowProtoMethodsByDefault: true, // Disable the warning for accessing non-own methods
    },
  })
);

// Set the views folder
app.set("views", path.join(__dirname, "views"));

app.set("view engine", ".hbs");

// Other configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/style", express.static("public/style"));

//setup session
app.use(
  clientSessions({
    cookieName: "session",
    secret: "webproject",
    duration: 1000, // 2 minutes
    activeDuration: 1000 * 60, // 1 minute
  })
);

//app.use("/api/restaurants", restaurantRoutes);
app.use(restaurantRoutes);
app.use("/", loginRoutes);

// Function to calculate average score with 2 decimal places
function calculateAverageScore(grades) {
  if (grades.length === 0) return 0;

  const totalScore = grades.reduce((acc, grade) => {
    const score = Number(grade.score);
    console.log(`Score: ${score}`);
    return acc + score;
  }, 0);

  const averageScore = (totalScore / grades.length).toFixed(2); // Fix to 2 decimal places
  console.log(`Total Score: ${totalScore}`);
  console.log(`Average Score: ${averageScore}`);
  return averageScore;
}

// UI/Form route
app.get("/ui/restaurants", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 5;
    const borough = req.query.borough || null;

    const restaurants = await database.getAllRestaurants(
      page,
      perPage,
      borough
    );

    // Calculate average score and include cuisine for each restaurant
    const restaurantsWithAvgScoreAndCuisine = await Promise.all(
      restaurants.map(async (restaurant) => {
        const averageScore = calculateAverageScore(restaurant.grades);
        const cuisine = restaurant.cuisine; // Assuming the cuisine is directly available in the restaurant object
        return { ...restaurant.toObject(), averageScore, cuisine };
      })
    );

    // Sort by highest average score
    restaurantsWithAvgScoreAndCuisine.sort(
      (a, b) => b.averageScore - a.averageScore
    );

    // Render the UI/form using Handlebars
    res.render("restaurants", {
      page,
      perPage,
      borough,
      restaurants: restaurantsWithAvgScoreAndCuisine,
    });
  } catch (error) {
    console.error("Error rendering UI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
