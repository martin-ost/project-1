/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import { TodoItemListView } from './todo-item-list-view.js';

export class TodoListController {
    constructor(store, mainCtrl) {
        this._store = store;
        this._mainCtrl = mainCtrl;

        this._listContainer = document.querySelector('[data-id="todo-list-container"]');
        this._itemListContainer = document.querySelector('[data-id="todo-item-list-container"]');
        this._itemListCtrl = new TodoItemListView(store);
        this._sortSel = document.querySelector('[data-id="todo-sel-sort"]');
        this._sortDirBtn = document.querySelector('[data-id="todo-btn-sort-dir"]');
        this._filterSel = document.querySelector('[data-id="todo-sel-filter"]');
        this._addNewBtn = document.querySelector('[data-id="todo-btn-add-new"]');

        this._curSortDir = '+1';
        this._sort2DirDescendingTxt = new Map([
            ['priority', "Dringend..."],
            ['name', "A...Z"],
            ['creationTime', "Neu..."],
            ['dueDate', "Zuerst..."]]);
        this._sort2DirAscendingTxt = new Map([
            ['priority', "Egal..."],
            ['name', "Z...A"],
            ['creationTime', "Alt..."],
            ['dueDate', "Zuletzt..."]]);
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

    async _onItemClick(event) {
        if (event.target.dataset.click === 'edit') {
            this._mainCtrl.displayEditView(event.target.dataset.id);
        } else if (event.target.dataset.click === 'delete') {
            await this._store.deleteNoteById(event.target.dataset.id);
            this._render();
        }
    }

    async _onDoneChange(event) {
        await this._store.updateNote({_id: event.target.dataset.id, done: true});
        this._render();
    }

    _setSortDir() {
        if (this._curSortDir === '+1') {
            this._sortDirBtn.textContent = this._sort2DirAscendingTxt.get(this._sortSel.value);
            this._curSortDir = '-1';
        } else {
            this._sortDirBtn.textContent = this._sort2DirDescendingTxt.get(this._sortSel.value);
            this._curSortDir = '+1';
        }
    }

    async _render() {
        this._itemListCtrl.render(
            await this._store.getNotes(this._sortSel.value, this._curSortDir, this._filterSel.value));
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

