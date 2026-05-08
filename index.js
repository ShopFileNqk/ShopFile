require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

const fs = require("fs");

// ================= EXPRESS (WEBHOOK) =================

const express = require("express");
const app = express();
app.use(express.json());

// ================= CLIENT =================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ================= PRODUCTS (GIỮ NGUYÊN) =================

const PRODUCTS = {
  filza_1ob: {
    name: "Filza iOS",
    type: "1 OB",
    price: 50000,
    stock: "filza_1ob",
    role: "1502261658351833210",
    channel: "1502262765568528527",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281768139624558/Z.jpg"
  },

  filza_vv: {
    name: "Filza iOS",
    type: "VV",
    price: 150000,
    stock: "filza_vv",
    role: "1502261775922368552",
    channel: "1502262825308131471",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281768139624558/Z.jpg"
  },

  imazing_1ob: {
    name: "iMazing",
    type: "1 OB",
    price: 70000,
    stock: "imazing_1ob",
    role: "1502285054314024990",
    channel: "1502280881082208447",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281720710303815/images.jpg"
  },

  imazing_vv: {
    name: "iMazing",
    type: "VV",
    price: 150000,
    stock: "imazing_vv",
    role: "1502285135964537024",
    channel: "1502280903739572415",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281720710303815/images.jpg"
  },

  adr_1ob: {
    name: "File ADR",
    type: "1 OB",
    price: 100000,
    stock: "adr_1ob",
    role: "1502285208097915001",
    channel: "1502267573465513994",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281691493040268/img.png"
  },

  adr_vv: {
    name: "File ADR",
    type: "VV",
    price: 250000,
    stock: "adr_vv",
    role: "1502285273990697070",
    channel: "1502267673428496424",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281691493040268/img.png"
  }
};

// ================= SAFE JSON =================

function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync("./users.json", "utf8"));
  } catch {
    return {};
  }
}

function saveUsers(data) {
  fs.writeFileSync("./users.json", JSON.stringify(data, null, 2));
}

function loadStock() {
  try {
    return JSON.parse(fs.readFileSync("./stock.json", "utf8"));
  } catch {
    return {
      filza_1ob: 100,
      filza_vv: 100,
      imazing_1ob: 100,
      imazing_vv: 100,
      adr_1ob: 100,
      adr_vv: 100
    };
  }
}

function saveStock(data) {
  fs.writeFileSync("./stock.json", JSON.stringify(data, null, 2));
}

// ================= ADD MONEY (BẠN YÊU CẦU) =================

function addMoney(userId, amount) {
  const users = loadUsers();

  if (!users[userId]) {
    users[userId] = { balance: 0 };
  }

  users[userId].balance += Number(amount);

  saveUsers(users);
}

// ================= SHOP EMBED (GIỮ NGUYÊN LOGIC CŨ) =================

async function updateShopEmbed() {

  try {

    const channel = await client.channels.fetch(process.env.SHOP_CHANNEL_ID);
    const stock = loadStock();

    const embed = new EmbedBuilder()
      .setColor("#00b0f4")
      .setTitle("🛒 NQK SHOP PREMIUM")
      .setDescription(`

╭───────────────╮
> ⚡ Premium iOS Store
> 🔥 Auto Delivery 24/7
> 💎 Secure System
╰───────────────╯

# 📦 DANH SÁCH SẢN PHẨM

## 📱 Filza iOS
> 💰 50.000đ • 1 OB
> 💎 150.000đ • VV
> 📦 Còn: \`${stock.filza_1ob + stock.filza_vv}\`
> 🛒 Đã bán: \`${200 - (stock.filza_1ob + stock.filza_vv)}\`

━━━━━━━━━━━━━━━━━━

## 📱 iMazing
> 💰 70.000đ • 1 OB
> 💎 150.000đ • VV
> 📦 Còn: \`${stock.imazing_1ob + stock.imazing_vv}\`
> 🛒 Đã bán: \`${200 - (stock.imazing_1ob + stock.imazing_vv)}\`

━━━━━━━━━━━━━━━━━━

## 🤖 File ADR
> 💰 100.000đ • 1 OB
> 💎 250.000đ • VV
> 📦 Còn: \`${stock.adr_1ob + stock.adr_vv}\`
> 🛒 Đã bán: \`${200 - (stock.adr_1ob + stock.adr_vv)}\`

━━━━━━━━━━━━━━━━━━

🟢 Hệ thống hoạt động ổn định
⚡ Mua hàng tự động
🔒 Bảo mật tuyệt đối

`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("buy").setLabel("🛒 Buy").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("deposit").setLabel("💳 Nạp Tiền").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("balance").setLabel("💰 Số Dư").setStyle(ButtonStyle.Secondary)
    );

    const messages = await channel.messages.fetch({ limit: 10 });
    const old = messages.find(m => m.author.id === client.user.id);

    if (old) {
      await old.edit({ embeds: [embed], components: [row] });
    } else {
      await channel.send({ embeds: [embed], components: [row] });
    }

  } catch (err) {
    console.log("SHOP ERROR:", err);
  }
}

// ================= READY =================

client.once(Events.ClientReady, () => {
  console.log("BOT ONLINE");

  updateShopEmbed();

  // giữ process không chết
  setInterval(() => {
    console.log("ALIVE");
  }, 30000);
});

// ================= INTERACTION (GIỮ FULL LOGIC) =================

client.on(Events.InteractionCreate, async interaction => {

  try {

    // ================= BUTTON =================

    if (interaction.isButton()) {

      if (interaction.customId === "balance") {

        const users = loadUsers();
        if (!users[interaction.user.id]) users[interaction.user.id] = { balance: 0 };

        return interaction.reply({
          content: `💰 ${users[interaction.user.id].balance.toLocaleString()}đ`,
          ephemeral: true
        });
      }

      if (interaction.customId === "deposit") {

        const modal = new ModalBuilder()
          .setCustomId("deposit_modal")
          .setTitle("Nạp tiền");

        const amount = new TextInputBuilder()
          .setCustomId("amount")
          .setLabel("Số tiền")
          .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(amount));

        return interaction.showModal(modal);
      }

      if (interaction.customId === "buy") {

        const menu = new StringSelectMenuBuilder()
          .setCustomId("select_product")
          .setPlaceholder("Chọn sản phẩm")
          .addOptions([
            { label: "Filza", value: "filza" },
            { label: "iMazing", value: "imazing" },
            { label: "ADR", value: "adr" }
          ]);

        return interaction.reply({
          components: [new ActionRowBuilder().addComponents(menu)],
          ephemeral: true
        });
      }
    }

    // ================= MODAL =================

    if (interaction.isModalSubmit()) {

      if (interaction.customId === "deposit_modal") {

        const amount = interaction.fields.getTextInputValue("amount");

        const qr = `https://img.vietqr.io/image/VIETINBANK-105884390640-compact2.png?amount=${amount}&addInfo=${interaction.user.id}`;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("QR NẠP TIỀN")
              .setImage(qr)
          ],
          ephemeral: true
        });
      }
    }

  } catch (err) {
    console.log("INTERACTION ERROR:", err);
  }

});

// ================= WEBHOOK =================

app.post("/vietinbank", (req, res) => {

  try {

    const { userId, amount } = req.body;

    if (!userId || !amount) return res.send("missing");

    addMoney(userId, amount);

    client.users.fetch(userId)
      .then(u => u.send(`+${amount}đ đã cộng`))
      .catch(() => {});

    res.send("ok");

  } catch (err) {
    console.log(err);
    res.send("error");
  }

});

// ================= EXPRESS START =================

app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("WEBHOOK RUNNING");
});

// ================= CRASH PROTECT =================

process.on("uncaughtException", console.log);
process.on("unhandledRejection", console.log);

// ================= LOGIN =================

client.login(process.env.TOKEN)
  .then(() => console.log("LOGIN OK"))
  .catch(err => console.log("LOGIN FAIL:", err));
