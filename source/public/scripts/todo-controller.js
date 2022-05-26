import todoStore from './todo-service.js';

class TodoController {
    constructor() {
        this.headerTheme = document.querySelector('.todo-header-theme');
        this.headerThemeIcon = document.querySelector('.todo-header-theme .todo-button img');
        this.headerInfo = document.querySelector('.todo-header-info');

        this.actionBarSort = document.querySelector('.todo-action-bar-sort');
        this.actionBarDirection = document.querySelector('.todo-action-bar-direction');
        this.actionBarFilter = document.querySelector('.todo-action-bar-filter');
        this.actionBarAdd = document.querySelector('.todo-action-bar-add');

        this.itemListContainer = document.querySelector('.todo-item-list-container');
        this.itemListTemplateCompiled = Handlebars.compile(document.getElementById(
            'todo-item-list-template').innerHTML);

        this.theme = "light";
    }

    initialize() {
        this.initEventHandlers();
        this.renderTodoItemListView(todoStore.getNotes());
    }

    initEventHandlers() {
        this.headerTheme.addEventListener(
            'click', (event) => { this.onThemeClick(event); }
        );
        this.headerInfo.addEventListener(
            'click', (event) => { this.onInfoClick(event); }
        );
        this.actionBarSort.addEventListener(
            'change', (event) => { this.onActionBarSortChange(event); }
        );
        this.actionBarDirection.addEventListener(
            'click', (event) => { this.onActionBarDirectionClick(event); }
        );
        this.actionBarFilter.addEventListener(
            'change', (event) => { this.onActionBarFilterChange(event); }
        );
        this.actionBarAdd.addEventListener(
            'click', (event) => { this.onActionBarAddClick(event); }
        );
    }

    onThemeClick(event) {
        window.console.log("toggle-theme");
        if (this.theme === "light" ) {
            window.console.log("light -> dark");
            document.documentElement.style.setProperty("--theme-background-color", "black");
            document.documentElement.style.setProperty("--theme-font-normal-color", "lightgray");
            document.documentElement.style.setProperty("--theme-font-action-color", "skyblue");
            document.documentElement.style.setProperty("--theme-font-disabled", "gray");
            document.documentElement.style.setProperty("--theme-button-font-color", "black");
            document.documentElement.style.setProperty("--theme-button-background-color", "skyblue");
            document.documentElement.style.setProperty("--theme-frame-text-box-color","lightgray");
            document.documentElement.style.setProperty("--theme-background-text-box-color", "#3D3838");
            document.documentElement.style.setProperty("--theme-divider-color", "lightgray");
            this.headerThemeIcon.src = "./assets/theme-dark.svg";
            this.theme = "dark";
        } else {
            window.console.log("dark -> light");
            document.documentElement.style.setProperty("--theme-background-color", "white");
            document.documentElement.style.setProperty("--theme-font-normal-color", "black");
            document.documentElement.style.setProperty("--theme-font-action-color", "blue");
            document.documentElement.style.setProperty("--theme-font-disabled", "gray");
            document.documentElement.style.setProperty("--theme-button-font-color", "white");
            document.documentElement.style.setProperty("--theme-button-background-color", "black");
            document.documentElement.style.setProperty("--theme-frame-text-box-color","lightgray");
            document.documentElement.style.setProperty("--theme-background-text-box-color", "white");
            document.documentElement.style.setProperty("--theme-divider-color", "black");
            this.headerThemeIcon.src = "./assets/theme-light.svg";
            this.theme = "light";
        }
    }

    onInfoClick(event) {
        window.console.log("show-info");
        this.displayListView()
    }

    onActionBarSortChange(event) {
        window.console.log("sort-change", event.target.value);
    }

    onActionBarDirectionClick(event) {
        window.console.log("toggle-sort-direction");
    }

    onActionBarAddClick(event) {
        window.console.log("add-item");
        this.displayEditView()
    }

    onActionBarFilterChange(event) {
        window.console.log("filter-change", event.target.value);
    }

    displayListView() {
        this.renderTodoItemListView(todoStore.getNotes());
        document.documentElement.style.setProperty('--display-edit-item', 'none');
        document.documentElement.style.setProperty('--display-overview-actions-bar', 'grid');
        document.documentElement.style.setProperty('--display-overview-item-list', 'grid');
    }

    displayEditView() {
        document.documentElement.style.setProperty('--display-overview-actions-bar', 'none');
        document.documentElement.style.setProperty('--display-overview-item-list', 'none');
        document.documentElement.style.setProperty('--display-edit-item', 'grid');
    }

    renderTodoItemListView(notes) {
        window.console.log(notes)
        this.itemListContainer.innerHTML = this.itemListTemplateCompiled(notes);
    }

}

const controller = new TodoController();
controller.initialize();