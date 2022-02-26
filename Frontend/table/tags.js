const utilities = require('../utilities');
const templates = require('./templates');
const modals = require('./modals');
const alert = require('../alert');

const table = JSON.parse(sessionStorage.getItem('table'));

const tags = [];
const tagsMenuElement = document.getElementById('menuTags');
const tagsEditElement = document.getElementById('editTags');

const delAddon = templates.tagAddon({
  bg: 'danger',
  id: 'del',
  text: 'x'
});

const addAddon = templates.tagAddon({
  bg: 'success',
  id: 'add',
  text: '+'
});

const remAddon = templates.tagAddon({
  bg: 'danger',
  id: 'rem',
  text: '-'
});

const tagName = document.getElementById('deleteTagModalTagName');
const button = document.getElementById('deleteTagModalButton');

class Tag {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.tasks = [];
    this.setupBase();
    tags.push(this);
    tagsMenuElement.append(this.generateElement(true, false));
    tagsEditElement.append(this.generateElement(false, true));
  }

  setupBase() {
    this.base = templates.tag(this);
    const badge = this.base.children[0];
    badge.style.backgroundColor = this.color;
    let colorSum = 0;
    this.color.match(/[0-9a-f]{2}/gi).forEach(e => colorSum += parseInt(e, 16));
    badge.classList.add(colorSum > 255 * 1.5 ? 'text-dark' : 'text-light');
  }

  generateElement(del, addRem) {
    const element = this.base.cloneNode(true);
    const badge = element.children[0];
    if (del) {
      const del = delAddon.cloneNode(true);
      del.onclick = _ => {
        tagName.innerHTML = this.name;
        button.onclick = _ => this.delete();
        modals.deleteTag.show();
      };
      badge.append(del);
    } else if (addRem) {
      const add = addAddon.cloneNode(true);
      add.onclick = _ => badge.removeAttribute('unused');
      const rem = remAddon.cloneNode(true);
      rem.onclick = _ => badge.setAttribute('unused', '');
      badge.append(add, rem);
    }
    return element;
  }

  addToTask(task) {
    task.tags.push(this);
    task.tagsElement.append(this.generateElement(false, false));
  }

  removeFromTask(task) {
    const index = task.tags.indexOf(this);
    task.tags.splice(index, 1);
    task.tagsElement.children[index].remove();
  }

  delete() {
    // TODO wait for backend to FIX
    // test('/api/tables/' + table.id + '/tags/' + this.id, 'DELETE')
    // utilities.request('/api/tables/' + table.id + '/tags/' + this.id, 'DELETE')
      // .then(_ => {
        const index = tags.indexOf(this);
        tags.splice(tags.indexOf(this), 1);
        tagsMenuElement.children[index].remove();
        tagsEditElement.children[index].remove();
        this.tasks.forEach(task => {
          const index = task.tags.indexOf(this);
          task.tags.splice(index, 1);
          task.tagsElement.children[index].remove();
        });
      // })
      // .catch(err => alert(err));
  }
}

module.exports = {
  list: tags,
  create: (data) => new Tag(data)
};
