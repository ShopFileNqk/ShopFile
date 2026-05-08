require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  Events
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ================= PRODUCTS =================

const PRODUCTS = {

  filza_1ob: {
    name: "Filza iOS",
    type: "1 OB",
    price: 50000,
    stock: "filza_1ob",
    role: "1502261658351833210",
    channel: "1502262765568528527",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281768139624558/Z.jpg?ex=69ff246c&is=69fdd2ec&hm=f064c7fce002d2d349cb728b68653f613e5ac4b35b63b35fadb6b21e00e7422c&"
  },

  filza_vv: {
    name: "Filza iOS",
    type: "VV",
    price: 150000,
    stock: "filza_vv",
    role: "1502261775922368552",
    channel: "1502262825308131471",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281768139624558/Z.jpg?ex=69ff246c&is=69fdd2ec&hm=f064c7fce002d2d349cb728b68653f613e5ac4b35b63b35fadb6b21e00e7422c&"
  },

  imazing_1ob: {
    name: "iMazing",
    type: "1 OB",
    price: 70000,
    stock: "imazing_1ob",
    role: "1502285054314024990",
    channel: "1502280881082208447",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281720710303815/images.jpg?ex=69ff2461&is=69fdd2e1&hm=7ff65c1fa5474501f42ee23e93bfb7b49d4e429bb1b35fc5034eb7eea40a772b&"
  },

  imazing_vv: {
    name: "iMazing",
    type: "VV",
    price: 150000,
    stock: "imazing_vv",
    role: "1502285135964537024",
    channel: "1502280903739572415",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281720710303815/images.jpg?ex=69ff2461&is=69fdd2e1&hm=7ff65c1fa5474501f42ee23e93bfb7b49d4e429bb1b35fc5034eb7eea40a772b&"
  },

  adr_1ob: {
    name: "File ADR",
    type: "1 OB",
    price: 100000,
    stock: "adr_1ob",
    role: "1502285208097915001",
    channel: "1502267573465513994",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281691493040268/3kdSKZKXxfTWvzAcGEuzJyoY72AAAAAElFTkSuQmCC.png?ex=69ff245a&is=69fdd2da&hm=2834a9f52ad1deca0be14f3add31cb4d72d2b13da96238fd7618738ac8054f63&"
  },

  adr_vv: {
    name: "File ADR",
    type: "VV",
    price: 250000,
    stock: "adr_vv",
    role: "1502285273990697070",
    channel: "1502267673428496424",
    icon: "https://cdn.discordapp.com/attachments/1488240958712709291/1502281691493040268/3kdSKZKXxfTWvzAcGEuzJyoY72AAAAAElFTkSuQmCC.png?ex=69ff245a&is=69fdd2da&hm=2834a9f52ad1deca0be14f3add31cb4d72d2b13da96238fd7618738ac8054f63&"
  }

};

// ================= JSON =================

function loadUsers() {
  return JSON.parse(fs.readFileSync("./users.json"));
}

function saveUsers(data) {
  fs.writeFileSync("./users.json", JSON.stringify(data, null, 2));
}

function loadStock() {
  return JSON.parse(fs.readFileSync("./stock.json"));
}

function saveStock(data) {
  fs.writeFileSync("./stock.json", JSON.stringify(data, null, 2));
}

// ================= SHOP EMBED =================

async function updateShopEmbed() {

  const channel = await client.channels.fetch(
    process.env.SHOP_CHANNEL_ID
  );

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

`)
    .setThumbnail("https://link-thumbnail")
    .setImage("https://link-banner")
    .setFooter({
      text: "NQK Shop Premium"
    })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId("buy")
      .setLabel("🛒 Buy")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("deposit")
      .setLabel("💳 Nạp Tiền")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("balance")
      .setLabel("💰 Số Dư")
      .setStyle(ButtonStyle.Secondary)

  );

  const messages = await channel.messages.fetch({
    limit: 10
  });

  const old = messages.find(
    m => m.author.id === client.user.id
  );

  if (old) {

    await old.edit({
      embeds: [embed],
      components: [row]
    });

  } else {

    await channel.send({
      embeds: [embed],
      components: [row]
    });

  }

}

// ================= READY =================

client.once(Events.ClientReady, async () => {

  console.log(`${client.user.tag} Online`);

  saveStock({
    filza_1ob: 100,
    filza_vv: 100,
    imazing_1ob: 100,
    imazing_vv: 100,
    adr_1ob: 100,
    adr_vv: 100
  });

  updateShopEmbed();

});

// ================= INTERACTION =================

client.on(Events.InteractionCreate, async interaction => {

  // ================= BUTTON =================

  if (interaction.isButton()) {

    // ===== BUY =====

    if (interaction.customId === "buy") {

      const menu = new StringSelectMenuBuilder()
        .setCustomId("select_product")
        .setPlaceholder("📦 Chọn sản phẩm")
        .addOptions([
          {
            label: "Filza iOS",
            value: "filza"
          },
          {
            label: "iMazing",
            value: "imazing"
          },
          {
            label: "File ADR",
            value: "adr"
          }
        ]);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00b0f4")
            .setTitle("🛒 MUA HÀNG")
            .setDescription("> Vui lòng chọn sản phẩm")
        ],
        components: [
          new ActionRowBuilder().addComponents(menu)
        ],
        ephemeral: true
      });

    }

    // ===== BALANCE =====

    if (interaction.customId === "balance") {

      const users = loadUsers();

      if (!users[interaction.user.id]) {

        users[interaction.user.id] = {
          balance: 0
        };

        saveUsers(users);

      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00ff88")
            .setTitle("💰 SỐ DƯ")
            .setDescription(`
👤 User: <@${interaction.user.id}>

# ${users[interaction.user.id].balance.toLocaleString()}đ
`)
        ],
        ephemeral: true
      });

    }

    // ===== DEPOSIT =====

    if (interaction.customId === "deposit") {

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ffaa00")
            .setTitle("💳 NẠP TIỀN")
            .setDescription(`
🏦 Ngân hàng: MBBANK
💳 STK: 123456789
👤 Chủ TK: NQK SHOP

━━━━━━━━━━━━━━━━━━

📝 Nội dung CK:
\`${interaction.user.id}\`

⚡ Bot tự cộng tiền
⏰ Đơn tự huỷ sau 5 phút
`)
        ],
        ephemeral: true
      });

    }

  }

  // ================= SELECT MENU =================

  if (interaction.isStringSelectMenu()) {

    // ===== SELECT PRODUCT =====

    if (interaction.customId === "select_product") {

      const product = interaction.values[0];

      const menu = new StringSelectMenuBuilder()
        .setCustomId(`buy_${product}`)
        .setPlaceholder("💎 Chọn gói")
        .addOptions([
          {
            label: "1 OB",
            value: `${product}_1ob`
          },
          {
            label: "VV",
            value: `${product}_vv`
          }
        ]);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00b0f4")
            .setTitle("💎 CHỌN GÓI")
        ],
        components: [
          new ActionRowBuilder().addComponents(menu)
        ],
        ephemeral: true
      });

    }

    // ===== BUY PRODUCT =====

    if (interaction.customId.startsWith("buy_")) {

      const id = interaction.values[0];

      const product = PRODUCTS[id];

      const users = loadUsers();
      const stock = loadStock();

      if (!users[interaction.user.id]) {

        users[interaction.user.id] = {
          balance: 0
        };

      }

      if (users[interaction.user.id].balance < product.price) {

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle("❌ KHÔNG ĐỦ SỐ DƯ")
              .setDescription(`
💰 Giá:
# ${product.price.toLocaleString()}đ

💵 Số dư:
# ${users[interaction.user.id].balance.toLocaleString()}đ
`)
          ],
          ephemeral: true
        });

      }

      users[interaction.user.id].balance -= product.price;

      stock[product.stock] -= 1;

      saveUsers(users);
      saveStock(stock);

      await updateShopEmbed();

      const member = await interaction.guild.members.fetch(
        interaction.user.id
      );

      try {
        await member.roles.add(product.role);
      } catch {}

      const embed = new EmbedBuilder()
        .setColor("#00ff88")
        .setTitle("✅ MUA HÀNG THÀNH CÔNG")
        .setDescription(`
👤 Khách hàng: <@${interaction.user.id}>
🧾 Mã đơn: \`${interaction.user.id}\`

━━━━━━━━━━━━━━━━━━

📦 Sản phẩm:
# ${product.name}

💎 Gói:
# ${product.type}

💰 Giá:
# ${product.price.toLocaleString()}đ

━━━━━━━━━━━━━━━━━━

🔓 Đã cấp role thành công

📥 Kênh sản phẩm:
> <#${product.channel}>
`)
        .setThumbnail(product.icon)
        .setFooter({
          text: "Cảm ơn đã mua hàng tại NQK Shop"
        })
        .setTimestamp();

      await interaction.user.send({
        embeds: [embed]
      });

      const log = await client.channels.fetch(
        process.env.LOG_CHANNEL_ID
      );

      await log.send({
        embeds: [embed]
      });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });

    }

  }

});

client.login(process.env.TOKEN);
