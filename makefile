.PHONY: logs
# Nome dos serviços
API_CONTAINER_NAME = video-bot

# Comando para subir os containers
up:
	docker-compose up -d

# Comando para descer e remover os containers
down:
	docker-compose down

# Comando para construir e subir as imagens
build:
	docker-compose build video-bot

# Comando para criar e iniciar um novo container
create:
	docker-compose up -d --build

# Comando para parar um container
stop:
	docker-compose stop

# Comando para reiniciar um container
restart:
	docker-compose restart

# Comando para exibir logs dos containers
logs:
	docker-compose logs -f

# Comando para acessar o terminal de um container
exec:
	docker exec -it $(API_CONTAINER_NAME) sh

# Comando para remover todas as imagens não utilizadas
prune-images:
	docker image prune -a

# Comando para remover todos os containers parados
prune-containers:
	docker container prune -f

# Comando para remover todos os volumes não utilizados
prune-volumes:
	docker volume prune -f

# Comando para remover todos os dados (containers, imagens, volumes) não utilizados
prune-all:
	docker system prune -a -f --volumes
