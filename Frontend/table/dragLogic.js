const wrapper = document.getElementById('wrapper');
const placeholder = document.getElementById('placeholder');
const listsContainer = document.getElementById('lists').children[0];

let update;

const lists = [
    document.getElementById('list_0'),
    document.getElementById('list_1'),
    document.getElementById('list_2'),
    document.getElementById('list_3'),
    document.getElementById('list_4')
];

const scrollTimer = {};
const scrollAmount = {};
const scrollBounds = {
    center: {},
    pivot: {},
};
const SCROLL_SPEED = 0.07;

let listSpacing;
let listCenter;
let listElement;
let currentList;

const wrapperRect = {};
const wrapperMid = {};
const mousePos = {};

let listCenterOffset;
let placeholderTop;

let currentIndex;
let maxIndex;

function mapPos(element, from) {
    element.style.left = from.left + 'px';
    element.style.top = from.top + 'px';
}

function mapSize(element, from) {
    element.style.width = from.width + 'px';
    element.style.height = from.height + 'px';
}

function setMousePos(e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
}

function copySizePos(from, to) {
    to.left = from.left;
    to.top = from.top;
    to.width = from.width;
    to.height = from.height;
}

function changeList(newList) {
    clearInterval(scrollTimer.y);
    scrollTimer.y = undefined;
    lists[currentList].removeChild(placeholder);
    lists[newList].prepend(placeholder);
    currentIndex = 0;
    currentList = newList;
    listElement = lists[currentList];
    listCenter = listCenterOffset + (currentList * listSpacing) - listsContainer.scrollLeft;
    maxIndex = listElement.children.length - 1;
    const placeholderRect = placeholder.getBoundingClientRect();
    placeholderTop = placeholderRect.top;
}

function scrolling(axis, fn) {
    scrollAmount[axis] = (mousePos[axis] - scrollBounds.center[axis]) * SCROLL_SPEED;
    if (Math.abs(scrollAmount[axis]) > scrollBounds.pivot[axis]) {
        scrollAmount[axis] -= Math.sign(scrollAmount[axis]) * scrollBounds.pivot[axis];
        if (scrollTimer[axis] === undefined)
            scrollTimer[axis] = setInterval(() => fn(scrollAmount[axis]), 10);
    } else if (scrollTimer[axis] !== undefined) {
        clearInterval(scrollTimer[axis]);
        scrollTimer[axis] = undefined;
        scrollAmount[axis] = 0;
    }
}

function xScrolling() {
    scrolling('x', (amount) => {
        listsContainer.scrollBy(amount, 0);
        listCenter = listCenterOffset + (currentList * listSpacing) - listsContainer.scrollLeft;
    });
}

function xPositioning() {
    let newList = currentList;

    if (Math.abs(wrapperMid.x - listCenter) > listSpacing / 2) {
        newList = currentList + Math.round((wrapperMid.x - listCenter) / listSpacing);
        newList = Math.min(4, Math.max(0, newList));
        if (currentList !== newList) changeList(newList);
    }
}

function yScrolling() {
    scrolling('y', (amount) => listElement.scrollBy(0, amount));
}

function yPositioning() {
    let newIndex = currentIndex;

    while (newIndex > 0) {
        const upperRect = listElement.children[newIndex - 1].getBoundingClientRect();
        const upperTop = upperRect.top;
        const pivot = (placeholderTop + wrapperRect.height + upperTop) / 2;
        if (wrapperMid.y < pivot) {
            newIndex -= 1;
            placeholderTop = upperTop;
        } else break;
    }

    while (newIndex < maxIndex) {
        const lowerRect = listElement.children[newIndex + 1].getBoundingClientRect();
        const lowerBottom = lowerRect.top + lowerRect.height;
        const pivot = (placeholderTop + lowerBottom) / 2;
        if (wrapperMid.y > pivot) {
            newIndex += 1;
            placeholderTop = lowerBottom - wrapperRect.height;
        } else break;
    }

    if (currentIndex !== newIndex) {
        currentIndex = newIndex;
        listElement.removeChild(placeholder);
        if (newIndex < maxIndex)
            listElement.insertBefore(placeholder, listElement.children[newIndex]);
        else
            listElement.append(placeholder);
    }
}

function drag(e) {
    const diff = {
        x: e.clientX - mousePos.x,
        y: e.clientY - mousePos.y
    }
    setMousePos(e);

    wrapperRect.left += diff.x;
    wrapperRect.top += diff.y;
    wrapperMid.x += diff.x;
    wrapperMid.y += diff.y;
    mapPos(wrapper, wrapperRect);

    xScrolling();
    xPositioning();
    yScrolling();
    yPositioning();
}

function startDrag(task, e) {
    const div = task.element;
    const taskButton = div.children[0];
    const buttonRect = taskButton.getBoundingClientRect();

    copySizePos(buttonRect, wrapperRect);
    mapPos(wrapper, wrapperRect);
    mapSize(wrapper, wrapperRect);

    wrapper.append(taskButton.cloneNode(true));
    wrapper.children[0].setAttribute('disabled', '');
    wrapper.classList.remove('d-none');

    mapSize(placeholder, wrapperRect);
    placeholder.classList.remove('d-none');

    div.onmousemove = undefined;
    div.classList.add('d-none');
    div.parentElement.replaceChild(placeholder, div);

    const xRect = listsContainer.getBoundingClientRect();
    scrollBounds.center.x = xRect.left + xRect.width / 2;
    scrollBounds.pivot.x = xRect.width * 0.4 * SCROLL_SPEED;

    const yRect = lists[0].parentElement.getBoundingClientRect();
    scrollBounds.center.y = yRect.top + yRect.height / 2;
    scrollBounds.pivot.y = yRect.height * 0.2 * SCROLL_SPEED;
    listCenterOffset = yRect.left + yRect.width / 2 + listsContainer.scrollLeft;
    listSpacing = yRect.width;

    currentList = +placeholder.parentElement.id.slice(-1);
    changeList(currentList);

    currentIndex = [...listElement.children].indexOf(placeholder);
    setMousePos(e);
    wrapperMid.x = wrapperRect.left + wrapperRect.width / 2;
    wrapperMid.y = wrapperRect.top + wrapperRect.height / 2;

    window.onmouseup = () => stopDrag(task);
    window.onmousemove = (e) => drag(e);
    drag(e);
}

function stopDrag(task) {
    wrapper.innerHTML = '';
    wrapper.classList.add('d-none');

    const div = task.element;
    task.list = currentList;

    placeholder.classList.add('d-none');
    placeholder.parentElement.replaceChild(div, placeholder);

    div.onmousemove = undefined;
    div.classList.remove('d-none');

    clearInterval(scrollTimer.x);
    clearInterval(scrollTimer.y);
    scrollTimer.x = undefined;
    scrollTimer.y = undefined;

    window.onmouseup = undefined;
    window.onmousemove = undefined;
    update();
}

module.exports.registerTask = function(task) {
    const div = task.element;
    div.onmousedown = () => div.onmousemove = (e) => startDrag(task, e);
    div.onmouseup = () => div.onmousemove = undefined;
    div.onmouseleave = () => div.onmousemove = undefined;
}

module.exports.setup = function(updateFun) {
    update = updateFun;
}
