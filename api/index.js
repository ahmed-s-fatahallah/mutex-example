import cors from "cors";
import express from "express";

const corsOptions = {
  origin: "*", // Replace with your client's origin
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

let counter = 0;

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.get("/", async (_, res) => {
  setTimeout(() => {
    res.status(200).json({ counter });
  }, 1000);
});

app.post("/", async (req, res) => {
  counter = req.body.counter;
  setTimeout(() => {
    res.status(200).json({ counter });
  }, 1000);
});

app.listen(3000, () => {
  console.log("server is running on port: 3000");
});
