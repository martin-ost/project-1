/* eslint-disable no-underscore-dangle,import/named,class-methods-use-this */
/* eslint-disable import/prefer-default-export */

export class TodoEditController {

    constructor(store, mainCtrl) {
        this._store = store;
        this._mainCtrl = mainCtrl;

        this._itemEditContainer = document.querySelector('[data-id="todo-item-edit-container"]');

        this._nameLabel = document.querySelector('[data-id="todo-edit-name-label"]');
        this._nameInput = document.querySelector('[data-id="todo-edit-name-input"]');
        this._descriptionTxt = document.querySelector('[data-id="todo-edit-description"]');
        this._dueDatePick = document.querySelector('[data-id="todo-edit-due-date"]');
        this._prioRadio = document.querySelector('[data-id="todo-edit-priority"]');
        this._doneTick = document.querySelector('[data-id="todo-edit-done"]');

        this._resetBtn = document.querySelector('[data-id="todo-edit-reset"]');
        this._abortBtn = document.querySelector('[data-id="todo-edit-abort"]');
        this._saveBtn = document.querySelector('[data-id="todo-edit-save"]');

        this._curId = undefined;
        this._creationTime = undefined;
    }

    _onResetClick() {
        if (this._curId)
            this._reset();
        else
            this._default();
    }

    _onAbortClick() {
        this._finish();
    }

    _onSaveClick() {
        if (!this._validate()) return;
        this._save();
        this._finish();
    }

    _onNameChange(event) {
        event.target.classList.add("dirty");
        this._validate();
    }

    _onBlur(event) {
        event.target.classList.add("dirty");
    }

    _default() {
        this._clearError();
        this._curId = undefined;
        this._nameInput.value = "";
        this._descriptionTxt.value = "";
        this._dueDatePick.value = new Date().toISOString().substring(0, 10);
        this._prioRadio.querySelector('input[value="3"]').checked = true;
        this._doneTick.checked = false;
    }

    async _reset() {
        this._clearError();
        const note = await this._store.getNoteById(this._curId);
        this._nameInput.value = note.name;
        this._descriptionTxt.value = note.description;
        this._dueDatePick.value = new Date(note.dueDate).toISOString().substring(0, 10);
        this._prioRadio.querySelector(`input[value="${note.priority}"]`).checked = true;
        this._doneTick.checked = note.done;
        this._creationTime = note.creationTime; // creation time is not changed by update
    }

    _clearError() {
        this._nameInput.classList.remove("dirty");
        this._nameLabel.classList.remove("todo-error");
        this._nameLabel.textContent = "Name";
    }

    _setError() {
        this._nameInput.classList.add("dirty");
        this._nameLabel.classList.add("todo-error");
        this._nameLabel.textContent = "Name ist zwingend einzugeben!";
    }

    _validate() {
        this._nameInput.checkValidity();
        if (!this._nameInput.validity.valid) {
            this._setError();
            return false;
        }
        this._clearError();
        return true;
    }

    _save() {
        const note = {
            name: this._nameInput.value,
            description: this._descriptionTxt.value,
            dueDate: new Date(this._dueDatePick.value).getTime(),
            done: this._doneTick.checked
        }
        this._prioRadio.querySelectorAll('input').forEach(
            (radio) => { if (radio.checked) note.priority = radio.value; });
        if (this._curId) {
            note._id = this._curId;
            note.creationTime = this._creationTime;  // existing note: creation time is not changed by update
            this._store.updateNote(note);
        } else {
            note.creationTime = new Date().getTime(); // new note: creation is now
            this._store.addNote(note);
        }
    }

    _finish() {
        this._mainCtrl.displayListView();
    }

    init() {
        this._nameInput.addEventListener(
            'change', (event) => { this._onNameChange(event); });
        this._nameInput.addEventListener(
            'blur', (event) => { this._onBlur(event)});

        this._resetBtn.addEventListener(
            'click', (event) => { this._onResetClick(event); });
        this._abortBtn.addEventListener(
            'click', (event) => { this._onAbortClick(event); });
        this._saveBtn.addEventListener(
            'click', (event) => { this._onSaveClick(event); });
        this.hide();
    }

    hide() {
        this._itemEditContainer.style.display = 'none';
    }

    display(id) { // undefined
        this._curId = id;
        if (id === "")
            this._default(); // new note
        else
            this._reset(); // existing note
        this._itemEditContainer.style.display = 'block';
    }
}