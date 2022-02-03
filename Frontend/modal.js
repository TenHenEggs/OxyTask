const utilities = require('./utilities');
const bootstrap = require('bootstrap');

const base = (data) => `
  <div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header border-secondary">
          ${data.header}
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body border-secondary">
          ${data.body}
        </div>
        <div class="modal-footer border-secondary">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Anuluj
          </button>
          ${data.footer}
        </div>
      </div>
    </div>
  </div>
`;

function create(data) {
  const modal = utilities.elementFromString(base(data));
  document.body.append(modal);
  return new bootstrap.Modal(modal);
}

module.exports = create;
