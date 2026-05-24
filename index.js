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
const express = require("express");

// ===== KEEP RAILWAY ONLINE =====
const app = express();

app.get("/", (req, res) => {
  res.send("Bot Running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Web Running ${PORT}`);
});

// ===== DISCORD CLIENT =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ===== CONFIG =====
const SHOP_CHANNEL = "1502260846754267248";
const LOG_CHANNEL = "1502260922733953155";

const THUMBNAIL =
  "https://cdn.discordapp.com/attachments/1488240958712709291/1500895021161910435/IMG_0491.gif";

const IMAGE =
  "https://cdn.discordapp.com/attachments/1488240958712709291/1500397539742978099/IMG_4659.gif";

const BANK = "Vietinbank";
const STK = "105884390640";

// ===== FILE =====
const balancesFile = "./balances.json";

if (!fs.existsSync(balancesFile)) {
  fs.writeFileSync(balancesFile, "{}");
}

function getBalances() {
  try {
    return JSON.parse(fs.readFileSync(balancesFile));
  } catch {
    return {};
  }
}

function saveBalances(data) {
  fs.writeFileSync(
    balancesFile,
    JSON.stringify(data, null, 2)
  );
}

// ===== STOCK =====
const stock = {
  filza: {
    remain: 100,
    sold: 0
  },

  imazing: {
    remain: 100,
    sold: 0
  },

  adr: {
    remain: 100,
    sold: 0
  }
};

// ===== PRODUCTS =====
const products = {
  filza: {
    name: "Filza iOS",

    prices: {
      ob: {
        price: 50000,
        label: "1 OB",
        role: "1502261658351833210",
        channel: "1502262765568528527"
      },

      vv: {
        price: 100000,
        label: "Vĩnh Viễn",
        role: "1502261775922368552",
        channel: "1502262825308131471"
      }
    }
  },

  imazing: {
    name: "iMazing",

    prices: {
      ob: {
        price: 70000,
        label: "1 OB",
        role: "1502285054314024990",
        channel: "1502280881082208447"
      },

      vv: {
        price: 150000,
        label: "Vĩnh Viễn",
        role: "1502285135964537024",
        channel: "1502280903739572415"
      }
    }
  },

  adr: {
    name: "File ADR",

    prices: {
      ob: {
        price: 100000,
        label: "1 OB",
        role: "1502285208097915001",
        channel: "1502267573465513994"
      },

      vv: {
        price: 250000,
        label: "Vĩnh Viễn",
        role: "1502285273990697070",
        channel: "1502267673428496424"
      }
    }
  }
};

let shopMessage;

// ===== SHOP EMBED =====
async function sendShopEmbed() {

  const channel = await client.channels.fetch(
    SHOP_CHANNEL
  );

  if (!channel) return;

  const embed = new EmbedBuilder()

.setColor("#00d4ff")

.setAuthor({
    name: "NQK SHOP PREMIUM",
    iconURL: THUMBNAIL
})

.setTitle("🛒 SHOP FILE AUTO BUY")
    
.setDescription(`
╭━━━ 💎 **SHOP FILE PREMIUM** ━━━╮
> ⚡ Tự động 24/7
> 🔥 Giao nhanh • Uy tín
> 💬 Hỗ trợ nhanh chóng
╰━━━━━━━━━━━━━━━━━━╯
`)

.addFields(

{
name:"🔥 Filza iOS",
value:
`💸 **1 OB:** \`50.000₫\`
💎 **VV:** \`100.000₫\`

📤 **Đã bán:** \`${stock.filza.sold}\`
📥 **Còn:** \`${stock.filza.remain}\``,
inline:true
},

{
name:"💎 iMazing",
value:
`💸 **1 OB:** \`70.000₫\`
💎 **VV:** \`150.000₫\`

📤 **Đã bán:** \`${stock.imazing.sold}\`
📥 **Còn:** \`${stock.imazing.remain}\``,
inline:true
},

{
name:"📁 File ADR",
value:
`💸 **1 OB:** \`100.000₫\`
💎 **VV:** \`250.000₫\`

📤 **Đã bán:** \`${stock.adr.sold}\`
📥 **Còn:** \`${stock.adr.remain}\``,
inline:true
},

{
name:"📌 Thông tin",
value:
`🛒 Mua hàng tự động
💳 Nạp tiền qua QR
📩 Nhận file qua DM
⚡ Online 24/7`,
inline:false
}

)

.setThumbnail(THUMBNAIL)

.setImage(IMAGE)

.setFooter({
text:"NQK SHOP • Premium Store"
})

.setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("buy")
        .setLabel("🛒 Mua")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("nap")
        .setLabel("💳 Nạp")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("balance")
        .setLabel("🧧 Số Dư")
        .setStyle(ButtonStyle.Secondary)
    );

  const messages = await channel.messages.fetch({
    limit: 20
  });

  const old = messages.find(
    m =>
      m.author.id === client.user.id &&
      m.embeds.length
  );

  if (old) {

    shopMessage = await old.edit({
      embeds: [embed],
      components: [row]
    });

  } else {

    shopMessage = await channel.send({
      embeds: [embed],
      components: [row]
    });
  }
}

// ===== UPDATE EMBED =====
async function updateShopEmbed() {

  if (!shopMessage) return;

  const embed = EmbedBuilder.from(
    shopMessage.embeds[0]
  );

  embed.setFields(

{
name:"🔥 File Filza iOS",
value:
`💸 **1 OB:** \`50.000₫\`
💎 **VV:** \`100.000₫\`

📤 **Đã bán:** \`${stock.filza.sold}\`
📥 **Còn:** \`${stock.filza.remain}\``,
inline:true
},

{
name:"💎 File iMazing iOS",
value:
`💸 **1 OB:** \`70.000₫\`
💎 **VV:** \`150.000₫\`

📤 **Đã bán:** \`${stock.imazing.sold}\`
📥 **Còn:** \`${stock.imazing.remain}\``,
inline:true
},

{
name:"📁 File ADR [ Root ]",
value:
`💸 **1 OB:** \`100.000₫\`
💎 **VV:** \`250.000₫\`

📤 **Đã bán:** \`${stock.adr.sold}\`
📥 **Còn:** \`${stock.adr.remain}\``,
inline:true
},

{
name:"📌 Thông tin",
value:
`🛒 Mua hàng tự động
💳 Thanh toán QR
📩 Nhận file qua DM
⚡ Online 24/7`,
inline:false
}

);

// ===== READY =====
client.once("ready", async () => {

  console.log(`${client.user.tag} Online`);

  try {
    await sendShopEmbed();
  } catch (err) {
    console.log(err);
  }
});

// ===== INTERACTION =====
client.on(
  Events.InteractionCreate,
  async interaction => {

    try {

      // ===== BUY BUTTON =====
      if (
        interaction.isButton() &&
        interaction.customId === "buy"
      ) {

        const menu =
          new StringSelectMenuBuilder()
            .setCustomId("select_product")
            .setPlaceholder("📦 Chọn sản phẩm")
            .addOptions([
              {
                label: "Filza iOS",
                value: "filza",
                emoji: "🔥"
              },

              {
                label: "iMazing",
                value: "imazing",
                emoji: "💎"
              },

              {
                label: "File ADR",
                value: "adr",
                emoji: "📁"
              }
            ]);

        return interaction.reply({
          components: [
            new ActionRowBuilder().addComponents(
              menu
            )
          ],
          ephemeral: true
        });
      }

      // ===== SELECT PRODUCT =====
      if (
        interaction.isStringSelectMenu() &&
        interaction.customId === "select_product"
      ) {

        const productKey =
          interaction.values[0];

        const product =
          products[productKey];

        const menu =
          new StringSelectMenuBuilder()
            .setCustomId(
              `price_${productKey}`
            )
            .setPlaceholder(
              "📌 Chọn gói"
            )
            .addOptions(
              Object.entries(
                product.prices
              ).map(([key, data]) => ({
                label: `${data.price.toLocaleString()}₫ | ${data.label}`,
                value: key
              }))
            );

        return interaction.update({
          components: [
            new ActionRowBuilder().addComponents(
              menu
            )
          ]
        });
      }

      // ===== BUY PRODUCT =====
      if (
        interaction.isStringSelectMenu() &&
        interaction.customId.startsWith(
          "price_"
        )
      ) {

        await interaction.deferReply({
          ephemeral: true
        });

        const productKey =
          interaction.customId.replace(
            "price_",
            ""
          );

        const packageKey =
          interaction.values[0];

        const product =
          products[productKey];

        if (!product) {
          return interaction.editReply({
            content:
              "❌ Không tìm thấy sản phẩm"
          });
        }

        const option =
          product.prices[packageKey];

        if (!option) {
          return interaction.editReply({
            content:
              "❌ Không tìm thấy gói"
          });
        }

        const price =
          option.price;

        const balances =
          getBalances();

        if (
          !balances[interaction.user.id]
        ) {
          balances[interaction.user.id] = 0;
        }

        // ===== CHECK MONEY =====
        if (
          balances[interaction.user.id] <
          price
        ) {

          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle(
                  "❌ Số dư không đủ"
                )
                .setDescription(`
💵 Số dư hiện tại:
${balances[
  interaction.user.id
].toLocaleString()}₫
`)
            ]
          });
        }

        // ===== SUB MONEY =====
        balances[interaction.user.id] -=
          price;

        saveBalances(balances);

        // ===== STOCK =====
        stock[productKey].sold++;
        stock[productKey].remain--;

        await updateShopEmbed();

        // ===== MEMBER =====
        const member =
          await interaction.guild.members.fetch(
            interaction.user.id
          );

        // ===== ADD ROLE =====
        try {
          await member.roles.add(
            option.role
          );
        } catch (err) {
          console.log(
            "ADD ROLE ERROR:",
            err
          );
        }

        // ===== CHANNEL =====
        const productChannel =
          interaction.guild.channels.cache.get(
            option.channel
          );

        const orderCode =
          `${interaction.user.id}-${Date.now()}`;

        // ===== SUCCESS EMBED =====
        const successEmbed =
          new EmbedBuilder()
            .setColor("#00ff88")
            .setTitle(
              "🌐 Mua File Thành Công"
            )
            .setThumbnail(
              interaction.user.displayAvatarURL()
            )
            .addFields(
              {
                name: "👤 Người Mua",
                value: `${interaction.user.tag}`
              },

              {
                name: "🧾 Mã Đơn",
                value: `\`${orderCode}\``
              },

              {
                name: "📦 Sản phẩm",
                value: product.name
              },

              {
                name: "💎 Gói",
                value: option.label
              },

              {
                name: "💰 Giá",
                value: `${price.toLocaleString()}₫`
              },

              {
                name: "📂 Kênh",
                value:
                  productChannel
                    ? `${productChannel}`
                    : "Không tìm thấy"
              }
            )
            .setImage(IMAGE)
            .setFooter({
              text:
                "Cảm ơn bạn đã mua hàng ❤️"
            });

        // ===== DM =====
        try {

          await interaction.user.send({
            embeds: [successEmbed]
          });

        } catch {

          console.log(
            "Không thể gửi DM"
          );
        }

        // ===== LOG =====
        try {

          const logChannel =
            await client.channels.fetch(
              LOG_CHANNEL
            );

          if (logChannel) {
            await logChannel.send({
              embeds: [successEmbed]
            });
          }

        } catch (err) {
          console.log(err);
        }

        // ===== SUCCESS =====
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#00ff88")
              .setDescription(`
✅ Đã mua thành công **${product.name}**
💎 Gói: **${option.label}**

📩 Kiểm tra DM để nhận sản phẩm.
`)
          ]
        });
      }

      // ===== BALANCE =====
      if (
        interaction.isButton() &&
        interaction.customId ===
          "balance"
      ) {

        const balances =
          getBalances();

        const money =
          balances[interaction.user.id] || 0;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#00d4ff")
              .setTitle(
                "💰 SỐ DƯ TÀI KHOẢN"
              )
              .setDescription(`
👤 ${interaction.user}

💵 Số dư:
## ${money.toLocaleString()}₫
`)
          ],
          ephemeral: true
        });
      }

      // ===== NAP =====
      if (
        interaction.isButton() &&
        interaction.customId === "nap"
      ) {

        const modal =
          new ModalBuilder()
            .setCustomId(
              "nap_modal"
            )
            .setTitle("Nạp Tiền");

        const amount =
          new TextInputBuilder()
            .setCustomId("money")
            .setLabel(
              "Nhập số tiền"
            )
            .setPlaceholder(
              "Ví dụ: 50000"
            )
            .setRequired(true)
            .setStyle(
              TextInputStyle.Short
            );

        modal.addComponents(
          new ActionRowBuilder().addComponents(
            amount
          )
        );

        return interaction.showModal(
          modal
        );
      }

      // ===== MODAL =====
      if (
        interaction.isModalSubmit() &&
        interaction.customId ===
          "nap_modal"
      ) {

        const amount =
          interaction.fields.getTextInputValue(
            "money"
          );

        if (
          isNaN(amount) ||
          Number(amount) <= 0
        ) {
          return interaction.reply({
            content:
              "❌ Số tiền không hợp lệ",
            ephemeral: true
          });
        }

        const qr =
          `https://img.vietqr.io/image/vietinbank-${STK}-compact2.png?amount=${Number(amount)}&addInfo=${interaction.user.id}`;

        const qrEmbed =
          new EmbedBuilder()
            .setColor("#00d4ff")
            .setTitle(
              "💳 THANH TOÁN QR"
            )
            .setDescription(`
🏦 Ngân hàng: ${BANK}
💳 STK: ${STK}

💰 Số tiền:
## ${Number(
              amount
            ).toLocaleString()}₫

📝 Nội dung:
\`${interaction.user.id}\`
`)
            .setImage(qr)
            .setFooter({
              text:
                "NQK SHOP PREMIUM"
            });

        await interaction.reply({
          embeds: [qrEmbed],
          ephemeral: true
        });

        // ===== ADMIN LOG =====
        const adminEmbed =
          new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("📥 ĐƠN NẠP")
            .addFields(
              {
                name: "👤 Người Nạp",
                value: `${interaction.user.tag}`
              },

              {
                name: "💰 Số Tiền",
                value: `${Number(
                  amount
                ).toLocaleString()}₫`
              },

              {
                name: "📌 Trạng Thái",
                value:
                  "⏳ Chờ duyệt"
              }
            );

        const row =
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(
                  `accept_${interaction.user.id}_${amount}`
                )
                .setLabel("✅ Duyệt")
                .setStyle(
                  ButtonStyle.Success
                ),

              new ButtonBuilder()
                .setCustomId(
                  `deny_${interaction.user.id}`
                )
                .setLabel(
                  "❌ Từ Chối"
                )
                .setStyle(
                  ButtonStyle.Danger
                )
            );

        const logChannel =
          await client.channels.fetch(
            LOG_CHANNEL
          );

        if (logChannel) {
          await logChannel.send({
            embeds: [adminEmbed],
            components: [row]
          });
        }
      }

      // ===== ACCEPT =====
      if (
        interaction.isButton() &&
        interaction.customId.startsWith(
          "accept_"
        )
      ) {

        if (
          !interaction.member.roles.cache.has(
            process.env.ADMIN_ROLE
          )
        ) {
          return interaction.reply({
            content:
              "❌ Không có quyền",
            ephemeral: true
          });
        }

        const data =
          interaction.customId.split(
            "_"
          );

        const userId = data[1];

        const amount =
          Number(data[2]);

        const balances =
          getBalances();

        if (!balances[userId]) {
          balances[userId] = 0;
        }

        balances[userId] += amount;

        saveBalances(balances);

        const embed =
          EmbedBuilder.from(
            interaction.message.embeds[0]
          );

        embed.spliceFields(2, 1, {
          name: "📌 Trạng Thái",
          value: "✅ Đã duyệt"
        });

        await interaction.update({
          embeds: [embed],
          components: []
        });

        try {

          const user =
            await client.users.fetch(
              userId
            );

          await user.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#00ff88")
                .setTitle(
                  "✅ NẠP TIỀN THÀNH CÔNG"
                )
                .setDescription(`
💰 Đã cộng:
## ${amount.toLocaleString()}₫
`)
            ]
          });

        } catch {}
      }

      // ===== DENY =====
      if (
        interaction.isButton() &&
        interaction.customId.startsWith(
          "deny_"
        )
      ) {

        const embed =
          EmbedBuilder.from(
            interaction.message.embeds[0]
          );

        embed.spliceFields(2, 1, {
          name: "📌 Trạng Thái",
          value: "❌ Đã từ chối"
        });

        await interaction.update({
          embeds: [embed],
          components: []
        });
      }

    } catch (err) {

      console.log(
        "INTERACTION ERROR:",
        err
      );

      try {

        if (
          interaction.deferred ||
          interaction.replied
        ) {

          await interaction.editReply({
            content:
              "❌ Đã xảy ra lỗi"
          });

        } else {

          await interaction.reply({
            content:
              "❌ Đã xảy ra lỗi",
            ephemeral: true
          });
        }

      } catch {}
    }
  }
);

// ===== ERROR =====
process.on(
  "unhandledRejection",
  err => {
    console.log(
      "UNHANDLED:",
      err
    );
  }
);

process.on(
  "uncaughtException",
  err => {
    console.log(
      "UNCAUGHT:",
      err
    );
  }
);

// ===== LOGIN =====
client.login(process.env.TOKEN);
