let wrapper = document.getElementById('wrapper');
let placeholder = document.getElementById('placeholder');

let offset = undefined;
let scrollTimer = {
    x: undefined,
    y: undefined
};
let scrollAmount = {
    x: 0,
    y: 0
};
const SCROLL_SPEED = 0.07;

let xScrollElement = document.getElementById('lists').firstElementChild;
let xRect;
let xCenter;
let xPivot;

let currentList;
let listRect;
let listSpacing;
let listCenter;

let yScrollElement;
let yRect;
let yCenter;
let yPivot;

let list;
let maxIndex;

const lists = [
    document.getElementById('list_0'),
    document.getElementById('list_1'),
    document.getElementById('list_2'),
    document.getElementById('list_3'),
    document.getElementById('list_4')
];

function refreshList() {
    list = lists[currentList];
    listRect = list.getBoundingClientRect();
    listCenter = listRect.left + listRect.width / 2;
    maxIndex = list.children.length - 1;

    yScrollElement = list;
    yRect = listRect;
    yCenter = yRect.top + yRect.height / 2;
    yPivot = yRect.height * SCROLL_SPEED * 0.2;
}

function xScrolling(pos) {
    scrollAmount.x = (pos.x - xCenter) * SCROLL_SPEED;
    if (Math.abs(scrollAmount.x) > xPivot) {
        if (scrollAmount.x < 0) scrollAmount.x += xPivot;
        else scrollAmount.x -= xPivot;

        if (scrollTimer.x === undefined)
            scrollTimer.x = setInterval(() => {
                xScrollElement.scrollBy(scrollAmount.x, 0);
                listRect.left += scrollAmount.x;
                listCenter += scrollAmount.x;
            }, 10);
    } else if (scrollTimer.x !== undefined) {
        clearInterval(scrollTimer.x);
        scrollTimer.x = undefined;
        scrollAmount.x = 0;
    }
}

function xPositioning(pos) {
    let newList = currentList;

    if (Math.abs(pos.x - listCenter) > listSpacing / 2) {
        newList = currentList + Math.round((pos.x - listCenter) / listSpacing);
        newList = Math.min(4, Math.max(0, newList));
    }

    if (currentList !== newList) {
        clearInterval(scrollTimer.y);
        scrollTimer.y = undefined;
        lists[currentList].removeChild(placeholder);
        lists[newList].prepend(placeholder);
        currentList = newList;
        refreshList();
    }
}

function yScrolling(pos) {
    scrollAmount.y = (pos.y - yCenter) * SCROLL_SPEED;
    if (Math.abs(scrollAmount.y) > yPivot) {
        if (scrollAmount.y < 0)
            scrollAmount.y += yPivot;
        else
            scrollAmount.y -= yPivot;
        if (scrollTimer.y === undefined)
            scrollTimer.y = setInterval(() => yScrollElement.scrollBy(0, scrollAmount.y), 10);
    } else if (scrollTimer.y !== undefined) {
        clearInterval(scrollTimer.y);
        scrollTimer.y = undefined;
        scrollAmount.y = 0;
    }
}

function yPositioning(pos) {
    const currentIndex = Array.prototype.indexOf.call(list.children, placeholder);
    let newIndex = currentIndex;

    const rect = placeholder.getBoundingClientRect();
    let bottom = rect.top + rect.height;
    let top = rect.top;

    while (newIndex > 0) {
        const upperRect = list.children[newIndex - 1].getBoundingClientRect();
        const top = upperRect.top;
        const pivot = (bottom + top) / 2;
        if (pos.y < pivot) {
            newIndex -= 1;
            bottom = top + rect.height;
        } else break;
    }

    while (newIndex < maxIndex) {
        const lowerRect = list.children[newIndex + 1].getBoundingClientRect();
        const bottom = lowerRect.top + lowerRect.height;
        const pivot = (top + bottom) / 2;
        if (pos.y > pivot) {
            newIndex += 1;
            top = bottom - rect.height;
        } else break;
    }

    if (currentIndex !== newIndex) {
        list.removeChild(placeholder);
        if (newIndex < maxIndex)
            list.insertBefore(placeholder, list.children[newIndex]);
        else
            list.append(placeholder);
    }
}

function initDrag(e, rect) {
    offset = {};
    offset.left = e.clientX - rect.left;
    offset.top = e.clientY - rect.top;

    offset.left = Math.max(offset.left, 1);
    offset.top = Math.max(offset.top, 1);

    offset.left = Math.min(offset.left, rect.width - 1);
    offset.top = Math.min(offset.top, rect.height - 1);
}

function drag(e) {
    const rect = wrapper.getBoundingClientRect();

    if (offset === undefined) initDrag(e, rect);

    wrapper.style.left = (e.clientX - offset.left) + 'px';
    wrapper.style.top = (e.clientY - offset.top) + 'px';

    const pos = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };

    xScrolling(pos);
    xPositioning(pos);
    yScrolling(pos);
    yPositioning(pos);
}

function startDrag(task) {
    let div = task.htmlElement;
    let taskButton = div.firstElementChild;
    const rect = taskButton.getBoundingClientRect();

    wrapper.onmouseup = () => stopDrag(task);
    wrapper.append(taskButton.cloneNode(true));
    wrapper.firstElementChild.setAttribute('disabled', '');

    wrapper.style.left = rect.left + 'px';
    wrapper.style.top = rect.top + 'px';
    wrapper.style.width = rect.width + 'px';
    wrapper.style.height = rect.height + 'px';
    wrapper.classList.remove('d-none');

    placeholder.style.width = rect.width + 'px';
    placeholder.style.height = rect.height + 'px';
    placeholder.classList.remove('d-none');

    div.onmousemove = undefined;
    div.classList.add('d-none');
    div.parentElement.replaceChild(placeholder, div);

    xRect = xScrollElement.getBoundingClientRect();
    xCenter = xRect.left + xRect.width / 2;
    xPivot = xRect.width * SCROLL_SPEED * 0.4;

    currentList = parseInt(placeholder.parentElement.id.substr(-1));
    refreshList();
    listSpacing = list.parentElement.getBoundingClientRect().width;
    window.addEventListener('mousemove', drag);
}

function stopDrag(task) {
    wrapper.onmouseup = undefined;
    wrapper.innerHTML = '';
    wrapper.classList.add('d-none');

    let div = task.htmlElement;
    task.list = currentList;

    placeholder.classList.add('d-none');
    placeholder.parentElement.replaceChild(div, placeholder);

    div.onmousemove = undefined;
    div.classList.remove('d-none');

    offset = undefined;
    clearInterval(scrollTimer.x);
    clearInterval(scrollTimer.y);
    scrollTimer.x = undefined;
    scrollTimer.y = undefined;
    window.removeEventListener('mousemove', drag);
}

module.exports.registerTask = function(task) {
    let div = task.htmlElement;
    div.onmousedown = () => div.onmousemove = () => startDrag(task);
    div.onmouseup = () => div.onmousemove = undefined;
    div.onmouseleave = () => div.onmousemove = undefined;
}
