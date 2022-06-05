/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import { TodoListController } from './todo-list-controller.js';
import { TodoEditController } from './todo-edit-controller.js';

export class TodoMainController {

    constructor(store) {
        this._listCtrl = new TodoListController(store, this)
        this._editCtrl = new TodoEditController(store, this);
        this._curCtrl = undefined;

        this._themeBtn = document.querySelector ('[data-id="todo-btn-theme"]');
        this._infoBtn = document.querySelector ('[data-id="todo-btn-info"]');

        this._curTheme = undefined;
    }

    _onThemeClick() {
        this._toggleTheme();
    }

    // eslint-disable-next-line class-methods-use-this
    _onInfoClick() {
        // todo: implement info view
        window.console.log("info view not implemented yet");
    }

    _toggleTheme() {
        if (this._curTheme === 'light')
            this.setTheme('dark');
        else
            this.setTheme('light');
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this._curTheme = theme;
    }

    init() {
        this._themeBtn.addEventListener('click', (event) => { this._onThemeClick(event); });
        this._infoBtn.addEventListener('click', (event) => { this._onInfoClick(event); });
        this.setTheme('light');
        this._editCtrl.init();
        this._listCtrl.init();
        this._curCtrl = this._listCtrl;
        this.displayListView();
    }

    displayListView() {
        this._curCtrl.hide();
        this._curCtrl = this._listCtrl;
        this._listCtrl.display()
    }

    displayEditView(id=0) {
        this._curCtrl.hide();
        this._curCtrl = this._editCtrl;
        this._editCtrl.display(id)
    }
}

