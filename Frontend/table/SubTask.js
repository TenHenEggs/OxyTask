const elements = {
    'subPrototype': document.getElementById('subPrototype')
}

class SubTask {
    constructor(name) {
        this.name = name;
        this.completed = false;
        this.generateElement();
    }

    generateElement() {
        this.element = elements['subPrototype'].children[0].cloneNode(true);
        this.element.children[2].value = this.name;
    }
}

module.exports = SubTask;
