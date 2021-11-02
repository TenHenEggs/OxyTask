const utilities = require('../utilities.js');
const navigation = require('./navigation.js');
const dragLogic = require('./dragLogic.js');
//TODO server requests & responses

const lists = [
    document.getElementById('list_0'),
    document.getElementById('list_1'),
    document.getElementById('list_2'),
    document.getElementById('list_3'),
    document.getElementById('list_4')
]
let tasks = [];
let tags = [];

//TODO remove
let idTag = 0,
    idTask = 0;

class Task {
    constructor(name, description = '', deadline = '') {
        this.id = undefined; //Assigned by server
        this.id = idTask++; //TODO remove
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.list = 0;
        this.tags = []; //Tag ids
        this.deps = []; //Depedency task ids
        this.subs = []; //Subtasks
        this.htmlElement = this.generateHtmlElement();
    }

    getOutlineStyle() {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        today = today.getTime();

        let deadline = new Date(this.deadline);
        deadline.setHours(0, 0, 0, 0);
        deadline = deadline.getTime();

        if (this.deadline === '') return 'btn-outline-primary';
        if (deadline > today) return 'btn-outline-primary';
        if (deadline === today) return 'btn-outline-warning';
        if (deadline < today) return 'btn-outline-danger';
    }

    generateHtmlElement() {
        let button = document.createElement('button');
        button.classList = 'btn border-3 h-100 w-100 fw-bold fs-6 p-1 overflow-hidden bg-dark';
        button.innerHTML = this.name;
        button.classList.add(this.getOutlineStyle());

        let element = document.createElement('div');
        element.append(button);

        return element;
    }
}

function setupMenu(id) {
    let task = tasks.find(task => task.id === id);
    let menu = document.getElementById('taskMenu');
    menu.innerHTML = task.name;
}

function createTask() {
    const form = document.modalNewTask;
    let task = new Task(form.name.value, form.description.value, form.deadline.value);
    tasks.push(task);
    form.reset();
    lists[0].prepend(task.htmlElement);
    navigation.registerTask(task, setupMenu);
    dragLogic.registerTask(task);
}

function removeTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index != 1) tasks.splice(index, 1);
    else console.log('Task doesn\'t exist');
}

//TODO remove
for (let i = 0; i < 100; ++i) {
    let task = new Task(i);
    task.list = i % 5;
    tasks.push(task);
    lists[i % 5].prepend(task.htmlElement);
    navigation.registerTask(task, setupMenu);
    dragLogic.registerTask(task);
}

document.getElementById('modalTaskCreationButton').onclick = () => createTask();
