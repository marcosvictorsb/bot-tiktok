
const fs = require('fs');
const path = require('path');

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function textToSpeech(text) {
  const gtts = require('node-gtts')('pt');

  // Caminho da imagem no diretório "img"
  const audioPath = path.join('audio', 'audio.mp3');

  // Garante que o diretório "img" existe
  ensureDirExists('audio');

   // Verifica se o texto é uma string válida
   if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Texto inválido para conversão em áudio.');
  }

  return new Promise((resolve, reject) => {
    gtts.save(audioPath, text, () => {
      resolve(audioPath);
    });
  });
}


module.exports = {textToSpeech }