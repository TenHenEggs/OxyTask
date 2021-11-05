const Task = require('./Task.js');

const lists = [
    document.getElementById('list_0'),
    document.getElementById('list_1'),
    document.getElementById('list_2'),
    document.getElementById('list_3'),
    document.getElementById('list_4')
];

for (let i = 0; i < 100; ++i) {
    let task = new Task(i, (' ' + i).repeat(i));
    task.list = i % 5;
    lists[0].removeChild(task.element);
    lists[i % 5].prepend(task.element);
}
