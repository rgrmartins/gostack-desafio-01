const express = require("express");

const server = express();
server.use(express.json());

const projects = [
  {
    id: "2",
    title: "Novo Projeto",
    tasks: ["Nova Tarefa"]
  }
];

//Middlewares Global - Contador
server.use((req, res, next) => {
  console.time("Request");

  console.log(`Método ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd("Request");
});

function checkProjectAlreadyExists(req, res, next) {
  const { id } = req.params;
  projects.map(pro => {
    if (pro.id === id) {
      req.project = pro;
      return next();
    }
  });
  return res.status(400).json({ error: "Project does not exists." });
}

function projectDuplicate(req, res, next) {
  const { id } = req.body;
  projects.map(pro => {
    if (pro.id === id) {
      return res.status(400).json({ error: "Project Already Exists." });
    }
  });

  return next();
}

function checkArrayComplete(req, res, next) {
  const { id, title } = req.body;
  if (!id || !title) {
    return res.status(400).json({ error: "id and title is required." });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkProjectAlreadyExists, (req, res) => {
  return res.json(req.project);
});

server.post("/projects", projectDuplicate, checkArrayComplete, (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id: id,
    title: title,
    tasks: []
  };

  projects.push(newProject);
  return res.json(projects);
});

server.listen(3000);
