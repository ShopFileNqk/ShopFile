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
  Events,
  ChannelType
} = require("discord.js");

const fs = require("fs");
const express = require("express");

// ================= EXPRESS KEEP ALIVE =================
const app = express();

app.get("/", (req, res) => {
  res.send("Bot Running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Web Running ${PORT}`);
});

// ================= DISCORD CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ================= CONFIG =================
const SHOP_CHANNEL = "1502260846754267248";
const LOG_CHANNEL = "1502260922733953155";

const THUMBNAIL =
  "https://cdn.discordapp.com/attachments/1488240958712709291/1500895021161910435/IMG_0491.gif";

const IMAGE =
  "https://cdn.discordapp.com/attachments/1488240958712709291/1500397539742978099/IMG_4659.gif";

const BANK = "Vietinbank";
const STK = "105884390640";

// ================= FILE =================
const balancesFile = "./balances.json";
const stockFile = "./stock.json";

// ================= CREATE FILE =================
if (!fs.existsSync(balancesFile)) {
  fs.writeFileSync(balancesFile, "{}");
}

if (!fs.existsSync(stockFile)) {
  fs.writeFileSync(
    stockFile,
    JSON.stringify(
      {
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
      },
      null,
      2
    )
  );
}

// ================= JSON =================
function safeReadJSON(path, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path));
  } catch (err) {
    console.log(`READ JSON ERROR ${path}`, err);
    return fallback;
  }
}

function safeWriteJSON(path, data) {
  try {
    fs.writeFileSync(
      path,
      JSON.stringify(data, null, 2)
    );
  } catch (err) {
    console.log(`WRITE JSON ERROR ${path}`, err);
  }
}

function getBalances() {
  return safeReadJSON(balancesFile, {});
}

function saveBalances(data) {
  safeWriteJSON(balancesFile, data);
}

function getStock() {
  return safeReadJSON(stockFile, {});
}

function saveStock(data) {
  safeWriteJSON(stockFile, data);
}

// ================= STOCK =================
let stock = getStock();

// ================= PRODUCTS =================
const products = {

  filza: {
    name: "Filza iOS",

    prices: {

      ob: {
        price: 90000,
        label: "1 OB",
        role: "1502261658351833210",
        channel: "1502262765568528527"
      },

      vv: {
        price: 250000,
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
        price: 100000,
        label: "1 OB",
        role: "1502285054314024990",
        channel: "1502280881082208447"
      },

      vv: {
        price: 250000,
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

let shopMessage = null;

// ================= SHOP EMBED =================
function createShopEmbed() {

  stock = getStock();

  return new EmbedBuilder()

    .setColor("#5865F2")

    .setAuthor({
      name: "𝗦𝗛𝗢𝗣 𝗙𝗜𝗟𝗘 𝗣𝗥𝗘𝗠𝗜𝗨𝗠",
      iconURL: THUMBNAIL
    })

    .setTitle("🛒 𝗧𝗮̂́𝘁 𝗰𝗮̉ 𝗙𝗶𝗹𝗲 𝗔𝗻𝘁𝗶𝗕𝗮𝗻")

    .setDescription(`
╭─────────────⭓
> 🎰𝗠𝘂𝗮 𝗙𝗶𝗹𝗲 𝘁𝘂̛̣ 𝗱̵𝗼̣̂𝗻𝗴
> 🖇 𝗔𝗻𝘁𝗶𝗕𝗮𝗻 𝟵𝟬%
> 🚀 𝗛𝗼̂̃ 𝘁𝗿𝗼̛̣ 𝗻𝗵𝗮𝗻𝗵 𝟮𝟰/𝟳
╰─────────────⭓
`)

    .addFields(

      {
        name: "🎮 𝔽𝕚𝕝𝕫𝕒 𝕚𝕆𝕊",
        value:
`> 💠 𝟙 𝕆𝔹 ➭ 90.000₫
> 👑 𝕍𝕚̃𝕟𝕙 𝕍𝕚𝕖̂̃𝕟 ➭ 250.000₫
> 📦 𝔹𝕒́𝕟: ${stock.filza.sold}
> 📁 𝕂𝕙𝕠 ℂ𝕠̀𝕟: ${stock.filza.remain}`,
        inline: true
      },

      {
        name: "🎯 𝕀𝕞𝕒𝕫𝕚𝕟𝕘 𝕚𝕆𝕊",
        value:
`> 💠 𝟙 𝕆𝔹 ➭ 100.000₫
> 👑 𝕍𝕚̃𝕟𝕙 𝕍𝕚𝕖̂̃𝕟 ➭ 250.000₫
> 📦 𝔹𝕒́𝕟: ${stock.imazing.sold}
> 📁 𝕂𝕙𝕠 ℂ𝕠̀𝕟: ${stock.imazing.remain}`,
        inline: true
      },

      {
        name: "🧩 𝔽𝕚𝕝𝕖 𝔸𝕕𝕣 [ ℝ𝕠𝕠𝕥 ]",
        value:
`> 💠 𝟙 𝕆𝔹 ➭ 100.000₫
> 👑 𝕍𝕚̃𝕟𝕙 𝕍𝕚𝕖̂̃𝕟 ➭ 250.000₫
> 📦 𝔹𝕒́𝕟: ${stock.adr.sold}
> 📁 𝕂𝕙𝕠 ℂ𝕠̀𝕟: ${stock.adr.remain}`,
        inline: true
      },

      {
        name: "━━━━━━━━━━━ 📁 𝗧𝗵𝗼̂𝗻𝗴 𝗧𝗶𝗻",
        value:
`> 📩 𝗡𝗵𝗮̣̂𝗻 𝗙𝗶𝗹𝗲 𝗸𝗵𝗶 𝗺𝘂𝗮 𝗾𝘂𝗮 𝗗𝗠
> 🔰 𝗛𝗲̣̂ 𝘁𝗵𝗼̂́𝗻𝗴 𝗵𝗼𝗮̣𝘁 𝗱̵𝗼̣̂𝗻𝗴 𝟮𝟰/𝟳`,
        inline: false
      }
    )

    .setThumbnail(THUMBNAIL)

    .setImage(IMAGE)

    .setFooter({
      text: "𝗕𝗼𝘁 𝗖𝗿𝗲𝗮𝘁𝗲 𝗕𝘆 𝗤.𝗞𝗵𝗮́𝗻𝗵"
    })

    .setTimestamp();
}

// ================= BUTTON =================
function createMainButtons() {

  return new ActionRowBuilder().addComponents(

    new ButtonBuilder()
      .setCustomId("buy")
      .setLabel("Mua")
      .setEmoji("🛒")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("nap")
      .setLabel("Nạp")
      .setEmoji("💳")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("balance")
      .setLabel("Tiền")
      .setEmoji("💰")
      .setStyle(ButtonStyle.Secondary)
  );
}

// ================= SEND SHOP =================
async function sendShopEmbed() {

  try {

    const channel =
      await client.channels.fetch(
        SHOP_CHANNEL
      );

    if (!channel) return;

    const messages =
      await channel.messages.fetch({
        limit: 20
      });

    const oldMessage =
      messages.find(
        m =>
          m.author.id === client.user.id &&
          m.embeds.length > 0
      );

    if (oldMessage) {

      shopMessage =
        await oldMessage.edit({
          embeds: [createShopEmbed()],
          components: [createMainButtons()]
        });

    } else {

      shopMessage =
        await channel.send({
          embeds: [createShopEmbed()],
          components: [createMainButtons()]
        });
    }

  } catch (err) {
    console.log(err);
  }
}

// ================= UPDATE SHOP =================
async function updateShopEmbed() {

  try {

    stock = getStock();

    if (!shopMessage) return;

    await shopMessage.edit({
      embeds: [createShopEmbed()],
      components: [createMainButtons()]
    });

  } catch (err) {
    console.log(err);
  }
}

// ================= READY =================
client.once("ready", async () => {

  console.log(`✅ ${client.user.tag}`);

  await sendShopEmbed();
});

// ================= INTERACTION =================
client.on(
  Events.InteractionCreate,
  async interaction => {

    try {

      // ================= BUY =================
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
                label: "𝗙𝗶𝗹𝘇𝗮",
                value: "filza",
                emoji: "🎮"
              },

              {
                label: "𝗜𝗺𝗮𝘇𝗶𝗻𝗴",
                value: "imazing",
                emoji: "🎯"
              },

              {
                label: "𝗔𝗻𝗱𝗿𝗼𝗶",
                value: "adr",
                emoji: "🧩"
              }
            ]);

        return interaction.reply({
          components: [
            new ActionRowBuilder().addComponents(menu)
          ],
          ephemeral: true
        });
      }

      // ================= SELECT PRODUCT =================
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
            .setCustomId(`price_${productKey}`)
            .setPlaceholder("📥 Chọn Thời Hạn")
            .addOptions(
              Object.entries(product.prices).map(
                ([key, data]) => ({
                  label: `${data.price.toLocaleString()}₫ • ${data.label}`,
                  value: key
                })
              )
            );

        return interaction.update({
          components: [
            new ActionRowBuilder().addComponents(menu)
          ]
        });
      }

      // ================= BUY PRODUCT =================
      if (
        interaction.isStringSelectMenu() &&
        interaction.customId.startsWith("price_")
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

        const option =
          product.prices[packageKey];

        if (
          stock[productKey].remain <= 0
        ) {

          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle("❌ Hết hàng")
                .setDescription(
                  "Sản phẩm hiện đã hết hàng."
                )
            ]
          });
        }

        const price = option.price;

        const balances =
          getBalances();

        if (
          !balances[interaction.user.id]
        ) {
          balances[interaction.user.id] = 0;
        }

        if (
          balances[interaction.user.id] <
          price
        ) {

          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle(
                  "💸 Số dư không đủ"
                )
                .setDescription(`
💰 Số dư hiện tại của bạn:
## ${balances[
                  interaction.user.id
                ].toLocaleString()}₫
`)
            ]
          });
        }

        // ===== SUB MONEY =====
        balances[interaction.user.id] -= price;

        saveBalances(balances);

        // ===== UPDATE STOCK =====
        stock[productKey].sold++;
        stock[productKey].remain--;

        saveStock(stock);

        await updateShopEmbed();

        // ===== MEMBER =====
        let member = null;

        try {

          member =
            await interaction.guild.members.fetch(
              interaction.user.id
            );

        } catch {}

        // ===== ADD ROLE =====
        if (member) {

          try {
            await member.roles.add(
              option.role
            );
          } catch (err) {
            console.log(err);
          }
        }

        // ===== CHANNEL =====
        const productChannel =
          interaction.guild.channels.cache.get(
            option.channel
          );

        const orderCode =
          `${interaction.user.id}-${Date.now()}`;

        // ================= SUCCESS EMBED =================
        const successEmbed = new EmbedBuilder()

          .setColor("#5865F2")

          .setAuthor({
            name: "NQK SHOP PREMIUM",
            iconURL: THUMBNAIL
          })

          .setTitle("✅ THANH TOÁN THÀNH CÔNG")

          .setDescription(`
╭─────────────⭓
> 💎 Đơn hàng đã xử lý thành công
> 📩 File & quyền truy cập đã được cấp
> 🚀 Cảm ơn bạn đã ủng hộ shop
╰─────────────⭓
`)

          .addFields(

            {
              name: "👤 Khách Hàng",
              value: `\`${interaction.user.tag}\``,
              inline: true
            },

            {
              name: "🧾 Mã Đơn",
              value: `\`${orderCode}\``,
              inline: true
            },

            {
              name: "💰 Thanh Toán",
              value: `\`${price.toLocaleString()}₫\``,
              inline: true
            },

            {
              name: "📦 Sản Phẩm",
              value: `
> ${product.name}
> ${option.label}
`,
              inline: true
            },

            {
              name: "📁 Kênh Nhận",
              value:
                productChannel
                  ? `${productChannel}`
                  : "`Không tìm thấy`",
              inline: true
            },

            {
              name: "⚡ Trạng Thái",
              value: "`Hoàn tất`",
              inline: true
            }
          )

          .setThumbnail(
            interaction.user.displayAvatarURL()
          )

          .setImage(IMAGE)

          .setFooter({
            text:
              "NQK SHOP PREMIUM • AUTO DELIVERY"
          })

          .setTimestamp();

        // ===== DM =====
        try {

          await interaction.user.send({
            embeds: [successEmbed]
          });

        } catch (err) {
          console.log(err);
        }

        // ===== LOG =====
        try {

          const logChannel =
            await client.channels.fetch(
              LOG_CHANNEL
            );

          if (
            logChannel &&
            logChannel.type ===
              ChannelType.GuildText
          ) {

            await logChannel.send({
              embeds: [successEmbed]
            });
          }

        } catch (err) {
          console.log(err);
        }

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#5865F2")
              .setDescription(`
╭─────────────⭓
> ✅ Mua hàng thành công
> 📦 ${product.name} • ${option.label}
> 📩 Kiểm tra tin nhắn riêng
╰─────────────⭓
`)
          ]
        });
      }

      // ================= BALANCE =================
      if (
        interaction.isButton() &&
        interaction.customId === "balance"
      ) {

        const balances =
          getBalances();

        const money =
          balances[interaction.user.id] || 0;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#5865F2")
              .setTitle("💰 SỐ DƯ")
              .setDescription(`
👤 ${interaction.user}

## ${money.toLocaleString()}₫
`)
          ],
          ephemeral: true
        });
      }

      // ================= NAP =================
      if (
        interaction.isButton() &&
        interaction.customId === "nap"
      ) {

        const modal =
          new ModalBuilder()
            .setCustomId("nap_modal")
            .setTitle("Nạp Tiền");

        const amount =
          new TextInputBuilder()
            .setCustomId("money")
            .setLabel("Nhập số tiền")
            .setPlaceholder("50000")
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

      // ================= MODAL =================
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

            .setColor("#5865F2")

            .setTitle("💳 THANH TOÁN QR")

            .setDescription(`
🏦 Bank: \`${BANK}\`
💳 STK: \`${STK}\`

💰 Số tiền:
## ${Number(
              amount
            ).toLocaleString()}₫

📝 Nội dung:
\`${interaction.user.id}\`
`)

            .setImage(qr)

            .setFooter({
              text: "NQK SHOP PREMIUM"
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
                value: "⏳ Chờ duyệt"
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
                .setLabel("❌ Từ Chối")
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

      // ================= ACCEPT =================
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
          interaction.customId.split("_");

        const userId = data[1];
        const amount = Number(data[2]);

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
                  "☃️ NẠP TIỀN THÀNH CÔNG"
                )
                .setDescription(`
💰 Đã nạp vào tài khoản:
## ${amount.toLocaleString()}₫
`)
            ]
          });

        } catch (err) {
          console.log(err);
        }
      }

      // ================= DENY =================
      if (
        interaction.isButton() &&
        interaction.customId.startsWith(
          "deny_"
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
        "❌ INTERACTION ERROR:",
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

      } catch (e) {
        console.log(e);
      }
    }
  }
);

// ================= ERROR =================
process.on(
  "unhandledRejection",
  err => {
    console.log(err);
  }
);

process.on(
  "uncaughtException",
  err => {
    console.log(err);
  }
);

// ================= LOGIN =================
client.login(process.env.TOKEN).catch(err => {
  console.log(err);
});
