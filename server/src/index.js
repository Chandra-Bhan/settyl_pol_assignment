console.log("hello");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB || "mongodb://127.0.0.1:27017/polldb", {
    dbName: "polldb",
  })
  .then((res) => console.log("mongo connected " + res))
  .catch((err) => console.log("Error: " + err));

const pollSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  pollid: { type: String, unique: true, required: true },
  options: [
    {
      id: { type: String, unique: true },
      options: { type: String },
      count: { type: Number, default: 0 },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const savePoll = mongoose.model("savepoll", pollSchema);

app.post("/api/poll", (req, res) => {
  const question = req.body.question.question;
  const options = req.body.options;
  console.log(question, options);
  let data = new savePoll({
    question: question,
    pollid: req.body.question.id,
    options: options,
  });
  data
    .save()
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
});

app.get("/api/poll", async (req, res) => {
  try {
    const polls = await savePoll.find();
    console.log(polls);
    res.send(polls);
  } catch (err) {
    res.send({ error: err.message });
  }
});

app.get("/api/poll/:id", (req, res) => {
  const id = req.params.id;
  savePoll
    .findOne({ pollid: id })
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
});

app.put("/api/poll", (req, res) => {
  savePoll
    .findOneAndUpdate(
      { pollid: req.body.pollid },
      { question: req.body.question.question, options: req.body.options }
    )
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
});

app.post("/submitresponse", (req, res) => {
  console.log("api run", req.body.id, req.body.count, req.body.pollid);
  savePoll
    .updateOne(
      { pollid: req.body.pollid, "options.id": req.body.id },
      { $set: { "options.$.count": req.body.count } }
    )
    .then(() => console.log("Count updated"))
    .catch((err) => console.log(err));
});

app.post("/deletepoll", (req, res) => {
  savePoll
    .findOneAndRemove({ pollid: req.body.id })
    .then(() => console.log("Poll deleted"))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
