require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

// ================= BODY =================

app.use(bodyParser.json());

// ================= JSON =================

function loadUsers() {

  if (!fs.existsSync("./users.json")) {

    fs.writeFileSync(
      "./users.json",
      JSON.stringify({}, null, 2)
    );

  }

  return JSON.parse(
    fs.readFileSync("./users.json")
  );

}

function saveUsers(data) {

  fs.writeFileSync(
    "./users.json",
    JSON.stringify(data, null, 2)
  );

}

// ================= HOME =================

app.get("/", (req, res) => {

  res.status(200).send(`
  
<h1>✅ NQK SHOP WEBHOOK ONLINE</h1>

<p>SePay webhook is running...</p>

`);

});

// ================= WEBHOOK =================

app.post("/webhook", async (req, res) => {

  try {

    console.log("Webhook Data:", req.body);

    const data = req.body;

    // ================= CHECK =================

    if (!data) {

      return res.status(400).send("No data");

    }

    // ================= GET DATA =================

    const amount = Number(
      data.transferAmount || 0
    );

    const content = String(
      data.content || ""
    ).trim();

    // ================= VALID =================

    if (!amount || !content) {

      return res.status(400).send("Invalid payment");

    }

    // ================= USER =================

    const userId = content;

    const users = loadUsers();

    if (!users[userId]) {

      users[userId] = {
        balance: 0
      };

    }

    // ================= ADD MONEY =================

    users[userId].balance += amount;

    saveUsers(users);

    console.log(
      `[AUTO BANK] +${amount} => ${userId}`
    );

    // ================= SUCCESS =================

    return res.status(200).json({

      success: true,
      user: userId,
      amount: amount,
      balance: users[userId].balance

    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({

      success: false,
      error: err.message

    });

  }

});

// ================= 404 =================

app.use((req, res) => {

  res.status(404).send("404 Not Found");

});

// ================= START =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`
  
✅ WEBHOOK ONLINE
🌐 PORT: ${PORT}

`);

});
