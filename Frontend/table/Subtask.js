const templates = require('./templates');
const alert = require('../alert');

const table = JSON.parse(sessionStorage.getItem('table'));

class Subtask {
  constructor(data) {
    this.name = data.name;
    this.completed = data.completed ? data.completed : false;
  }

  generateElement(deleteFn) {
    const element = templates.subtask(this);
    element.children[1].onclick = deleteFn;
    return element;
  }

  bindElementToTask(element, task) {
    const checkbox = element.children[0].children[0];
    checkbox.onchange = _ => {
      utilities.request('/api/tables/' + table.id + '/tasks/' + task.id, 'PATCH', {
        "subtasks": [{
          "name": this.name,
          "completed": this.completed,
        }]
      })
      .then(_ => {
        this.completed = checkbox.checked;
        if (this.completed) checkbox.setAttribute('checked', '');
        else checkbox.removeAttribute('checked');
      })
      .catch(err => alert(err));
      task.updateProgress();
    }
    task.subtasksElements.push(element);
    task.subtasks.push(this);
  }
}

module.exports = Subtask;
