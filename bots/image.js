

const fs = require('fs');
const axios = require('axios');
const path = require('path');

const transformeMainIdeiaInArray = (mainIdeia) => {
  const array = mainIdeia.split(',').map(item => item.trim());
  return array;
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function fetchImage(list) {
  
  // Transforma a lista em um array de palavras
  const mainIdeia = transformeMainIdeiaInArray(list);

  // API Key da Pexels
  const apiKey = '2zjOBpBI3RNGAtVzk70CMzlcxYYuJ7QDT7vfLBiJ2nB5aSIt8G1arWIP';

  // Garante que o diretório "img" existe
  ensureDirExists('./img');

  // Array para armazenar os caminhos das imagens salvas
  const savedImages = [];

  // Itera sobre o array de palavras (mainIdeia)
  for (let i = 0; i < mainIdeia.length; i++) {
    const query = mainIdeia[i].trim(); // Palavra atual para a consulta

    try {
      // Faz a requisição para a API da Pexels usando a palavra da lista como consulta
      console.log(`Buscando a imagem : ${query}`);
      const response = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
        headers: { Authorization: apiKey }
      });

      // Verifica se encontrou uma imagem
      if (response.data.photos && response.data.photos.length > 0) {
        const imageUrl = response.data.photos[0].src.medium;
        
        // Caminho para salvar a imagem com nome sequencial (por exemplo, imagem1.jpg, imagem2.jpg, etc.)
        const imagePath = path.join('./img', `imagem${i + 1}.png`);

        // Baixa a imagem e salva no caminho
        const imageResponse = await axios({
          url: imageUrl,
          responseType: 'stream',
        });

        // Cria um stream de gravação
        const writer = fs.createWriteStream(imagePath);
        imageResponse.data.pipe(writer);

        // Espera o fim do stream
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(`Imagem salva: ${imagePath}`);
        savedImages.push(imagePath); // Adiciona o caminho da imagem salva no array
      } else {
        console.log(`Nenhuma imagem encontrada para: ${query}`);
      }

    } catch (error) {
      console.error(`Erro ao buscar imagem para "${query}":`, error.message);
    }
  }

  // Retorna o array com os caminhos das imagens salvas
  return savedImages;
}


module.exports = {
  fetchImage
}