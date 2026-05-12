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

process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION:", err);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const SHOP_CHANNEL = "1502260846754267248";
const LOG_CHANNEL = "1502260922733953155";

const THUMBNAIL =
  "https://cdn.discordapp.com/attachments/1488240958712709291/1500895021161910435/IMG_0491.gif?ex=69fa18ea&is=69f8c76a&hm=080e74b7998cae2f1830ec1d1ba0af75859270b1533c03ff01a67304c56393de&";

const IMAGE =
  "https://cdn.discordapp.com/attachments/1488240958712709291/1500397539742978099/IMG_4659.gif?ex=69f84999&is=69f6f819&hm=040340c069537f4776a7258461d755173fa081827364d1d3216f7b34d0d98f44&";

const BANK = "Vietinbank";
const STK = "105884390640";

const balancesFile = "./balances.json";

if (!fs.existsSync(balancesFile)) {
  fs.writeFileSync(balancesFile, "{}");
}

function getBalances() {
  try {
    return JSON.parse(
      fs.readFileSync(balancesFile)
    );
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

const products = {
  filza: {
    name: "Filza iOS",

    prices: {
      "50000": {
        label: "1 OB",
        role: "1502261658351833210",
        channel: "1502262765568528527"
      },

      "150000": {
        label: "Vĩnh Viễn",
        role: "1502261775922368552",
        channel: "1502262825308131471"
      }
    }
  },

  imazing: {
    name: "iMazing",

    prices: {
      "70000": {
        label: "1 OB",
        role: "1502285054314024990",
        channel: "1502280881082208447"
      },

      "150000": {
        label: "Vĩnh Viễn",
        role: "1502285135964537024",
        channel: "1502280903739572415"
      }
    }
  },

  adr: {
    name: "File ADR",

    prices: {
      "100000": {
        label: "1 OB",
        role: "1502285208097915001",
        channel: "1502267573465513994"
      },

      "250000": {
        label: "Vĩnh Viễn",
        role: "1502285273990697070",
        channel: "1502267673428496424"
      }
    }
  }
};

let shopMessage;

async function sendShopEmbed() {

  try {

    const channel =
      await client.channels.fetch(
        SHOP_CHANNEL
      );

    if (!channel) return;

    const embed =
      new EmbedBuilder()
        .setColor("#00d4ff")
        .setTitle("🛒 NQK SHOP FILE")
        .setDescription(`
╭・💎 **FILE PREMIUM**
╰・Tự động • Nhanh • Uy tín

━━━━━━━━━━━━━━━━━━

### 🔥 Filza iOS
> 💸 50.000₫ ・1 OB
> 💸 150.000₫ ・VV
> 📤 Đã bán: ${stock.filza.sold}
> 📥 Còn lại: ${stock.filza.remain}

━━━━━━━━━━━━━━━━━━

### 💎 iMazing
> 💸 70.000₫ ・1 OB
> 💸 150.000₫ ・VV
> 📤 Đã bán: ${stock.imazing.sold}
> 📥 Còn lại: ${stock.imazing.remain}

━━━━━━━━━━━━━━━━━━

### 📁 File ADR
> 💸 100.000₫ ・1 OB
> 💸 250.000₫ ・VV
> 📤 Đã bán: ${stock.adr.sold}
> 📥 Còn lại: ${stock.adr.remain}

━━━━━━━━━━━━━━━━━━

> ⚡ Mua hàng tự động 24/7
> 🔥 Hỗ trợ nhanh chóng
`)
        .setThumbnail(THUMBNAIL)
        .setImage(IMAGE)
        .setFooter({
          text: "NQK SHOP PREMIUM"
        });

    const row =
      new ActionRowBuilder()
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

    const messages =
      await channel.messages.fetch({
        limit: 20
      });

    const old = messages.find(
      m =>
        m.author.id ===
          client.user.id &&
        m.embeds.length
    );

    if (old) {

      shopMessage =
        await old.edit({
          embeds: [embed],
          components: [row]
        });

    } else {

      shopMessage =
        await channel.send({
          embeds: [embed],
          components: [row]
        });
    }

  } catch (err) {
    console.log(
      "SEND SHOP EMBED ERROR:",
      err
    );
  }
}

async function updateShopEmbed() {

  try {

    if (!shopMessage) return;

    const embed =
      EmbedBuilder.from(
        shopMessage.embeds[0]
      );

    embed.setDescription(`
╭・💎 **FILE PREMIUM**
╰・Tự động • Nhanh • Uy tín

━━━━━━━━━━━━━━━━━━

### 🔥 Filza iOS
> 💸 50.000₫ ・1 OB
> 💸 150.000₫ ・VV
> 📤 Đã bán: ${stock.filza.sold}
> 📥 Còn lại: ${stock.filza.remain}

━━━━━━━━━━━━━━━━━━

### 💎 iMazing
> 💸 70.000₫ ・1 OB
> 💸 150.000₫ ・VV
> 📤 Đã bán: ${stock.imazing.sold}
> 📥 Còn lại: ${stock.imazing.remain}

━━━━━━━━━━━━━━━━━━

### 📁 File ADR
> 💸 100.000₫ ・1 OB
> 💸 250.000₫ ・VV
> 📤 Đã bán: ${stock.adr.sold}
> 📥 Còn lại: ${stock.adr.remain}

━━━━━━━━━━━━━━━━━━

> ⚡ Mua hàng tự động 24/7
> 🔥 Hỗ trợ nhanh chóng
`);

    await shopMessage.edit({
      embeds: [embed]
    });

  } catch (err) {
    console.log(
      "UPDATE SHOP ERROR:",
      err
    );
  }
}

client.once("ready", async () => {

  console.log(
    `${client.user.tag} Online`
  );

  await sendShopEmbed();
});

client.on(
  Events.InteractionCreate,
  async interaction => {

    try {

      // BUY
      if (
        interaction.isButton() &&
        interaction.customId === "buy"
      ) {

        const menu =
          new StringSelectMenuBuilder()
            .setCustomId(
              "select_product"
            )
            .setPlaceholder(
              "📦 Chọn sản phẩm"
            )
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

      // SELECT PRODUCT
      if (
        interaction.isStringSelectMenu() &&
        interaction.customId ===
          "select_product"
      ) {

        await interaction.deferUpdate();

        const productKey =
          interaction.values[0];

        const product =
          products[productKey];

        if (!product) return;

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
              ).map(
                ([price, data]) => ({
                  label:
                    `${Number(
                      price
                    ).toLocaleString()}₫ | ${data.label}`,
                  value: price
                })
              )
            );

        return interaction.editReply({
          components: [
            new ActionRowBuilder().addComponents(
              menu
            )
          ]
        });
      }

      // BUY PRODUCT
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

        const product =
          products[productKey];

        if (!product) {
          return interaction.editReply({
            content:
              "❌ Không tìm thấy sản phẩm"
          });
        }

        const price =
          interaction.values[0];

        const option =
          product.prices[price];

        if (!option) {
          return interaction.editReply({
            content:
              "❌ Không tìm thấy gói"
          });
        }

        const balances =
          getBalances();

        if (
          !balances[
            interaction.user.id
          ]
        ) {
          balances[
            interaction.user.id
          ] = 0;
        }

        if (
          balances[
            interaction.user.id
          ] < Number(price)
        ) {

          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle(
                  "❌ Số dư không đủ"
                )
                .setDescription(`
🧧 Số dư:
${balances[
  interaction.user.id
].toLocaleString()}₫
`)
            ]
          });
        }

        balances[
          interaction.user.id
        ] -= Number(price);

        saveBalances(balances);

        stock[productKey].sold++;
        stock[productKey].remain--;

        await updateShopEmbed();

        const member =
          await interaction.guild.members.fetch(
            interaction.user.id
          );

        const role =
          interaction.guild.roles.cache.get(
            option.role
          );

        if (role) {
          await member.roles.add(role);
        }

        const productChannel =
          interaction.guild.channels.cache.get(
            option.channel
          );

        const orderCode =
          `${interaction.user.id}-${Date.now()}`;

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
                value:
                  `${interaction.user.tag}`
              },

              {
                name: "🧾 Mã Đơn",
                value:
                  `\`${orderCode}\``
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
                value:
                  `${Number(
                    price
                  ).toLocaleString()}₫`
              },

              {
                name: "📂 Kênh",
                value:
                  `${productChannel || "Không có"}`
              }
            )
            .setImage(IMAGE);

        try {

          await interaction.user.send({
            embeds: [successEmbed]
          });

        } catch {
          console.log(
            "USER CLOSED DM"
          );
        }

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

        } catch {}

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#00ff88")
              .setDescription(`
✅ Đã mua thành công **${product.name}**

📩 Kiểm tra DM để nhận sản phẩm.
`)
          ]
        });
      }

      // BALANCE
      if (
        interaction.isButton() &&
        interaction.customId ===
          "balance"
      ) {

        const balances =
          getBalances();

        const money =
          balances[
            interaction.user.id
          ] || 0;

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#00d4ff")
              .setTitle(
                "💰 SỐ DƯ"
              )
              .setDescription(`
👤 ${interaction.user}

## ${money.toLocaleString()}₫
`)
          ],
          ephemeral: true
        });
      }

      // NAP
      if (
        interaction.isButton() &&
        interaction.customId === "nap"
      ) {

        const modal =
          new ModalBuilder()
            .setCustomId(
              "nap_modal"
            )
            .setTitle(
              "Nạp Tiền"
            );

        const amount =
          new TextInputBuilder()
            .setCustomId("money")
            .setLabel(
              "Nhập số tiền"
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

      // MODAL NAP
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
          !amount ||
          isNaN(amount) ||
          Number(amount) <= 0
        ) {

          return interaction.reply({
            content:
              "❌ Số tiền không hợp lệ",
            ephemeral: true
          });
        }

        const money =
          Number(amount);

        const qr =
          `https://img.vietqr.io/image/vietinbank-${STK}-compact2.png?amount=${money}&addInfo=${interaction.user.id}`;

        const qrEmbed =
          new EmbedBuilder()
            .setColor("#00d4ff")
            .setTitle(
              "💳 THANH TOÁN QR"
            )
            .setDescription(`
🏦 ${BANK}
💳 ${STK}

💰 ${money.toLocaleString()}₫

📝 Nội dung:
\`${interaction.user.id}\`
`)
            .setImage(qr);

        await interaction.reply({
          embeds: [qrEmbed],
          ephemeral: true
        });

        const adminEmbed =
          new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("📥 ĐƠN NẠP")
            .addFields(
              {
                name: "👤 User",
                value:
                  `${interaction.user.tag}`
              },

              {
                name: "💰 Tiền",
                value:
                  `${money.toLocaleString()}₫`
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
                  `accept_${interaction.user.id}_${money}`
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

      // ACCEPT
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

        const userId =
          data[1];

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

        embed.spliceFields(
          2,
          1,
          {
            name: "📌 Trạng Thái",
            value:
              "✅ Đã duyệt"
          }
        );

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
                  "✅ NẠP THÀNH CÔNG"
                )
                .setDescription(`
💰 +${amount.toLocaleString()}₫
`)
            ]
          });

        } catch {}
      }

      // DENY
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

        embed.spliceFields(
          2,
          1,
          {
            name: "📌 Trạng Thái",
            value:
              "❌ Đã từ chối"
          }
        );

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
          !interaction.replied &&
          !interaction.deferred
        ) {

          await interaction.reply({
            content:
              "❌ Đã xảy ra lỗi",
            ephemeral: true
          });

        } else {

          await interaction.editReply({
            content:
              "❌ Đã xảy ra lỗi"
          });
        }

      } catch {}
    }
  }
);

client.login(process.env.TOKEN);
