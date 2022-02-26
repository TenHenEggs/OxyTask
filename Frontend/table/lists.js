const templates = require('./templates');

const storage = document.getElementById('lists').children[0].children[0];

function create(title) {
  const list = templates.list(title);
  storage.append(list);
  return list.children[1];
}

module.exports = [
  create('Pomysły'),
  create('Do Zrobienia'),
  create('W Trakcie'),
  create('Testowanie'),
  create('Ukończone')
];
