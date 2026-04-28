const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { title, url } = body;
    
    // Diambil dari Environment Variables Netlify
    const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

   const { title, slug, deviceInfo } = JSON.parse(event.body);

const message = `🕵️ *[wichThink - Intel]* \n\n👤 *Status:* Seseorang mencapai tengah artikel.\n📚 *Judul:* ${title}\n🔗 *Slug:* ${slug}\n📱 *Device:* ${deviceInfo}\n⏰ *Waktu:* ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB`;
    const teleUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    await fetch(teleUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown"
      })
    });

    return { statusCode: 200, body: JSON.stringify({ status: "Success" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
