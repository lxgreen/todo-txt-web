const express = require("express");

function taskRouter(tasks) {
  const router = express.Router();
  router.get("/", (req, res, next) => res.json(tasks));
  router.get("/:taskId(\\d+)", (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    res.json(tasks.filter(({ number }) => number === taskId));
  });
  return router;
}
module.exports = taskRouter;
