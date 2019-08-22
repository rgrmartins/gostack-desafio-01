const express = require("express");

const server = express();
server.use(express.json());

let numberRequests = 0;
const projects = [];

//Middlewares Global - Contador
server.use((req, res, next) => {
  numberRequests++;

  console.time("Request");

  console.log(`O servidor ja recebeu ${numberRequests} requisições.`);
  console.log(`Método ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd("Request");
});

function checkProjectAlreadyExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(pro => pro.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists." });
  } else {
    req.project = project;
    return next();
  }
}

function projectDuplicate(req, res, next) {
  const { id } = req.body;

  const project = projects.find(pro => pro.id === id);

  if (project) {
    return res.status(400).json({ error: "Project Already Exists." });
  }

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

server.post("/projects", checkArrayComplete, projectDuplicate, (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id: id,
    title: title,
    tasks: []
  };

  projects.push(newProject);
  return res.json(projects);
});

server.put("/projects/:id", checkProjectAlreadyExists, (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required to update." });
  }

  req.project.title = title;

  return res.json(req.project);
});

server.delete("/projects/:id", checkProjectAlreadyExists, (req, res) => {
  const index = projects.indexOf(req.project);
  projects.splice(index, 1);
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProjectAlreadyExists, (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Task title is required." });
  }

  req.project.tasks.push(title);

  return res.json(req.project);
});

server.listen(3000);
