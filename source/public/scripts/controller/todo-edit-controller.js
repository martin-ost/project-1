/**
 * @file CAS FEE 2022 / Project 1 / Frontend: Edit-View Controller
 * @author Martin Frey <martin.frey@ost.ch>
 */

/* eslint-disable no-underscore-dangle,import/named,class-methods-use-this */
import TodoService from '../service/todo-service.js';

/**
 * The edit view controller class:
 *
 * - controls all UI elements of the edit view,
 * - and validate user input (only "name" needs to be validated).
 */
export default class TodoEditController {

    constructor(mainCtrl) {
        this._itemEditContainer = document.querySelector('[data-id="todo-item-edit-container"]');

        // Edit form UI elements.
        this._nameLabel = document.querySelector('[data-id="todo-edit-name-label"]');
        this._nameInput = document.querySelector('[data-id="todo-edit-name-input"]');
        this._descriptionTxt = document.querySelector('[data-id="todo-edit-description"]');
        this._dueDatePick = document.querySelector('[data-id="todo-edit-due-date"]');
        this._prioRadio = document.querySelector('[data-id="todo-edit-priority"]');
        this._doneTick = document.querySelector('[data-id="todo-edit-done"]');
        // Edit action UI elements.
        this._resetBtn = document.querySelector('[data-id="todo-edit-reset"]');
        this._abortBtn = document.querySelector('[data-id="todo-edit-abort"]');
        this._saveBtn = document.querySelector('[data-id="todo-edit-save"]');

        this._mainCtrl = mainCtrl;
        this._curId = undefined;
        this._creationTime = undefined;
    }

    /**
     * Reset edit form to initial (for updated note) or default data (for new note).
     * Callback for reset button.
     */
    async _onResetClick() {
        try {
            if (this._curId)
                await this._reset();
            else
                this._default();
        } catch (err) {
            this._mainCtrl.screech("Could not reset note", err);
        }
    }

    /**
     * Cancel edit view and returns to list view, no data is saved.
     * Callback for cancel button.
     */
    _onAbortClick() {
        this._finish();
    }

    /**
     * Save data on backend and returns to list view.
     * The input data is validated before saving, stay in edit view on failed validation.
     * Callback for save button.
     */
    async _onSaveClick() {
        try {
            if (!this._validate())
                return;
            await this._save();
            this._finish();
        } catch (err) {
            this._mainCtrl.screech("Could not save note", err);
        }
    }

    /**
     * Validate user input for "name" field.
     * Callback for name input field changes.
     */
    _onNameChange(event) {
        event.target.classList.add("dirty");
        this._validate();
    }

    /**
     * Mark name input field as dirty as soon as touched by user.
     * Callback for name input field changes.
     */
    _onBlur(event) {
        event.target.classList.add("dirty");
    }

    /**
     * Validate user input of form.
     * Indicate error to user, or clear pending error if input is correct.
     */
    _validate() {
        this._nameInput.checkValidity();
        if (!this._nameInput.validity.valid) {
            this._setError();
            return false;
        }
        this._clearError();
        return true;
    }

    /**
     *  Show error message for invalid name.
     */
    _setError() {
        this._nameInput.classList.add("dirty");
        this._nameLabel.classList.add("todo-error");
        this._nameLabel.textContent = "Name ist zwingend einzugeben!";
    }

    /**
     *  Clear error message for invalid name.
     */
    _clearError() {
        this._nameInput.classList.remove("dirty");
        this._nameLabel.classList.remove("todo-error");
        this._nameLabel.textContent = "Name";
    }

    /**
     * Set default values for new note ("undo" all changes).
     */
    _default() {
        this._clearError();
        this._curId = undefined;
        this._nameInput.value = "";
        this._descriptionTxt.value = "";
        this._dueDatePick.value = new Date().toISOString().substring(0, 10); // today
        this._prioRadio.querySelector('input[value="3"]').checked = true;
        this._doneTick.checked = false;
    }

    /**
     * Set default values for note, as currently stored on the backend ("undo" all changes).
     * Use default values for new note.
     */
    async _reset() {
        this._clearError();
        const note = await TodoService.getNoteById(this._curId);
        if (note) {
            this._nameInput.value = note.name;
            this._descriptionTxt.value = note.description;
            this._dueDatePick.value = new Date(note.dueDate).toISOString().substring(0, 10);
            this._prioRadio.querySelector(`input[value="${note.priority}"]`).checked = true;
            this._doneTick.checked = note.done;
            this._creationTime = note.creationTime; // creation time is not changed by update
        } else {
            this._default(); // no entry found, note is new or got deleted in the meantime
        }
    }

    /**
     * Save note on backend storage.
     */
    async _save() {
        const note = {};
        note.name = this._nameInput.value;
        note.description = this._descriptionTxt.value;
        note.dueDate = new Date(this._dueDatePick.value).getTime();
        note.done = this._doneTick.checked;
        this._prioRadio.querySelectorAll('input').forEach((radio) => {
                if (radio.checked) note.priority = radio.value;});
        if (this._curId) {
            note._id = this._curId; // existing note: ID already assigned
            note.creationTime = this._creationTime;  // existing note: creation time is not changed by update
            const rev = await TodoService.updateNote(note);
            this._mainCtrl.setRevision(rev);  // new revision, caused by update
        } else {
            note.creationTime = new Date().getTime(); // new note: creation is now
            const rev = await TodoService.addNote(note);
            this._mainCtrl.setRevision(rev);  // new revision, caused by add
        }
    }

    /**
     * Terminate edit and change back to list view.
     */
    _finish() {
        this._mainCtrl.displayListView();
    }

    init() {
        this._nameInput.addEventListener('change', (event) => { this._onNameChange(event); });
        this._nameInput.addEventListener('blur', (event) => { this._onBlur(event) });
        this._resetBtn.addEventListener('click', (event) => { this._onResetClick(event); });
        this._abortBtn.addEventListener('click', (event) => { this._onAbortClick(event); });
        this._saveBtn.addEventListener('click', (event) => { this._onSaveClick(event); });
        this.hide();
    }

    /**
     * Hide edit view (itself).
     */
    hide() {
        this._itemEditContainer.style.display = 'none';
    }

    /**
     * Show edit view (itself).
     * Either update note (given by ID) or create new note (no ID given).
     */
    async display(id = undefined) {
        try {
            this._curId = id;
            if (id)
                await this._reset(); // existing note
            else
                this._default(); // new note
            this._itemEditContainer.style.display = 'block';
            this._nameInput.focus();
        } catch (err) {
            this._mainCtrl.screech("Could not display note", err);
        }
    }
}