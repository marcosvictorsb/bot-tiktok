
const readline = require('readline');

const { generateText, getIdeiaFromTextGenerated } = require('./bots/text')
const { fetchImage } = require('./bots/image')
const { textToSpeech } = require('./bots/audio')
const {createVideo,
  createVideoFFmpeg,
  createVideoWhammy} = require('./bots/video')



// Função para criar vídeo com várias imagens e áudio



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// Função principal do robô
async function runBot(userInput) {
  try {
    
    console.log('Gerando curiosidade...');
    const textGenerated = await generateText(userInput);
    console.log(`Texto gerado: ${textGenerated}`);

    const mainIdeia = await getIdeiaFromTextGenerated(textGenerated);
    console.log(`Ideia principal do texto: ${mainIdeia}`);


    console.log('Buscando imagem...');
    const savedImages = await fetchImage(mainIdeia);
    
    console.log('Gerando áudio...');
    const audioPath = await textToSpeech(textGenerated);
    
    console.log('Criando vídeo...');
    createVideo(savedImages, audioPath);
    // await createVideoFFmpeg(savedImages, audioPath)
    // await createVideoWhammy(savedImages);
  } catch (error) {
    console.error('Erro durante o processo:', error);
  }
}

// Pergunta ao usuário qual o tema ou palavra-chave antes de executar o bot
rl.question('Informe um texto: ', (userInput) => {
  runBot(userInput);
  rl.close();

})