require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const {
  Client
} = require("discord.js");

const app = express();

app.use(bodyParser.json());

function loadUsers() {
  return JSON.parse(fs.readFileSync("./users.json"));
}

function saveUsers(data) {
  fs.writeFileSync("./users.json", JSON.stringify(data, null, 2));
}

// ================= WEBHOOK =================

app.post("/webhook", async (req, res) => {

  try {

    const data = req.body;

    const amount = Number(data.transferAmount);

    const userId = data.content.trim();

    const users = loadUsers();

    if (!users[userId]) {

      users[userId] = {
        balance: 0
      };

    }

    users[userId].balance += amount;

    saveUsers(users);

    console.log(`+${amount} cho ${userId}`);

    res.sendStatus(200);

  } catch (e) {

    console.log(e);

    res.sendStatus(500);

  }

});

app.listen(process.env.PORT || 3000, () => {
  console.log("Webhook running");
});
