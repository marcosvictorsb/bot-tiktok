
const fs = require('fs');
const Whammy = require('whammy');
const { createCanvas, loadImage } = require('canvas');
const ffmpeg = require('fluent-ffmpeg');

function createVideo(imagePaths, audioPath) {
  const outputPath = 'video_final.mp4';


  // Verifica se o áudio existe
  if (!fs.existsSync(audioPath)) {
    console.error('Arquivo de áudio não encontrado:', audioPath);
    return;
  }

  // Configura o comando ffmpeg
  const ffmpegCommand = ffmpeg();

  // Adiciona todas as imagens ao comando
  imagePaths.forEach((imagePath, index) => {
    if (!fs.existsSync(imagePath)) {
      console.error('Imagem não encontrada:', imagePath);
      return;
    }
    console.log(`Adicionado a imagem: ${imagePath}`);
    ffmpegCommand.addInput(imagePath);
  });

  // Adiciona o áudio
  ffmpegCommand.addInput(audioPath)
    .outputOptions('-c:v', 'libx264', '-c:a', 'aac', '-strict', 'experimental')
    .outputOptions('-pix_fmt', 'yuv420p') // Para compatibilidade com players
    .outputOptions('-framerate', '1') // Define a taxa de quadros (1 frame por segundo)
    .on('end', () => {
      console.log('Vídeo criado:', outputPath);
    })
    .on('error', (err) => {
      console.error('Erro ao criar vídeo:', err);
    })
    .save(outputPath); // Salva o vídeo no caminho especificado
}

const createVideoFFmpeg = async (imagePaths, audioPath) => {
  // Importa o módulo de forma dinâmica
  const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');

  // Cria uma instância do FFmpeg
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  
  // Adiciona imagens ao ffmpeg
  for (let i = 0; i < imagePaths.length; i++) {
    ffmpeg.FS('writeFile', `image${i}.jpg`, await fetchFile(imagePaths[i]));
  }
  
  // Adiciona o arquivo de áudio
  ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioPath));
  
  // Cria o vídeo a partir das imagens
  await ffmpeg.run('-framerate', '1', '-i', 'image%d.jpg', '-i', 'audio.mp3', '-c:v', 'libx264', '-c:a', 'aac', 'output.mp4');
  
  // Recupera o vídeo gerado
  const data = ffmpeg.FS('readFile', 'output.mp4');
  
  // Cria um Blob para download
  const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  const url = URL.createObjectURL(videoBlob);
  
  // Baixar o vídeo
  const a = document.createElement('a');
  a.href = url;
  a.download = 'output.mp4';
  document.body.appendChild(a);
  a.click();
  a.remove();
}


const createVideoWhammy = async (imagePaths, durationPerImage = 1000) => {
  const video = new Whammy.Video();

  for (const imagePath of imagePaths) {
    try {
      console.log(`Processando imagem: ${imagePath}`);

      // Carrega a imagem usando node-canvas
      const img = await loadImage(imagePath);
      console.log(`Imagem carregada com sucesso: ${imagePath}`);

      // Cria um canvas e desenha a imagem
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');

      // Desenha a imagem no canvas
      ctx.drawImage(img, 0, 0);

      // Adiciona o frame ao vídeo a partir do canvas
      video.add(ctx.getImageData(0, 0, img.width, img.height), durationPerImage);
      console.log(`Frame adicionado ao vídeo: ${imagePath}`);

    } catch (error) {
      console.error(`Erro ao processar a imagem ${imagePath}:`, error);
    }
  }

  // Compila e salva o vídeo
  const output = video.compile();
  fs.writeFileSync('output.webm', output);
  console.log('Vídeo criado: output.webm');
};

module.exports = {
  createVideo,
  createVideoFFmpeg,
  createVideoWhammy
}