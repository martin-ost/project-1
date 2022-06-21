import TodoItemListView from './todo-item-list-view.js';
import TodoService from '../service/todo-service.js';

export default class TodoListController {

    constructor(mainCtrl) {
        this._ASCENDING_ORDER = '+1';
        this._DECENDING_ORDER = '-1';
        this._mainCtrl = mainCtrl;

        this._listContainer = document.querySelector('[data-id="todo-list-container"]');
        this._itemListContainer = document.querySelector('[data-id="todo-item-list-container"]');
        this._itemListCtrl = new TodoItemListView();
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
        this.render();
    }

    _onSortDirClick() {
        this._setSortDir();
        this.render();
    }

    _onFilterChange() {
        this.render();
    }

    _onAddNewClick() {
        this._mainCtrl.displayEditView();
    }

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

    async _onDoneChange(event) {
        try {
            await TodoService.updateNote({_id: event.target.dataset.id, done: true});
            this.render();
        } catch (err) {
            this._mainCtrl.screech("Could not update note", err);
        }
    }

    _setSortDir() {
        if (this._curSortDir === this._ASCENDING_ORDER) {
            // noinspection JSValidateTypes
            this._sortDirBtn.textContent = this._sort2DirAscendingTxt.get(this._sortSel.value);
            this._curSortDir = this._DECENDING_ORDER;
        } else {
            // noinspection JSValidateTypes
            this._sortDirBtn.textContent = this._sort2DirDescendingTxt.get(this._sortSel.value);
            this._curSortDir = this._ASCENDING_ORDER;
        }
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

    hide() {
        this._listContainer.style.display = 'none';
    }

    display() {
        this.render();
        this._listContainer.style.display = 'block';
    }
}

