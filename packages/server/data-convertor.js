const todotxt = require('todotxt');

function parse(source) {
  return todotxt.parse(source);
}

function serialize(data) {
  const items = data.map(entry => todotxt.item(entry));
  return todotxt.stringify(items);
}

module.exports = {
  parse, serialize
};
