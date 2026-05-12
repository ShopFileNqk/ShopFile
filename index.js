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

  const channel = await client.channels.fetch(
    SHOP_CHANNEL
  );

  const embed = new EmbedBuilder()
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

async function updateShopEmbed() {

  if (!shopMessage) return;

  const embed = EmbedBuilder.from(
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
}

client.once("ready", async () => {

  console.log(`${client.user.tag} Online`);

  try {
    await sendShopEmbed();
  } catch (err) {
    console.log("SEND EMBED ERROR:", err);
  }
});

client.on(
  Events.InteractionCreate,
  async interaction => {

    try {

      // BUY BUTTON
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

      // SELECT PRODUCT
      if (
        interaction.isStringSelectMenu() &&
        interaction.customId === "select_product"
      ) {

        await interaction.deferUpdate();

        const productKey =
          interaction.values[0];

        const product =
          products[productKey];

        if (!product) {
          return interaction.editReply({
            content:
              "❌ Không tìm thấy sản phẩm",
            components: []
          });
        }

        const menu =
          new StringSelectMenuBuilder()
            .setCustomId(
              `price_${productKey}`
            )
            .setPlaceholder("📌 Chọn gói")
            .addOptions(
              Object.entries(
                product.prices
              ).map(
                ([price, data]) => ({
                  label: `${Number(price).toLocaleString()}₫ | ${data.label}`,
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
              "❌ Sản phẩm không tồn tại"
          });
        }

        const price =
          interaction.values[0];

        const option =
          product.prices[price];

        if (!option) {
          return interaction.editReply({
            content:
              "❌ Không tìm thấy gói sản phẩm"
          });
        }

        const balances =
          getBalances();

        if (
          !balances[interaction.user.id]
        ) {
          balances[interaction.user.id] = 0;
        }

        if (
          balances[interaction.user.id] <
          Number(price)
        ) {

          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setTitle(
                  "❌ Số dư hiện tại không đủ !"
                )
                .setDescription(`
Bạn không đủ tiền để mua sản phẩm.

🧧 Số dư của bạn:
${balances[
  interaction.user.id
].toLocaleString()}₫
`)
            ]
          });
        }

        balances[interaction.user.id] -=
          Number(price);

        saveBalances(balances);

        stock[productKey].sold++;
        stock[productKey].remain--;

        try {
          await updateShopEmbed();
        } catch (err) {
          console.log(
            "UPDATE SHOP ERROR:",
            err
          );
        }

        // MEMBER
        const member =
          await interaction.guild.members.fetch(
            interaction.user.id
          );

        // ROLE
        try {
          await member.roles.add(
            option.role
          );
        } catch (err) {
          console.log(
            "ROLE ERROR:",
            err
          );
        }

        // CHANNEL
        const productChannel =
          interaction.guild.channels.cache.get(
            option.channel
          );

        const orderCode = `${interaction.user.id}-${Date.now()}`;

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
                value: `${interaction.user.tag} (${interaction.user.id})`
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
                value: `${Number(
                  price
                ).toLocaleString()}₫`
              },

              {
                name: "🕒 Thời Gian",
                value: `<t:${Math.floor(
                  Date.now() / 1000
                )}:F>`
              },

              {
                name: "📂 Kênh Sản Phẩm",
                value:
                  productChannel
                    ? `${productChannel}`
                    : "Không tìm thấy kênh"
              }
            )
            .setImage(IMAGE)
            .setFooter({
              text:
                "Cảm ơn bạn đã mua hàng ❤️"
            });

        // DM
        try {
          await interaction.user.send({
            embeds: [successEmbed]
          });
        } catch (err) {
          console.log(
            `DM ERROR ${interaction.user.tag}`
          );
        }

        // LOG
        try {

          const logChannel =
            await client.channels.fetch(
              LOG_CHANNEL
            );

          await logChannel.send({
            embeds: [successEmbed]
          });

        } catch (err) {
          console.log(
            "LOG ERROR:",
            err
          );
        }

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

💵 Số dư hiện tại:
## ${money.toLocaleString()}₫
`)
          ],
          ephemeral: true
        });
      }

      // NAP BUTTON
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
          `https://img.vietqr.io/image/vietinbank-${STK}-compact2.png?amount=${amount}&addInfo=${interaction.user.id}`;

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

⏳ Đơn tự huỷ sau 5 phút
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

        const adminEmbed =
          new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("📥 ĐƠN NẠP")
            .addFields(
              {
                name: "👤 Người Nạp",
                value: `${interaction.user}`
              },

              {
                name: "💰 Số Tiền",
                value: `${Number(
                  amount
                ).toLocaleString()}₫`
              },

              {
                name: "🕒 Thời Gian",
                value: `<t:${Math.floor(
                  Date.now() / 1000
                )}:F>`
              },

              {
                name: "📌 Trạng Thái",
                value:
                  "⏳ Chờ duyệt"
              }
            )
            .setThumbnail(
              interaction.user.displayAvatarURL()
            );

        const row =
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(
                  `accept_${interaction.user.id}_${amount}`
                )
                .setLabel(
                  "✅ Duyệt"
                )
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

        await logChannel.send({
          embeds: [adminEmbed],
          components: [row]
        });
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

        embed.spliceFields(3, 1, {
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
                .setColor(
                  "#00ff88"
                )
                .setTitle(
                  "✅ NẠP TIỀN THÀNH CÔNG"
                )
                .setDescription(`
💰 Bạn đã được cộng:

## ${amount.toLocaleString()}₫
`)
            ]
          });

        } catch (err) {
          console.log(
            "SEND USER ERROR:",
            err
          );
        }
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

        embed.spliceFields(3, 1, {
          name: "📌 Trạng Thái",
          value: "❌ Đã từ chối"
        });

        await interaction.update({
          embeds: [embed],
          components: []
        });
      }

    } catch (err) {

      console.log("INTERACTION ERROR:");
      console.log(err);

      try {

        if (
          interaction.deferred ||
          interaction.replied
        ) {

          await interaction.editReply({
            content:
              "❌ Đã xảy ra lỗi khi xử lý."
          });

        } else {

          await interaction.reply({
            content:
              "❌ Đã xảy ra lỗi khi xử lý.",
            ephemeral: true
          });

        }

      } catch {}
    }
  }
);

// ANTI CRASH
process.on(
  "unhandledRejection",
  err => {
    console.log(
      "UNHANDLED REJECTION:",
      err
    );
  }
);

process.on(
  "uncaughtException",
  err => {
    console.log(
      "UNCAUGHT EXCEPTION:",
      err
    );
  }
);

client.login(process.env.TOKEN);
