const menu = require('./menu.js');
const tags = [];
menu.setTagArray(tags);

// TODO remove
let idTag = 0;

const elements = {
    'menuTags': document.getElementById('menuTags'),
    'tagPrototype': document.getElementById('tagPrototype')
}

class Tag {
    constructor(name, color) {
        this.id = undefined //set by server
        this.id = idTag++;
        this.name = name;
        this.color = color;
        this.tasks = [];
        this.generateElement();
        tags.push(this);
    }

    generateElement() {
        this.element = elements['tagPrototype'].children[0].cloneNode(true);
        this.element.children[0].innerHTML = this.name;
        this.element.children[0].style.backgroundColor = this.color;
        let colorSum = 0;
        this.color.match(/[0-9a-f]{2}/gi).map(e => parseInt(e, 16)).forEach(e => colorSum += e);
        this.element.children[0].classList.add(colorSum > 255 * 1.5 ? 'text-dark' : 'text-light');
        elements['menuTags'].append(this.element);
        this.element.children[0].style.width = this.element.children[0].clientWidth + 'px';

        this.element.onmouseenter = () => {
            this.element.children[0].innerHTML = 'x';
            this.element.children[0].classList.add('bg-danger');
        };
        this.element.onmouseleave = () => {
            this.element.children[0].innerHTML = this.name;
            this.element.children[0].classList.remove('bg-danger');
            this.element.style.width = undefined;
        };
        this.element.onclick = () => this.delete();
    }

    delete() {
        elements['menuTags'].removeChild(this.element);
        this.tasks.forEach(task => {
            task.tags.splice(task.tags.indexOf(this), 1);
            task.update();
        });
        tags.splice(tags.indexOf(this), 1);
    }
}

module.exports = Tag;
