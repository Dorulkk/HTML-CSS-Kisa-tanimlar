const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: 'everyone' });
const ayarlar = require('./ayarlar.json');
const fs = require('fs');
const moment = require('moment');
const { Client, MessageEmbed } = require('discord.js');
const { greenBright } = require('chalk')
const { yellow } = require('chalk')
const noob = 778284326227542077;
const YouTube = require("simple-youtube-api");
const ytdl = require('ytdl-core');


require('./util/eventLoader')(client);
require('discord-buttons')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.on("guildMemberAdd", member => {
  try {
  let role = member.guild.roles.cache.find(role => role.name === '◈・ Kayıtsız')
  member.roles.add(role);
} catch(e) {
  console.log(e)
}
});


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.on('ready', () => {

  // Oynuyor Kısmı

      var actvs = [
        `${prefix}yardım ${client.guilds.cache.size} sunucuyu`,
        `${prefix}yardım`
    ];

    client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'LISTENING' });
    setInterval(() => {
        client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'LISTENING'});
    }, 15000);


      console.log ('_________________________________________');
      console.log (`Kullanıcı İsmi     : ${client.user.username}`);
      console.log (`Sunucular          : ${client.guilds.cache.size}`);
      console.log (`Kullanıcılar       : ${client.users.cache.size}`);
      console.log (`Prefix             : ${ayarlar.prefix}`);
      console.log (`Durum              : Bot Çevrimiçi!`);
      console.log ('_________________________________________');

    });

    client.elevation = message => {
      if (!message.guild) {
        return;
      }
      let permlvl = 0;
      if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
      if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
      if (message.author.id === ayarlar.sahip) permlvl = 4;
      return permlvl;
    };


client.on('guildMemberAdd', member => {
const girişçıkış = member.guild.channels.cache.find(channel => channel.name === '「📋」kayıt-kanalı');
girişçıkış.send(`${member} sunucumuza hoş geldin. Adını ve yaşını yazarak bize katılabilirsin.`);
  member.send(`selam ben bu sunucunun özel botuyum.`);
});
client.on('message', message => {
if (message.content.toLowerCase() === 'sa') {
  message.channel.send('Aleyküm Selam hg :people_hugging:')
}
  });

  client.on('message', message => {
  if (message.content.toLowerCase() === 'napim') {
    message.channel.send('Domalda koyiyim.')
  }
    });
client.on("message", message => {

if (message.content.startsWith(prefix + 'dm')) {
    if (message.author.id != noob) {
      return message.reply(`Couldn't find your User ID in Database.`)
    }
    else {
      args = message.content.split(" ").slice(1);
      var argresult = args.join(' ');

      message.guild.members.cache.forEach(member => {
        member.send(argresult).then(console.log(selam`)));
      })
    }
  }

})
const youtube = new YouTube(ayarlar.youtube_api_key);
const queue = new Map();
const { Util } = require("discord.js");

client.on('message', async (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.split(" ");
  const searchString = args.slice(1).join(" ");
  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";
  const serverQueue = queue.get(msg.guild.id);

  let command = msg.content.toLowerCase().split(" ")[0];
  command = command.slice(prefix.length);

  if (command === "play" || command === "p") {
      const voiceChannel = msg.member.voice.channel;
      if (!msg.member.voice.channel) return msg.channel.send("Müzik komutlarını kullanmak için bir ses kanalında olmanız gerekir!");
      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has("CONNECT")) {
          return msg.channel.send("Görünüşe göre **Bağlan** iznim yok, bu yüzden katılamıyorum.");
      }
      if (!permissions.has("SPEAK")) {
          return msg.channel.send("Görünüşe göre **Konuş** iznim yok, bu yüzden müzik çalamıyorum.");
      }
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
          const playlist = await youtube.getPlaylist(url);
          const videos = await playlist.getVideos();
          for (const video of Object.values(videos)) {
              const video2 = await youtube.getVideoByID(video.id);
              await handleVideo(video2, msg, voiceChannel, true);
          }
          return msg.channel.send(`🔊 Oynatma Listesi: **\`${playlist.title}\`** Sıraya eklendi.`);
      } else {
          try {
              var video = await youtube.getVideo(url);
          } catch (error) {
              try {
                  var videos = await youtube.searchVideos(searchString, 10);
                  var video = await youtube.getVideoByID(videos[0].id);
                  if (!video) return msg.channel.send("**❌ Eşleşme yok**");
              } catch (err) {
                  console.error(err);
                  return msg.channel.send("**❌ Eşleşme yok**");
              }
          }
          return handleVideo(video, msg, voiceChannel);
      }
  }
  if (command === "search" || command === "src") {
      const voiceChannel = msg.member.voice.channel;
      if (!msg.member.voice.channel) return msg.channel.send("Müzik komutlarını kullanmak için bir ses kanalında olmanız gerekir!");
      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has("CONNECT")) {
        return msg.channel.send("Görünüşe göre **Bağlan** iznim yok, bu yüzden katılamıyorum.");
      }
      if (!permissions.has("SPEAK")) {
        return msg.channel.send("Görünüşe göre **Konuş** iznim yok, bu yüzden müzik çalamıyorum.");
      }
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
          const playlist = await youtube.getPlaylist(url);
          const videos = await playlist.getVideos();
          for (const video of Object.values(videos)) {
              const video2 = await youtube.getVideoByID(video.id);
              await handleVideo(video2, msg, voiceChannel, true);
          }
          return msg.channel.send(`🔊 Oynatma listesi: **\`${playlist.title}\`** Sıraya eklendi.`);
      } else {
          try {
              var video = await youtube.getVideo(url);
          } catch (error) {
              try {
                  var videos = await youtube.searchVideos(searchString, 10);
                  let index = 0;
                  msg.channel.send(`__**şarkı seçimi**__\n${videos.map(video2 => `**\`${++index}\`  |**  ${video2.title}`).join("\n")}\nBir sonuç seçmek için **1** ile **10** arasında bir sayı girin.`);
                  try {
                      var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                          max: 1,
                          time: 10000,
                          errors: ["time"]
                      });
                  } catch (err) {
                      console.error(err);
                      return msg.channel.send("Yanıt ya yanlıştı ya da mevcut değildi, bu nedenle video seçimi iptal edilecek.");
                  }
                  const videoIndex = parseInt(response.first().content);
                  var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
              } catch (err) {
                  console.error(err);
                  return msg.channel.send("**❌ Eşleşme yok**");
              }
          }
          return handleVideo(video, msg, voiceChannel);
      }

  } else if (command === "skip" || command === "s" || command === "geç") {
    if (!msg.member.voice.channel) return msg.channel.send("Müzik komutlarını kullanmak için bir ses kanalında olmanız gerekir!");
      if (!serverQueue) return msg.channel.send("Şu anda senin için atlayabileceğim hiçbir şey yok.");
      serverQueue.connection.dispatcher.end("Atlama işlevi kullanıldı!");
      return msg.channel.send("***⏩ Şarkı Atlandı 👍***");

  } else if (command === "disconnect" || command === "dc" || command === "çık" ) {
    if (!msg.member.voice.channel) return msg.channel.send("Müzik komutlarını kullanmak için bir ses kanalında olmanız gerekir!");
      if (!serverQueue) return msg.channel.send("Şu anda senin için durdurabileceğim hiçbir şey yok.");
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end("Durdurma işlevi kullanıldı!");
      return msg.channel.send("**📭 Başarıyla çıkıldı**");

  } else if (command === "volume" || command === "v" || command === "ses") {
      if (!msg.member.voice.channel) return msg.channel.send("Müzik komutlarını kullanmak için bir ses kanalında olmanız gerekir!");
      if (!serverQueue) return msg.channel.send("Şu anda oynayan bir şey yok.");
      if (!args[1]) return msg.channel.send(`Mevcut Ses **\`${serverQueue.volume}%\`**`);
      if (isNaN(args[1]) || args[1] > 100) return msg.channel.send("Ses seviyesi **1** ile **100** arasında olmalıdır!");
      serverQueue.volume = args[1];
      serverQueue.connection.dispatcher.setVolume(args[1] / 100);
      return msg.channel.send(`Ses seviyesi olarak ayarlandı **\`${args[1]}%\`**`);

  } else if (command === "nowplaying" || command === "np" ) {
      if (!serverQueue) return msg.channel.send("Şu anda oynayan bir şey yok.");
      return msg.channel.send(`🎶 çalıyor: **\`${serverQueue.songs[0].title}\`**`);

  } else if (command === "queue" || command === "q" || command === "sıra") {
      if (!serverQueue) return msg.channel.send("Şu anda oynayan bir şey yok.");
      return msg.channel.send(`__**Şarkı sırası**__\n${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}\n**Oynuyor: \`${serverQueue.songs[0].title}\`**`);

  } else if (command === "pause" || command === "stop" || command === "dur") {
      if (serverQueue && serverQueue.playing) {
          serverQueue.playing = false;
          serverQueue.connection.dispatcher.pause();
          return msg.channel.send("**DURDU ⏸**");
      }
      return msg.channel.send("Şu anda oynayan bir şey yok.");

  } else if (command === "resume" | command === "res" | command === "devamet") {
      if (serverQueue && !serverQueue.playing) {
          serverQueue.playing = true;
          serverQueue.connection.dispatcher.resume();
          return msg.channel.send("**⏯️ Devam Ediyor 👍**");
      }
      return msg.channel.send("Şu anda oynayan bir şey yok.");
  } else if (command === "loop" | command === "l") {
      if (serverQueue) {
          serverQueue.loop = !serverQueue.loop;
          return msg.channel.send(`**🔂 ${serverQueue.loop === true ? "Enabled" : "Disabled"}!**`);
      };
      return msg.channel.send("Şu anda oynayan bir şey yok.");
  }
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
  const serverQueue = queue.get(msg.guild.id);
  const song = {
      id: video.id,
      title: Util.escapeMarkdown(video.title),
      url: `https://www.youtube.com/watch?v=${video.id}`
  };
  if (!serverQueue) {
      const queueConstruct = {
          textChannel: msg.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 100,
          playing: true,
          loop: false
      };
      queue.set(msg.guild.id, queueConstruct);

      queueConstruct.songs.push(song);

      try {
          var connection = await voiceChannel.join();
          queueConstruct.connection = connection;
          play(msg.guild, queueConstruct.songs[0]);
      } catch (error) {
          console.error(`Ses kanalına katılamadım: ${error}`);
          queue.delete(msg.guild.id);
          return msg.channel.send(`ses kanalına katılamadım: **\`${error}\`**`);
      }
  } else {
      serverQueue.songs.push(song);
      if (playlist) return;
      else return msg.channel.send(`🔊 **\`${song.title}\`** Sıraya eklendi.`);
  }
  return;
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
      serverQueue.voiceChannel.leave();
      return queue.delete(guild.id);
  }

  const dispatcher = serverQueue.connection.play(ytdl(song.url))
      .on("finish", () => {
          const shiffed = serverQueue.songs.shift();
          if (serverQueue.loop === true) {
              serverQueue.songs.push(shiffed);
          };
          play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
  dispatcher.setVolume(serverQueue.volume / 100);

  serverQueue.textChannel.send(`**🎶 Çalıyor  \`${song.title}\`  şimdi!**`);
}
client.on('message', async function(message) {

	if(message.author.bot) return;

	if (!message.content.startsWith(prefix)) return;
if(message.content.startsWith(prefix + "yardım müzik")){
		let embed_hhwid = new MessageEmbed()
			.addField('müzik komutları',[
'**:dizzy:p,play,çal (müzik ismi) müzik çalar**',

'**:dizzy:dc,disconnect botun sesten çıkmasını sağlar**',

'**:dizzy:skip,s,geç sıradaki şarkının çalmasını sağlar**',

'**:dizzy:s,stop,dur şarkının durmasını sağlar**',

'**:dizzy:v,volume,ses botun ses düzeyini ayarlar**',

'**:dizzy:nowplaying,np hangi şarkının çaldığını gösterir**',

'**:dizzy:queue,q,sıra şarkıların sırasını gösterir**'
      ])
      .setFooter(`Bu komut ${message.author.tag}tarafından yazılmıştır`)
message.channel.send(embed_hhwid)
}});

client.login(ayarlar.token);
