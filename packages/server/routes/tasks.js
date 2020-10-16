const express = require("express");

function taskFilter(tasks, query, prop) {
  return tasks.filter((t) => t[prop].some((q) => query.includes(q)));
}

function complete(tasks, status) {
  return tasks.filter(({ complete }) =>
    status === "x" ? !!complete : !complete
  );
}

function byPriority(tasks, prio) {
  return tasks.filter(({ priority }) => priority === prio);
}

function byDate(tasks, term, queryDate) {
  const typedDate = new Date(queryDate);
  console.log(typedDate);
  if(isNaN(typedDate.getTime())) {
    console.error('invalid date');
    throw new TypeError('invalid date');
  }
  if (term === "due") {
    return tasks.filter(({ due = NaN }) => due === typedDate.getTime());
  } else if (term === "end") {
    return tasks.filter(({ completeDate = NaN }) => completeDate === typedDate.getTime());
  } else if (term === "start") {
    return tasks.filter(({ date = NaN }) => date === typedDate.getTime());
  }
}

function taskRouter(tasks) {
  const router = express.Router();

  router.get("/", (req, res) => res.json(tasks));

  router.get("/:taskId(\\d+)", (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    res.json(tasks.filter(({ number }) => number === taskId));
  });

  router.get("/\\+:proj", (req, res) => {
    const query = req.params.proj.split(",") || [];
    res.json(taskFilter(tasks, query, "projects"));
  });

  router.get("/@:context", (req, res) => {
    const query = req.params.context.split(",") || [];
    res.json(taskFilter(tasks, query, "contexts"));
  });

  router.get("/\\+:proj/:complete(x|!x)", (req, res) => {
    const query = req.params.proj.split(",") || [];
    const status = req.params.complete;
    res.json(complete(taskFilter(tasks, query, "projects"), status));
  });

  router.get("/\\+:proj/:priority(A|B|C)", (req, res) => {
    const query = req.params.proj.split(",") || [];
    const prio = req.params.priority;
    res.json(byPriority(taskFilter(tasks, query, "projects"), prio));
  });

  router.get("/@:context/:complete(x|!x)", (req, res) => {
    const query = req.params.context.split(",") || [];
    const status = req.params.complete;
    res.json(complete(taskFilter(tasks, query, "contexts"), status));
  });

  router.get("/@:context/:priority(A|B|C)", (req, res) => {
    const query = req.params.context.split(",") || [];
    const prio = req.params.priority;
    res.json(byPriority(taskFilter(tasks, query, "contexts"), prio));
  });

  router.get("/:complete(x|!x)", (req, res) => {
    const status = req.params.complete;
    res.json(complete(tasks, status));
  });

  router.get("/:priority(A|B|C)", (req, res) => {
    const prio = req.params.priority;
    res.json(byPriority(tasks, prio));
  });

  router.get("/:priority(A|B|C)/:complete(x|!x)", (req, res) => {
    const prio = req.params.priority;
    const status = req.params.complete;
    res.json(complete(byPriority(tasks, prio), status));
  });

  router.get(
    "/:term(due|start|end)/:date(\\d{4}-\\d{1,2}-\\d{1,2})",
    (req, res) => {
      const { term, date } = req.params;
      res.json(byDate(tasks, term, date));
    }
  );

  return router;
}
module.exports = taskRouter;
