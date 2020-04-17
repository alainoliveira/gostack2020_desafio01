const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repositorie);

  return response.status(200).json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found!' });
  }

  // OBTEM A QUANTIDADE DE LIKES DO REPOSITORIO PARA QUE NÃO SE PERCA
  const repoAtual = repositories[repoIndex];

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repoAtual.likes,
  }

  repositories[repoIndex] = repositorie;

  return response.status(200).json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found!' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found!' });
  }

  const repositorie = repositories[repoIndex];
  
  repositorie.likes = repositorie.likes + 1;

  repositories[repoIndex] = repositorie;

  return response.status(200).json(repositorie);
});

module.exports = app;
