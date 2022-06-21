import TodoListController from './todo-list-controller.js';
import TodoEditController from './todo-edit-controller.js';
import TodoService from '../service/todo-service.js';

export default class TodoMainController {

    constructor() {
        this._listCtrl = new TodoListController(this)
        this._editCtrl = new TodoEditController(this);
        this._curCtrl = undefined;

        this._themeBtn = document.querySelector ('[data-id="todo-btn-theme"]');
        this._infoOpenBtn = document.querySelector ('[data-id="todo-btn-open-info"]');
        this._infoDlg = document.querySelector ('[data-id="todo-info-container"]');
        this._infoCloseBtn = document.querySelector ('[data-id="todo-btn-close-info"]');
        this._headerContainer = document.querySelector ('[data-id="todo-header-container"]');
        this._errorContainer = document.querySelector ('[data-id="todo-system-failure-container"]');
        this._footerContainer = document.querySelector ('[data-id="todo-footer-container"]');
        this._issueCntrText = document.querySelector ('[data-id="todo-text-issue-counter"]');

        this._REVISION_CHECK_INTERVAL_MS = 1000;
        this._curCtrl = undefined;
        this._curTheme = undefined;
        this._curRev = undefined;
        this._revisionCheck = undefined;
        this._errorContainer.style.display = 'none';
    }

    _onThemeClick() {
        if (this._curTheme === 'light')
            this._setTheme('dark');
        else
            this._setTheme('light');
    }

    _onInfoOpenClick() {
        this._infoDlg.showModal();
    }

    _onInfoCloseClick() {
        this._infoDlg.close();
    }

    _setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this._curTheme = theme;
    }

    async _checkRevision() {
        try {
            const revision = await TodoService.getRevision();
            if (this._curRev !== revision) {
                this._curRev = revision;
                await this._listCtrl.render();
            }
        } catch(err) {
            this.screech("Could not get revision.", err);
        }
    }

    init() {
        this._themeBtn.addEventListener(
            'click', (event) => { this._onThemeClick(event); });
        this._infoOpenBtn.addEventListener(
            'click', (event) => { this._onInfoOpenClick(event); });
        this._infoCloseBtn.addEventListener(
            'click', (event) => { this._onInfoCloseClick(event); });
        this._revisionCheck = setInterval(
            () => { this._checkRevision() }, this._REVISION_CHECK_INTERVAL_MS);
        this._editCtrl.init();
        this._listCtrl.init();
        this._curCtrl = this._listCtrl;
        this._setTheme('light');
        this.displayListView();
    }

    updateOpenIssueCounter(cnt) {
        this._issueCntrText.textContent = `Offene Pendenzen: ${cnt}`;
    }

    setRevision(rev) {
        this._curRev = rev;
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

    screech(msg, err) {
        clearInterval(this._revisionCheck);
        this._curCtrl.hide();
        this._headerContainer.style.display = 'none';
        this._footerContainer.style.display = 'none';
        this._errorContainer.style.display = 'grid';
        console.error(`${msg}: ${err}`);
        throw new Error("Something went badly wrong!"); // stop further execution
    }
}
