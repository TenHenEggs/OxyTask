const modal = require('../modal');

const deleteTableModal = modal({
  header: `
    <h5 class="modal-title">Usuwanie tablicy</h5>
  `,
  body: `
    Czy na pewno chcesz usunąć tablicę <span id="deleteTableModalTableName" class="text-info"></span>? Operacji tej nie można cofnąć!
  `,
  footer: `
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="deleteTableModalButton">
      Usuń
    </button>
  `
});

const createTaskModal = modal({
  header: `
    <h5 class="modal-title">Tworzenie zadania</h5>
  `,
  body: `
    <form name="createTaskModalForm">
      <input type="text" class="form-control w-100 mb-3 bg-dark text-light" name="name" placeholder="Nazwa zadania">
      <input type="text" class="form-control w-100 mb-3 bg-dark text-light" name="description" placeholder="Opis zadania">
      <div class="input-group w-100">
        <span class="input-group-text bg-dark text-light">Termin</span>
        <input type="date" class="form-control flex-grow-1 bg-dark text-light" name="deadline">
      </div>
    </form>
  `,
  footer: `
    <button type="button" class="btn btn-success" data-bs-dismiss="modal" id="createTaskModalButton">
      Utwórz
    </button>
  `
});

const deleteTaskModal = modal({
  header: `
    <h5 class="modal-title">Usuwanie zadania</h5>
  `,
  body: `
    Czy na pewno chcesz usunąć zadanie <span id="deleteTaskModalTaskName" class="text-info"></span>? Operacji tej nie można cofnąć!
  `,
  footer: `
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="deleteTaskModalButton">
      Usuń
    </button>
  `
});

const createTagModal = modal({
  header: `
    <h5 class="modal-title">Tworzenie tagu</h5>
  `,
  body: `
    <form name="createTagModalForm">
      <div class="input-group">
        <input type="text" class="form-control bg-dark text-light" name="name" placeholder="Nazwa tagu">
          <span class="input-group-text bg-dark text-light">
            Kolor
          </span>
        <input type="color" class="form-control form-control-color bg-dark" name="color">
      </div>
    </form>
  `,
  footer: `
    <button type="button" class="btn btn-success" data-bs-dismiss="modal" id="createTagModalButton">
      Utwórz
    </button>
  `
});

const deleteTagModal = modal({
  header: `
    <h5 class="modal-title">Usuwanie tagu</h5>
  `,
  body: `
    Czy na pewno chcesz usunąć tag <span id="deleteTagModalTagName" class="text-info"></span>? Operacji tej nie można cofnąć!
  `,
  footer: `
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="deleteTagModalButton">
      Usuń
    </button>
  `
});

module.exports = {
  deleteTable: deleteTableModal,
  createTask: createTaskModal,
  deleteTask: deleteTaskModal,
  createTag: createTagModal,
  deleteTag: deleteTagModal
};
