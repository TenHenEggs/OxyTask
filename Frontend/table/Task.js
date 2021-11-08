const dragLogic = require('./dragLogic.js');
const navigation = require('./navigation.js');

//TODO remove
let idTask = 0;

const elements = {
    'list_0': document.getElementById('list_0'),
    'taskPrototype': document.getElementById('taskPrototype'),
    'taskSearchPrototype': document.getElementById('taskSearchPrototype')
}

const tasks = [];

class Task {
    constructor(name, description = '', deadline = '') {
        this.id = undefined; //Assigned by server
        this.id = idTask++; //TODO remove
        this.name = name;
        this.description = description;
        this.deadline = deadline;
        this.list = 0;
        this.subs = [];
        this.deps = [];

        this.generateElement();
        this.generateSearchElement();
        this.update();

        elements['list_0'].prepend(this.element);
        tasks.push(this);
        navigation.registerTask(this);
        dragLogic.registerTask(this);
    }

    getDeadlineBasedColor() {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        today = today.getTime();

        let deadline = new Date(this.deadline);
        deadline.setHours(0, 0, 0, 0);
        deadline = deadline.getTime();

        if (this.deadline === '') return 'primary';
        if (deadline > today) return 'success';
        if (deadline === today) return 'warning';
        if (deadline < today) return 'danger';
    }

    getListBasedColor() {
        switch (this.list) {
            case 0:
                return 'secondary';
            case 1:
                return 'danger';
            case 2:
            case 3:
                return 'warning';
            case 4:
                return 'success';
        }
    }

    generateElement() {
        this.element = elements['taskPrototype'].children[0].cloneNode(true);
        this.element.children[0].children[0].children[1].innerHTML = '#' + this.id;
    }

    generateSearchElement() {
        this.searchElement = elements['taskSearchPrototype'].children[0].cloneNode(true);
        this.searchElement.innerHTML = this.name + '#' + this.id;
    }

    update() {
        const color = this.getDeadlineBasedColor();
        const button = this.element.children[0];
        button.children[0].children[0].innerHTML = this.name;
        button.classList = 'btn border-3 h-100 w-100 fw-bold fs-6 p-1 overflow-hidden bg-dark';
        button.classList.add('btn-outline-' + color);
        const progress = button.children[1];
        progress.classList = 'progress m-2';
        if (this.subs.length === 0) progress.classList.add('d-none');
        else {
            const max = this.subs.length;
            let current = 0;
            this.subs.forEach(sub => {
                if (sub.completed === true) current += 1;
            });
            progress.children[0].style.width = (current / max * 100) + '%';
            progress.children[0].classList = 'progress-bar bg-' + color;
        }
        this.deps.forEach(dep => {
            if (dep.list !== 4) button.classList.add('opacity-50');
        });
        this.searchElement.innerHTML = this.name + '#' + this.id;
    }

    delete() {
        this.element.parentElement.removeChild(this.element);
        tasks.splice(tasks.findIndex(task => task.id === this.id), 1);
    }
}

function updateState() {
    tasks.forEach(task => task.update());
}

navigation.setup(tasks);
dragLogic.setup(updateState);
module.exports = Task;
