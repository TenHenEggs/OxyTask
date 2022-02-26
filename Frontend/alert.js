const utilities = require('./utilities');

const storage = utilities.elementFromString(`
  <div class="fixed-bottom"></div>
`);

const template = utilities.elementFromString(`
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <span></span>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>
`);

let init = false;

function initialize() {
  init = true;
  document.body.append(storage);
}

function add(err) {
  const alert = template.cloneNode(true);
  alert.children[0].innerHTML = err.message;
  storage.append(alert);
}

module.exports = (err) => {
  if (!init) initialize();
  add(err);
};
