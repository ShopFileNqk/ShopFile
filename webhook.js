const express = require("express");

const app = express();
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Webhook Running");
});

// nhận bank callback
app.post("/vietinbank", (req, res) => {
  console.log("WEBHOOK DATA:", req.body);

  res.send("OK");
});

// PORT Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Webhook Online:", PORT);
});

// chống crash silent
process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);
