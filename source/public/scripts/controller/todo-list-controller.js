/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import { TodoItemListController } from './todo-item-list-controller.js';

export class TodoListController {
    constructor(store, mainCtrl) {
        this._store = store;
        this._mainCtrl = mainCtrl;

        this._listContainer = document.querySelector('[data-id="todo-list-container"]');
        this._itemListContainer = document.querySelector('[data-id="todo-item-list-container"]');
        this._itemListCtrl = new TodoItemListController(store);
        this._sortSel = document.querySelector('[data-id="todo-sel-sort"]');
        this._sortDirBtn = document.querySelector('[data-id="todo-btn-sort-dir"]');
        this._filterSel = document.querySelector('[data-id="todo-sel-filter"]');
        this._addNewBtn = document.querySelector('[data-id="todo-btn-add-new"]');

        this._curSortDir = 'ascending';
        this._sort2DirAscendingTxt = new Map([
            ['priority', "Dringend..."],
            ['name', "A...Z"],
            ['creation-date', "Neu..."],
            ['due-date', "Zuerst..."]]);
        this._sort2DirDescendingTxt = new Map([
            ['priority', "Egal..."],
            ['name', "Z...A"],
            ['creation-date', "Alt..."],
            ['due-date', "Zuletzt..."]]);
    }

    _onSortChange() {
        this._setSortDir(); // direction text depends on sort criteria
        this._render();
    }

    _onSortDirClick() {
        this._setSortDir();
        this._render();
    }

    _onFilterChange() {
        this._render();
    }

    _onAddNewClick() {
        this._mainCtrl.displayEditView();
    }

    _onItemClick(event) {
        if (event.target.dataset.click === 'edit') {
            this._mainCtrl.displayEditView(event.target.dataset.id);
        } else if (event.target.dataset.click === 'delete') {
            this._store.deleteNoteById(event.target.dataset.id);
            this._render();
        }
    }

    _onDoneChange(event) {
        const note = this._store.getNoteById(event.target.dataset.id);
        note.done = true;
        this._store.updateNote(note);
        this._render();
    }

    _setSortDir() {
        if (this._curSortDir === 'ascending') {
            this._sortDirBtn.textContent = this._sort2DirAscendingTxt.get(this._sortSel.value);
            this._curSortDir = 'descending';
        } else {
            this._sortDirBtn.textContent = this._sort2DirDescendingTxt.get(this._sortSel.value);
            this._curSortDir = 'ascending';
        }
    }

    _render() {
        const notes = this._store.getNotes(this._sortSel.value, this._curSortDir, this._filterSel.value);
        this._itemListCtrl.render(notes);
    }

    init() {
        this._sortSel.addEventListener(
            'change', (event) => { this._onSortChange(event); });
        this._sortDirBtn.addEventListener(
            'click', (event) => { this._onSortDirClick(event); });
        this._filterSel.addEventListener(
            'change', (event) => { this._onFilterChange(event); });
        this._addNewBtn.addEventListener(
            'click', (event) => { this._onAddNewClick(event); });

        this._itemListContainer.addEventListener(
            'click', (event) => { this._onItemClick(event); });
        this._itemListContainer.addEventListener(
            'change', (event) => { this._onDoneChange(event); });

        this._itemListCtrl.init();
        this._setSortDir();
        this.display()
    }

    hide() {
        this._listContainer.style.display = 'none';
    }

    display() {
        this._render();
        this._listContainer.style.display = 'block';
    }
}

