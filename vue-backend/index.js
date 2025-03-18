const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
require("dotenv").config();

const computerRoutes = require("./routes/computerRoutes");
const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const userRolesRoutes = require("./routes/userRolesRoutes");
const rolesRoutes = require("./routes/rolesRoutes");

const app = express();
app.use(cors());
// app.use(cors({origin: "*"}));
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-adminsdk.json")), 
});

app.get("/", (req, res) => {
  res.json({ message: "Mašīnmācīšanās un datorredzes laboratorijas datoru attālinātas piekļuves pārvaldības sistēma (MUDLDAPPS)" });
});

app.use("/api", computerRoutes);
app.use("/", authRoutes);
app.use("/api", reservationRoutes);
app.use("/api", requestRoutes);
app.use("/api", userRoutes);
app.use("/api", userRolesRoutes);
app.use("/api", rolesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
// app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});