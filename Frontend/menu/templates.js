const utilities = require('../utilities');

const table = utilities.elementFromString(`
  <div class="col">
    <div class="row w-100 g-0">
      <div class="col">
        <button type="button" class="btn btn-outline-light p-3 rounded-start text-center w-100 overflow-hidden"></button>
      </div>
      <div class="col-1 d-none">
        <button type="button" class="btn btn-outline-danger rounded-0 rounded-end w-100 h-100 p-0">
          x
        </button>
      </div>
    </div>
  </div>
`);

module.exports = {
  table: _ => table.cloneNode(true)
};
