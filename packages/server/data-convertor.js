const todotxt = require("todotxt");

// TODO: rewrite to fn
function parseCustomFields(task) {
  const { text = "" } = task;
  const regex = /\s([^\s]+):([^\s]+)/gi;
  let match;
  const map = {};
  do {
    match = regex.exec(text);
    if (!match) {
      break;
    }
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    const [, key, value] = match;
    map[key] = value;
  } while (match);
  return { ...task, ...map };
}

function convertFields(task) {
  return {
    ...task,
    due: task.due ? new Date(task.due).getTime() : null,
    date: task.date ? task.date.getTime() : null,
    completeDate: task.completeDate ? task.completeDate.getTime() : null,
    times: task.times ? parseInt(task.times) : 0,
  };
}

function parse(source) {
  const parsedTasks = todotxt.parse(source).filter((e) => !!e);
  return parsedTasks
    .map((task) => parseCustomFields(task))
    .map((task) => convertFields(task));
}

function serialize(data) {
  const items = data.map((entry) => todotxt.item(entry));
  return todotxt.stringify(items);
}

module.exports = {
  parse,
  serialize,
};
