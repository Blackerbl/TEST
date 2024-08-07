require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Selfbot için istemci oluşturma
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

// Giriş yapmak için token'ınızı buraya girin
const token = process.env.DISCORD_TOKEN;

// Kontrol edilecek kanalın ID'si
const targetChannelId = process.env.TARGET_CHANNEL_ID;
// Alındı mesajının gönderileceği kanalın ID'si
const notificationChannelId = process.env.NOTIFICATION_CHANNEL_ID;

// Kontrol süresi (ms cinsinden)
const checkInterval = 5000; // 5 saniye

client.on('ready', () => {
    console.log(`Giriş yapıldı: ${client.user.tag}`);
    
    // Sürekli kontrol etme fonksiyonu
    setInterval(async () => {
        const channel = await client.channels.fetch(targetChannelId);
        const messages = await channel.messages.fetch({ limit: 1000 }); // Son 1000 mesajı kontrol et
        
        messages.forEach(async (message) => {
            // Mesajda buton var mı kontrol et
            if (message.components.length > 0) {
                for (const row of message.components) {
                    for (const button of row.components) {
                        if (button.customId === 'claim') {
                            // Butona tıklama işlemi
                            await button.click(); // Bu method Discord.js'te yok, selfbotlar için bir yöntem bulmanız gerekebilir
                            console.log(`Claim butonuna tıklandı: ${message.id}`);

                            // Alındı mesajını gönder
                            const notificationChannel = await client.channels.fetch(notificationChannelId);
                            await notificationChannel.send('Alındı');
                        }
                    }
                }
            }
        });
    }, checkInterval);
});

// Selfbot token'ı ile giriş yap
client.login(token);
