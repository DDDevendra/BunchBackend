import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";
import Connect from "./connection.js";
import router from "./Router/routes.js";


const app = express();
const PORT = process.env.PORT || 9005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", () => {
  console.log("server is connected");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});



const upload = multer({ storage });

const projectRoot = path.resolve();
app.use("/uploads", express.static(path.join(projectRoot, "uploads")));

Connect()
  .then(() => {
    app.listen(PORT, async() => {
      console.log("server is connected at " + PORT);
    });
  })
  .catch((e) => {
    console.log("Failed to connect to the server " + e);
  });

app.use("/api", router);
