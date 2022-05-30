import Note from './todo-note-item.js';
import todoStore from './todo-service.js';

class TodoController {
    constructor() {
        this.listView = document.querySelector('.todo-list-view');
        this.editView = document.querySelector('.todo-edit-view');

        this.headerTheme = document.querySelector('.todo-header-theme');
        // todo: icons
        this.headerThemeIcon = document.querySelector('.todo-header-theme .todo-button img');
        this.headerInfo = document.querySelector('.todo-header-info');

        // todo: use setter and getter for theme, also use enum
        this.theme = "light"; // "light", "dark"

        this.actionBarSort = document.querySelector('.todo-action-bar-sort');
        this.actionBarDirection = document.querySelector('.todo-action-bar-direction button');
        this.actionBarFilter = document.querySelector('.todo-action-bar-filter');
        this.actionBarAdd = document.querySelector('.todo-action-bar-add');

        // todo: use enums
        this.sortCriteria = "priority"; // "priority", "due-date", "name", "creation-date"
        this.sortDirection = "ascending"; // "ascending", "descending"
        this.filterCriteria = "all"; // "all", "not-done", "over-due"

        this.itemListContainer = document.querySelector('.todo-item-list-container');
        this.itemListTemplateCompiled = Handlebars.compile(document.getElementById(
            'todo-item-list-template').innerHTML);

        this.id = 0;
        this.creationTime = 0; // creation time is not changed on update message
        this.editName = document.querySelector('.todo-edit-item-name input');
        this.editDescription = document.querySelector('.todo-edit-item-description textarea');
        this.editDueDate = document.querySelector('.todo-edit-item-due-date input');
        this.editPriority = document.querySelector('.todo-edit-item-priority');
        this.editDone = document.querySelector('.todo-edit-item-done input');

        this.editActions = document.querySelector('.todo-edit-item-actions');
    }

    initialize() {
        todoStore.initWithTestData();
        this.initEventHandlers();
        this.setTheme("light");
        this.setSortDirection("ascending");
        this.displayListView();
    }

    initEventHandlers() {
        // todo: one event listener, use data to specify action
        this.headerTheme.addEventListener(
            'click', (event) => { this.onThemeClick(event); });
        this.headerInfo.addEventListener(
            'click', (event) => { this.onInfoClick(event); });

        // todo: one event listener, use data to specify, possible to add more than one event type (check)?
        this.actionBarSort.addEventListener(
            'change', (event) => { this.onActionBarSortChange(event); });
        this.actionBarDirection.addEventListener(
            'click', (event) => { this.onActionBarDirectionClick(event); });
        this.actionBarFilter.addEventListener(
            'change', (event) => { this.onActionBarFilterChange(event); });
        this.actionBarAdd.addEventListener(
            'click', (event) => { this.onActionBarAddClick(event); });

        this.itemListContainer.addEventListener(
            'click', (event) => { this.onItemClick(event); });
        this.itemListContainer.addEventListener(
            'change', (event) => { this.onItemChange(event); });

        this.editActions.addEventListener(
            'click', (event) => { this.onEditAction(event); });
    }

    onThemeClick(event) {
        window.console.log("toggle-theme");
        if (this.theme === "light" ) {
            window.console.log("light -> dark");
            this.setTheme("dark");
        } else {
            window.console.log("dark -> light");
            this.setTheme("light");
        }
    }

    onInfoClick(event) {
        window.console.log("show-info");
        // todo: implement info view
        this.displayListView()
    }

    onActionBarSortChange(event) {
        window.console.log("sort-change", event.target.value);
        this.sortCriteria = event.target.value;
        this.setSortDirection(this.sortDirection);
        this.renderItemListView();
    }

    onActionBarDirectionClick(event) {
        window.console.log("toggle-sort-direction");
        if (this.sortDirection === "ascending") {
            this.setSortDirection("descending");
        } else {
            this.setSortDirection("ascending");
        }
        this.renderItemListView();
    }

    onActionBarFilterChange(event) {
        window.console.log("filter-change", event.target.value);
        this.filterCriteria = event.target.value;
        this.renderItemListView();
    }

    onActionBarAddClick(event) {
        window.console.log("add-item");
        this.displayEditView()
    }

    onItemClick(event) {
        if (event.target.dataset.click === 'edit') {
            this.editItem(parseInt(event.target.id.split("-")[1],10));
        } else if (event.target.dataset.click === 'delete') {
            this.deleteItem(parseInt(event.target.id.split("-")[1],10));
        }
    }

    onItemChange(event) {
        if (event.target.dataset.change === 'done') {
            this.setItemDone(parseInt(event.target.id.split("-")[1],10));
        }
    }

    onEditAction(event) {
        // use data to get action
        if (event.target.id === 'todo-edit-save') {
            window.console.log("edit - save");
            this.saveEditView();
        } else if (event.target.id === 'todo-edit-chancel') {
            window.console.log("edit - chancel");
            this.displayListView();
        } else if (event.target.id === 'todo-edit-reset') {
            window.console.log("edit - reset");
            this.resetEditView()
        }
    }

    setItemDone(id) {
        window.console.log("set done", id);
        const note = todoStore.getNoteById(id);
        note.done = true;
        todoStore.updateNote(note);
        this.displayListView();
    }

    editItem(id) {
        window.console.log("edit:", id);
        this.displayEditView(id);
    }

    deleteItem(id) {
        window.console.log("delete:", id);
        todoStore.deleteNoteById(id);
        this.displayListView();
    }

    setTheme(theme) {
        window.console.log("setTheme:", theme)
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
    }

    setSortDirection(direction) {
        // todo: use map to get direction text
        if (direction === "ascending") {
            if (this.sortCriteria === "priority")
                this.actionBarDirection.textContent = "Dringend";
            else if (this.sortCriteria=== "name")
                this.actionBarDirection.textContent = "A...Z";
            else if (this.sortCriteria=== "creation-date")
                this.actionBarDirection.textContent = "Neu";
            else
                this.actionBarDirection.textContent = "Zuerst";
            this.sortDirection = "ascending";
        } else {
            if (this.sortCriteria === "priority")
                this.actionBarDirection.textContent = "Egal";
            else if (this.sortCriteria=== "name")
                this.actionBarDirection.textContent = "Z...A";
            else if (this.sortCriteria=== "creation-date")
                this.actionBarDirection.textContent = "Alt";
            else
                this.actionBarDirection.textContent = "Zuletzt";
            this.sortDirection = "descending";
        }
    }

    displayListView() {
        window.console.log("display list view");
        this.renderItemListView();
        this.editView.style.display = "none";
        this.listView.style.display = "block";
    }

    displayEditView(id=0) {
        window.console.log("display edit view", id)
        this.listView.style.display = "none";
        this.editView.style.display = "block";
        this.id = id;
        this.resetEditView();
    }

    saveEditView() {
        const note = new Note();
        note.id = this.id;
        note.name = this.editName.value;
        note.description = this.editDescription.value;
        note.dueDate = new Date(this.editDueDate.value).getTime();
        note.done = this.editDone.checked;
        this.editPriority.querySelectorAll('input').forEach( (radio) => {
            if (radio.checked) {
                note.priority = radio.value;
            }
        });
        if (this.id === 0) {
            note.creationTime = new Date().getTime(); // new note: creation is now
            todoStore.addNote(note);
        } else {
            note.creationTime = this.creationTime;  // existing note: creation time is not changed by update
            todoStore.updateNote(note)
        }
        this.displayListView();
    }

    resetEditView() {
        if (this.id === 0) {
            // default settings
            this.editName.value = "";
            this.editDescription.value = "";
            this.editDueDate.value = new Date().toISOString().substring(0, 10);
            this.editPriority.querySelector('input[value="3"]').checked = true;
            this.editDone.checked = false;
        } else {
            const note = todoStore.getNoteById(this.id);
            this.editName.value = note.name ;
            this.editDescription.value = note.description;
            this.editDueDate.value = new Date(note.dueDate).toISOString().substring(0,10);
            this.editPriority.querySelector(`input[value="${note.priority}"]`).checked = true;
            this.editDone.checked = note.done;
            this.creationTime = note.creationTime; // creation time is not changed by update
        }
    }

    formatCreationTime(creationTime) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(creationTime).toLocaleDateString('de-CH', options);
    }

    formatDueDate(dueDate) {
        const milliSecsPerDay = 1000*60*60*24;
        const now = new Date().getTime();
        const days = Math.floor((now-dueDate)/milliSecsPerDay);

        let result = "";
        if (days === 0)
            result = "Heute";
        else if (days === 1)
            result = "Morgen";
        else if (days === -1)
            result = "Gestern";
        else if (days < 0)
            result = `in ${Math.abs(days)} Tagen`;
        else if (days > 0)
            result = `vor ${days} Tagen`;

        return result;
    }

    formatPriority(priority) {
        return "↯".repeat(priority);
    }

    formatItem(note) {
        window.console.log(note);
        note.creationDateView = this.formatCreationTime(note.creationTime);
        note.dueDateView = this.formatDueDate(note.dueDate);
        note.priorityView = this.formatPriority(note.priority);
    }

    renderItemListView() {
        window.console.log("renderItemListView:", this.sortCriteria, this.sortDirection, this.filterCriteria)
        const notes = todoStore.getNotes(this.sortCriteria, this.sortDirection, this.filterCriteria);
        notes.map(n => this.formatItem(n));
        this.itemListContainer.innerHTML = this.itemListTemplateCompiled(notes);
    }

}

const controller = new TodoController();
controller.initialize();