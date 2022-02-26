const utilities = require('../utilities');

const list = (title) => `
  <div class="col h-100 d-flex flex-column task-list">
    <p class="border border-info border-3 rounded-pill">
      ${title}
    </p>
    <div class="row row-cols-1 justify-content-center g-3 overflow-auto ms-2 me-2 list"></div>
  </div>
`;

const subtask = (data) => `
  <div class="input-group p-0">
    <span class="input-group-text bg-dark rounded-0">
      <input type="checkbox" class="border mt-0 form-check-input bg-dark text-light" ${data.completed ? 'checked' : ''}>
    </span>
    <button type="button" class="btn btn-outline-danger rounded-0">x</button>
    <input type="text" class="form-control bg-dark text-light rounded-0" value="${data.name}">
  </div>
`;

const tag = (data) => `
  <div class="p-1">
    <span class="badge position-relative">
      <span>${data.name}</span>
    </span>
  </div>
`;

const tagAddon = (data) => `
  <span class="addon badge bg-${data.bg} w-100 h-100 position-absolute d-none top-0 start-0 _${data.id}">${data.text}</span>
`;

const task = (data) => `
  <div>
    <button class="_ btn border-3 h-100 w-100 fw-bold fs-6 p-1 overflow-hidden bg-dark">
      <p class="m-0">
        <span></span>
        <span class="text-secondary opacity-50">#${data.id}</span>
      </p>
      <div class="progress m-2 d-none">
        <div class="progress-bar"></div>
      </div>
      <div class="d-flex flex-wrap align-items-start overflow-hidden"></div>
    </button>
  </div>
`;

const taskSearch = (data) => `
  <button type="button" class="list-group-item bg-dark text-start text-light border-light">${data.name + '#' + data.id}</button>
`;

const depedency = (data) => `
  <div class="input-group p-0 flex-nowrap overflow-hidden">
    <button type="button" class="btn btn-outline-danger rounded-0">x</button>
    <span class="text-${data.getListBasedColor()} depedency input-group-text text-start bg-dark rounded-0 flex-grow-1">
      ${data.name + '#' + data.id}
    </span>
  </div>
`;

module.exports = {
  list: (...args) => utilities.elementFromString(list(...args)),
  subtask: (...args) => utilities.elementFromString(subtask(...args)),
  tag: (...args) => utilities.elementFromString(tag(...args)),
  tagAddon: (...args) => utilities.elementFromString(tagAddon(...args)),
  task: (...args) => utilities.elementFromString(task(...args)),
  taskSearch: (...args) => utilities.elementFromString(taskSearch(...args)),
  depedency: (...args) => utilities.elementFromString(depedency(...args))
};
