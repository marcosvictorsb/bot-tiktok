const axios = require('axios');


async function generateText(text) {  
  try {
    const url = 'https://api.textcortex.com/v1/texts/summarizations';
    const options = {    
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gAAAAABm81GtdJjdzhf8HV4jJuglhgzSlOKjYGi8OAGjD3DehQnDYTZ3JiccLp4MAzWw_CUH9fIzwboWkgpisUr4oaSfLaNF_Yk2TJa-kO2QuJcKfRnhLim68W5CF-VQdkcXyWNGqoek'
      }
    }
    const data = {
      formality: 'default',
      max_tokens: 2048,
      mode: 'default',
      model: 'claude-3-haiku',
      n: 1,
      source_lang: 'pt',
      target_lang: 'pt',
      temperature: null,
      text
    }

    const response = await axios.post(url, data, options);
    return response.data.data.outputs[0].text;
  } catch (e) { 
    console.log('------------- ERRO PARA GERAR O TEXTO  --------------')
    console.error(e);
  }
}

async function getIdeiaFromTextGenerated(text) {
  try {
    const url = 'https://api.textcortex.com/v1/texts/summarizations';
    const options = {    
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer gAAAAABm81GtdJjdzhf8HV4jJuglhgzSlOKjYGi8OAGjD3DehQnDYTZ3JiccLp4MAzWw_CUH9fIzwboWkgpisUr4oaSfLaNF_Yk2TJa-kO2QuJcKfRnhLim68W5CF-VQdkcXyWNGqoek'
      }
    }
    const data = {
      formality: 'default',
      max_tokens: 2048,
      mode: 'default',
      model: 'claude-3-haiku',
      n: 1,
      source_lang: 'pt',
      target_lang: 'pt',
      temperature: null,
      text: `retorne as palavras desse texto separado por virgula ---> texto: ${text}`
    }

    const response = await axios.post(url, data, options);
    return response.data.data.outputs[0].text;
  } catch (e) { 
    console.log('------------- ERRO PARA GERAR O TEXTO  --------------')
    console.error(e);
  }
}

module.exports = { generateText, getIdeiaFromTextGenerated };