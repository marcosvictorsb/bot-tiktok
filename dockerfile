
# Usa a imagem oficial do Node.js
FROM node:18

# Instala o FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Cria o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o código da aplicação para o container
COPY . .

# Expõe a porta 3000 (caso queira usar em um servidor no futuro)
EXPOSE 3000

# Comando para rodar o script
# CMD ["node", "bot.js"]
