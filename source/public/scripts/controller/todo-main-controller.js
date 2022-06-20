import { TodoListController } from './todo-list-controller.js';
import { TodoEditController } from './todo-edit-controller.js';

export class TodoMainController {

    constructor() {
        this._listCtrl = new TodoListController(this)
        this._editCtrl = new TodoEditController(this);
        this._curCtrl = undefined;

        this._themeBtn = document.querySelector ('[data-id="todo-btn-theme"]');
        this._infoBtn = document.querySelector ('[data-id="todo-btn-info"]');
        this._headerContainer = document.querySelector ('[data-id="todo-header-container"]');
        this._errorContainer = document.querySelector ('[data-id="todo-system-failure-container"]');
        this._footerContainer = document.querySelector ('[data-id="todo-footer-container"]');

        this._curCtrl = undefined;
        this._curTheme = undefined;
        this._errorContainer.style.display = 'none';
    }

    _onThemeClick() {
        if (this._curTheme === 'light')
            this._setTheme('dark');
        else
            this._setTheme('light');
    }

    // eslint-disable-next-line class-methods-use-this
    _onInfoClick() {
        // Todo: implement info view
        window.console.log("info view not implemented yet");
    }

    _setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this._curTheme = theme;
    }

    init() {
        this._themeBtn.addEventListener(
            'click', (event) => { this._onThemeClick(event); });
        this._infoBtn.addEventListener(
            'click', (event) => { this._onInfoClick(event); });

        this._editCtrl.init();
        this._listCtrl.init();
        this._curCtrl = this._listCtrl;

        this._setTheme('light');
        this.displayListView();
    }

    displayListView() {
        this._curCtrl.hide();
        this._curCtrl = this._listCtrl;
        this._listCtrl.display()
    }

    displayEditView(id="") {
        this._curCtrl.hide();
        this._curCtrl = this._editCtrl;
        this._editCtrl.display(id)
    }

    // eslint-disable-next-line class-methods-use-this
    screech(msg, err) {
        this._curCtrl.hide();
        this._headerContainer.style.display = 'none';
        this._footerContainer.style.display = 'none';
        this._errorContainer.style.display = 'grid';
        console.error(`${msg}: ${err}`);
    }
}
