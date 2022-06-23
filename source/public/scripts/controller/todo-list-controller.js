/**
 * @file CAS FEE 2022 / Project 1 / Frontend: List-View Controller
 * @author Martin Frey <martin.frey@ost.ch>
 */

import TodoItemListView from './todo-item-list-view.js';
import TodoService from '../service/todo-service.js';


/**
 * The list view controller class:
 *
 * - controls all UI elements of the list view,
 */
export default class TodoListController {

    constructor(mainCtrl) {
        this._listContainer = document.querySelector('[data-id="todo-list-container"]');
        // Item list.
        this._itemListContainer = document.querySelector('[data-id="todo-item-list-container"]');
        this._itemListCtrl = new TodoItemListView();
        // Action bar UI elements.
        this._sortSel = document.querySelector('[data-id="todo-sel-sort"]');
        this._sortDirBtn = document.querySelector('[data-id="todo-btn-sort-dir"]');
        this._filterSel = document.querySelector('[data-id="todo-sel-filter"]');
        this._addNewBtn = document.querySelector('[data-id="todo-btn-add-new"]');

        this._SortOrder = { // values defined by nedb (MongoDB)
            ASCENDING: '+1',
            DESCENDING: '-1'
        };
        this._sort2DirAscendingTxt = new Map([
            ['priority', "Dringend..."],
            ['name', "Z...A"],
            ['creationTime', "Neu..."],
            ['dueDate', "Zuletzt..."]]);
        this._sort2DirDescendingTxt = new Map([
            ['priority', "Egal..."],
            ['name', "A...Z"],
            ['creationTime', "Alt..."],
            ['dueDate', "Zuerst..."]]);
        this._curSortDir = this._SortOrder.ASCENDING;

        this._mainCtrl = mainCtrl;
    }

    /**
     * Set sort direction, depending on current sort criteria setting.
     */
    _setSortDir() {
        if (this._curSortDir === this._SortOrder.ASCENDING) {
            // noinspection JSValidateTypes
            this._sortDirBtn.textContent = this._sort2DirAscendingTxt.get(this._sortSel.value);
            this._curSortDir = this._SortOrder.DESCENDING;
        } else {
            // noinspection JSValidateTypes
            this._sortDirBtn.textContent = this._sort2DirDescendingTxt.get(this._sortSel.value);
            this._curSortDir = this._SortOrder.ASCENDING;
        }
    }

    /**
     * Re-render item list view since sort criteria changed.
     * Callback for sort criteria selector.
     */
    _onSortChange() {
        this._setSortDir(); // direction text depends on sort criteria
        this.render();
    }

    /**
     * Re-render item list view since sort direction changed.
     * Callback for sort direction button.
     */
    _onSortDirClick() {
        this._setSortDir(); // direction text depends on sort criteria
        this.render();
    }

    /**
     * Re-render item list since filter criteria changed.
     * Callback for filter criteria selector.
     */
    _onFilterChange() {
        this.render();
    }

    /**
     * Change to edit view to edit a new note.
     * Callback for add button.
     */
    _onAddNewClick() {
        this._mainCtrl.displayEditView();
    }

    /**
     * Edit or delete item.
     * On delete, remove item on backend as well and re-render item list view.
     * Callback for edit and delete button of an item, that is part of the item list.
     */
    async _onItemClick(event) {
        try {
            if (event.target.dataset.click === 'edit') {
                this._mainCtrl.displayEditView(event.target.dataset.id);
            } else if (event.target.dataset.click === 'delete') {
                const rev = await TodoService.deleteNoteById(event.target.dataset.id);
                this._mainCtrl.setRevision(rev);
                this.render();
            }
        } catch (err) {
            this._mainCtrl.screech("Could not delete note", err);
        }
    }

    /**
     * Set note to "done", save new state on backend and re-render item list view.
     */
    async _onDoneChange(event) {
        try {
            await TodoService.updateNote({_id: event.target.dataset.id, done: true});
            this.render();
        } catch (err) {
            this._mainCtrl.screech("Could not update note", err);
        }
    }

    init() {
        this._sortSel.addEventListener('change', (event) => { this._onSortChange(event); });
        this._sortDirBtn.addEventListener('click', (event) => { this._onSortDirClick(event); });
        this._filterSel.addEventListener('change', (event) => { this._onFilterChange(event); });
        this._addNewBtn.addEventListener('click', (event) => { this._onAddNewClick(event); });
        this._itemListContainer.addEventListener('click', (event) => { this._onItemClick(event); });
        this._itemListContainer.addEventListener('change', (event) => { this._onDoneChange(event); });
        this._itemListCtrl.init();
        this._setSortDir();
        this.display()
    }

    /**
     * Render item list view.
     * Also updates the open issue counter with the main view.
     */
    async render() {
        try {
            const notes = await TodoService.getNotes(this._sortSel.value, this._curSortDir, this._filterSel.value);
            this._itemListCtrl.render(notes);
            let cnt = 0; notes.forEach(n => {if (!n.done) ++cnt; });
            this._mainCtrl.updateOpenIssueCounter(cnt);
        } catch(err) {
            this._mainCtrl.screech("Could not get notes", err);
        }
    }

    /**
     * Hide list view (itself).
     */
    hide() {
        this._listContainer.style.display = 'none';
    }

    /**
     * Show list view (itself).
     * Either update note (given by ID) or create new note (no ID given).
     */
    display() {
        this.render();
        this._listContainer.style.display = 'block';
    }
}

