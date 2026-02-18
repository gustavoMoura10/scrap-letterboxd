# Letterboxd Scraper to Plex Pipeline 🎬

Este projeto é uma aplicação robusta desenvolvida em **NestJS** que automatiza o ciclo de vida de descoberta e organização de mídia. O sistema realiza o scraping inteligente de listas de filmes no Letterboxd e prepara o caminho para o download via Ok.ru e integração direta com um servidor Plex rodando em um Raspberry Pi.

## 🚀 Fluxo de Operação

1.  **Descoberta (Scraping):** A aplicação recebe filtros de `país` e `ano`. Utilizando **Axios** e **Cheerio**, ela acessa os endpoints de AJAX do Letterboxd para extrair metadados (Título, Link, Idiomas e Gêneros) de forma performática.
2.  **Assincronismo (RabbitMQ):** Como o scraping detalhado (filme por filme) é uma tarefa demorada, a requisição é delegada para uma fila no **RabbitMQ**. O usuário recebe um `jobId` imediato para acompanhar o progresso.
3.  **Busca e Download (Ok.ru):** Com a lista de metadados consolidada, o sistema permite a busca automatizada por fontes de mídia no **Ok.ru**.
4.  **Distribuição (Plex + Raspberry Pi):** Os arquivos baixados são enviados para o endpoint do **Raspberry Pi** na rede local, sendo armazenados diretamente na biblioteca monitorada pelo **Plex Media Server**.

## 🛠 Tecnologias Utilizadas

-   **Framework:** [NestJS](https://nestjs.com/)
-   **Scraping:** Axios + Cheerio (Consumo de API interna do Letterboxd)
-   **Mensageria:** [RabbitMQ](https://www.rabbitmq.com/) (Gerenciamento de filas assíncronas)
-   **Containerização:** [Docker](https://www.docker.com/) & Docker Compose
-   **Processamento de Dados:** Node.js Streams e Workers
-   **Infraestrutura Local:** Raspberry Pi + Plex Media Server

## 📦 Estrutura de Arquivos de Configuração

O projeto já inclui:
-   `Dockerfile`: Otimizado para Node.js em ambiente Linux.
-   `docker-compose.yml`: Sobe a API NestJS e o broker RabbitMQ (com painel de gerenciamento) em uma rede isolada.

## ⚙️ Instalação e Execução

### Pré-requisitos
-   Docker e Docker Compose instalados.
-   Instalador via Chocolatey (Windows): `choco install docker-desktop`

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/scrap-letterboxd.git
    cd scrap-letterboxd
    ```

2.  **Inicie os serviços:**
    ```bash
    docker-compose up --build
    ```

3.  **Acesse a aplicação:**
    -   API: `http://localhost:3000`
    -   RabbitMQ Admin: `http://localhost:15672` (guest/guest)

## 📍 Endpoints Principais

### 1. Iniciar Coleta
Envia um comando para a fila processar filmes de um determinado critério.
-   **Método:** `GET`
-   **Rota:** `/scraper/letterboxd`
-   **Params:** `?country=brazil&year=2023`
-   **Retorno:** `{ "jobId": "uuid-aqui", "message": "Processando..." }`

### 2. Consultar Status/Resultados
Endpoint de *polling* para obter os dados coletados.
-   **Método:** `GET`
-   **Rota:** `/scraper/status/:jobId`

## 📡 Integração Raspberry Pi

O pipeline final está configurado para apontar para o IP local do Raspberry Pi. Certifique-se de que as permissões de escrita no diretório do Plex estejam configuradas corretamente no seu endpoint SMB/NFS ou via serviço de transferência de arquivos.

## ⚠️ Aviso Legal (Disclaimer)

Este projeto foi desenvolvido para fins estritamente educacionais e de automação doméstica. O usuário é responsável por garantir que o uso do scraper respeite os termos de serviço do Letterboxd e que os downloads realizados estejam em conformidade com as leis de direitos autorais locais.

---
Desenvolvido por Gustavo Moura