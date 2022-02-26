const utilities = require('../utilities');
const alert = require('../alert');
const lists = require('./lists');

const table = JSON.parse(sessionStorage.getItem('table'));

const wrapper = document.getElementById('wrapper');
const placeholder = utilities.elementFromString('<div class="border"></div>');
const scrollElement = document.getElementById('lists').children[0];

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
const wrapperCenter = {};
const mousePos = {};

let firstListCenter;
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
  placeholder.remove();
  lists[newList].prepend(placeholder);
  currentIndex = 0;
  currentList = newList;
  listElement = lists[currentList];
  listCenter = firstListCenter + (currentList * listSpacing) - scrollElement.scrollLeft;
  maxIndex = listElement.children.length - 1;
  placeholderTop = placeholder.getBoundingClientRect().top;
}

function scrolling(axis, fn) {
  scrollAmount[axis] = (mousePos[axis] - scrollBounds.center[axis]) * SCROLL_SPEED;
  if (Math.abs(scrollAmount[axis]) > scrollBounds.pivot[axis]) {
    scrollAmount[axis] -= Math.sign(scrollAmount[axis]) * scrollBounds.pivot[axis];
    if (scrollTimer[axis] === undefined)
      scrollTimer[axis] = setInterval(_ => fn(scrollAmount[axis]), 10);
  } else if (scrollTimer[axis] !== undefined) {
    clearInterval(scrollTimer[axis]);
    scrollTimer[axis] = undefined;
    scrollAmount[axis] = 0;
  }
}

function xScrolling() {
  scrolling('x', (amount) => {
    scrollElement.scrollBy(amount, 0);
    listCenter = firstListCenter + (currentList * listSpacing) - scrollElement.scrollLeft;
  });
}

function xPositioning() {
  let newList = currentList;

  if (Math.abs(wrapperCenter.x - listCenter) > listSpacing / 2) {
    newList = currentList + Math.round((wrapperCenter.x - listCenter) / listSpacing);
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
    if (wrapperCenter.y < pivot) {
      newIndex -= 1;
      placeholderTop = upperTop;
    } else break;
  }

  while (newIndex < maxIndex) {
    const lowerRect = listElement.children[newIndex + 1].getBoundingClientRect();
    const lowerBottom = lowerRect.top + lowerRect.height;
    const pivot = (placeholderTop + lowerBottom) / 2;
    if (wrapperCenter.y > pivot) {
      newIndex += 1;
      placeholderTop = lowerBottom - wrapperRect.height;
    } else break;
  }

  if (currentIndex !== newIndex) {
    currentIndex = newIndex;
    placeholder.remove();
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
  };
  setMousePos(e);

  wrapperRect.left += diff.x;
  wrapperRect.top += diff.y;
  wrapperCenter.x += diff.x;
  wrapperCenter.y += diff.y;
  mapPos(wrapper, wrapperRect);

  xScrolling();
  xPositioning();
  yScrolling();
  yPositioning();
}

function startDrag(task, e) {
  const div = task.element;
  div.onmousemove = undefined;
  wrapper.append(div.children[0].cloneNode(true));
  wrapper.children[0].setAttribute('disabled', '');

  copySizePos(div.children[0].getBoundingClientRect(), wrapperRect);
  mapPos(wrapper, wrapperRect);
  mapSize(wrapper, wrapperRect);
  mapSize(placeholder, wrapperRect);

  wrapperCenter.x = wrapperRect.left + wrapperRect.width / 2;
  wrapperCenter.y = wrapperRect.top + wrapperRect.height / 2;
  div.replaceWith(placeholder);

  const scrollRect = scrollElement.getBoundingClientRect();
  scrollBounds.center.x = scrollRect.left + scrollRect.width / 2;
  scrollBounds.center.y = scrollRect.top + scrollRect.height / 2;
  scrollBounds.pivot.x = scrollRect.width * 0.4 * SCROLL_SPEED;
  scrollBounds.pivot.y = scrollRect.height * 0.2 * SCROLL_SPEED;

  const listParent = lists[0].parentElement.getBoundingClientRect();
  firstListCenter = listParent.left + listParent.width / 2 + scrollElement.scrollLeft;
  listSpacing = listParent.width;

  changeList(task.list);
  currentIndex = [...listElement.children].indexOf(placeholder);
  setMousePos(e);

  window.onmouseup = _ => stopDrag(task);
  window.onmousemove = (e) => drag(e);
  drag(e);
}

function stopDrag(task) {
  wrapper.innerHTML = '';
  const div = task.element;
  div.onmousemove = undefined;

  //TODO keep track of position on list
  if (task.list !== currentList) {
    utilities.request('/api/tables/' + table.id + '/tasks/' + task.id, 'PATCH', {
        'list': currentList
      })
      .then(_ => {
        task.list = currentList;
        placeholder.replaceWith(div);
        task.update();
      })
      .catch(err => {
        changeList(task.list);
        placeholder.replaceWith(div);
        alert(err);
      });
  } else placeholder.replaceWith(div);
  // TODO for some weird reason an optimalization causes incorrect behaviour
  // when replaceWith is called once, at the end

  clearInterval(scrollTimer.x);
  clearInterval(scrollTimer.y);
  scrollTimer.x = undefined;
  scrollTimer.y = undefined;

  window.onmouseup = undefined;
  window.onmousemove = undefined;
}

module.exports = {
  registerTask: (task) => {
    const div = task.element;
    div.onmousedown = _ => div.onmousemove = (e) => startDrag(task, e);
    div.onmouseup = _ => div.onmousemove = undefined;
    div.onmouseleave = _ => div.onmousemove = undefined;
  }
};
