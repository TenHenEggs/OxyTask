const modal = require('../modal');

const createModal = modal({
  header: `
    <h5 class="modal-title">Tworzenie tablicy</h5>
  `,
  body: `
    <form name="createModalForm">
      <input type="text" class="form-control w-100 bg-dark text-light" name="name" placeholder="Nazwa tablicy">
    </form>
  `,
  footer: `
    <button type="button" class="btn btn-success" data-bs-dismiss="modal" id="createModalButton">
      Utwórz
    </button>
  `
});

const deleteModal = modal({
  header: `
    <h5 class="modal-title">Usuwanie tablicy</h5>
  `,
  body: `
    <p>
      Czy na pewno chcesz usunąć tablicę
      <span id="deleteModalTableName" class="text-info"></span>?
      Operacji tej nie można cofnąć!
    </p>
  `,
  footer: `
    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="deleteModalButton">
      Usuń
    </button>
  `
})

module.exports = {
  create: createModal,
  delete: deleteModal
}
