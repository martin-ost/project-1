/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

import { TodoListController } from './todo-list-controller.js';
import { TodoEditController } from './todo-edit-controller.js';

export class TodoMainController {

    constructor() {
        this._listCtrl = new TodoListController(this)
        this._editCtrl = new TodoEditController(this);
        this._curCtrl = undefined;

        this._themeBtn = document.querySelector ('[data-id="todo-btn-theme"]');
        this._infoBtn = document.querySelector ('[data-id="todo-btn-info"]');

        this._curTheme = undefined; // this._listCtrl
    }

    _onThemeClick() {
        if (this._curTheme === 'light')
            this._setTheme('dark');
        else
            this._setTheme('light');
    }

    // eslint-disable-next-line class-methods-use-this
    _onInfoClick() {
        // todo: implement info view
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

        this._curCtrl = this._listCtrl; // remove
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
        window.console.log(msg, err);
    }
}

