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
  "https://cdn.discordapp.com/attachments/1488240958712709291/1500895021161910435/IMG_0491.gif";

const IMAGE =
  "https://cdn.discordapp.com/attachments/1488240958712709291/1500397539742978099/IMG_4659.gif";

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

  // FILZA
  filza: {
    name: "Filza iOS",

    prices: {

      "50000": {
        label: "1 OB",

        // FILZA 1OB
        role: "1502261658351833210",

        channel:
          "1502262765568528527"
      },

      "150000": {
        label: "Vĩnh Viễn",

        // FILZA VV
        role: "1502261775922368552",

        channel:
          "1502262825308131471"
      }
    }
  },

  // IMAZING
  imazing: {
    name: "iMazing",

    prices: {

      "70000": {
        label: "1 OB",

        // IMAZING 1OB
        role: "1502285054314024990",

        channel:
          "1502280881082208447"
      },

      "150000": {
        label: "Vĩnh Viễn",

        // IMAZING VV
        role: "1502285135964537024",

        channel:
          "1502280903739572415"
      }
    }
  },

  // ADR
  adr: {
    name: "File ADR",

    prices: {

      "100000": {
        label: "1 OB",

        // ADR 1OB
        role: "1502285208097915001",

        channel:
          "1502267573465513994"
      },

      "250000": {
        label: "Vĩnh Viễn",

        // ADR VV
        role: "1502285273990697070",

        channel:
          "1502267673428496424"
      }
    }
  }
};

let shopMessage;

async function sendShopEmbed() {

  const channel =
    await client.channels.fetch(
      SHOP_CHANNEL
    );

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
      .setThumbnail(
        THUMBNAIL
      )
      .setImage(IMAGE)
      .setFooter({
        text:
          "NQK SHOP PREMIUM"
      });

  const row =
    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId("buy")
          .setLabel("🛒 Mua")
          .setStyle(
            ButtonStyle.Success
          ),

        new ButtonBuilder()
          .setCustomId("nap")
          .setLabel("💳 Nạp")
          .setStyle(
            ButtonStyle.Primary
          ),

        new ButtonBuilder()
          .setCustomId(
            "balance"
          )
          .setLabel(
            "🧧 Số Dư"
          )
          .setStyle(
            ButtonStyle.Secondary
          )
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
}

async function updateShopEmbed() {

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
}

client.once(
  "ready",
  async () => {

    console.log(
      `${client.user.tag} Online`
    );

    await sendShopEmbed();
  }
);

client.on(
  Events.InteractionCreate,
  async interaction => {

    try {

      // BUY
      if (
        interaction.isButton() &&
        interaction.customId ===
          "buy"
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
                label:
                  "Filza iOS",

                value:
                  "filza",

                emoji: "🔥"
              },

              {
                label:
                  "iMazing",

                value:
                  "imazing",

                emoji: "💎"
              },

              {
                label:
                  "File ADR",

                value:
                  "adr",

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

        if (!product) {
          return interaction.editReply({
            content:
              "❌ Không tìm thấy sản phẩm"
          });
        }

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
`${Number(price).toLocaleString()}₫ | ${data.label}`,

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

        // FIX ROLE BUG
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
              "❌ Không tìm thấy gói"
          });
        }

        console.log(
          "PRODUCT:",
          productKey
        );

        console.log(
          "ROLE:",
          option.role
        );

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

        // CHECK MONEY
        if (
          balances[
            interaction.user.id
          ] < Number(price)
        ) {

          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(
                  "Red"
                )
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

        // REMOVE MONEY
        balances[
          interaction.user.id
        ] -= Number(price);

        saveBalances(
          balances
        );

        // STOCK
        stock[productKey].sold++;
        stock[productKey].remain--;

        await updateShopEmbed();

        // MEMBER
        const member =
          await interaction.guild.members.fetch(
            interaction.user.id
          );

        // ADD ROLE
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

        // CHANNEL
        const productChannel =
          interaction.guild.channels.cache.get(
            option.channel
          );

        // ORDER
        const orderCode =
`${interaction.user.id}-${Date.now()}`;

        const successEmbed =
          new EmbedBuilder()
            .setColor(
              "#00ff88"
            )
            .setTitle(
              "🌐 Mua File Thành Công"
            )
            .setThumbnail(
              interaction.user.displayAvatarURL()
            )
            .addFields(

              {
                name:
                  "👤 Người Mua",

                value:
`${interaction.user.tag} (${interaction.user.id})`
              },

              {
                name:
                  "🧾 Mã Đơn",

                value:
`\`${orderCode}\``
              },

              {
                name:
                  "📦 Sản phẩm",

                value:
                  product.name
              },

              {
                name:
                  "💎 Gói",

                value:
                  option.label
              },

              {
                name:
                  "💰 Giá",

                value:
`${Number(price).toLocaleString()}₫`
              },

              {
                name:
                  "🕒 Thời Gian",

                value:
`<t:${Math.floor(
  Date.now() / 1000
)}:F>`
              },

              {
                name:
                  "📂 Kênh Sản Phẩm",

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
            embeds: [
              successEmbed
            ]
          });

        } catch {

          console.log(
            "KHÔNG THỂ DM USER"
          );
        }

        // LOG
        try {

          const logChannel =
            await client.channels.fetch(
              LOG_CHANNEL
            );

          await logChannel.send({
            embeds: [
              successEmbed
            ]
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
              .setColor(
                "#00ff88"
              )
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
              .setColor(
                "#00d4ff"
              )
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

      // NAP
      if (
        interaction.isButton() &&
        interaction.customId ===
          "nap"
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
            .setCustomId(
              "money"
            )
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
              "❌ Đã xảy ra lỗi."
          });

        } else {

          await interaction.reply({
            content:
              "❌ Đã xảy ra lỗi.",
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

client.login(
  process.env.TOKEN
);
