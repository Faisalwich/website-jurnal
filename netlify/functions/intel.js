const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const body = JSON.parse(event.body);
    // Kita kasih nilai default "" agar tidak error kalau datanya absen
    const title = body.title || "Judul Tak Terdeteksi";
    const slug = body.slug || "unknown-slug";
    const deviceInfo = body.deviceInfo || "Device Tak Dikenal";
    const url = body.url || "#";

    const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    // Format pesan yang Tuan minta (MoneyWich Style)
    const message = `🕵️ *[wichThink - Intel]* \n\nSeseorang sedang membaca artikel:\n\n*Judul*: ${title}\n*Slug*: ${slug}\n*Waktu*: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB\n*Device*: ${deviceInfo}\n\n🔗 *Link*: ${url}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });

    return { statusCode: 200, body: "OK" };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.toString() };
  }
};
