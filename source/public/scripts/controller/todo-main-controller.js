/**
 * @file CAS FEE 2022 / Project 1 / Frontend: Main Controller
 * @author Martin Frey <martin.frey@ost.ch>
 */

import TodoListController from './todo-list-controller.js';
import TodoEditController from './todo-edit-controller.js';
import TodoService from '../service/todo-service.js';

/**
 * The main controller class:
 *
 * - controls all UI elements of the header, info dialog and footer,
 * - handles the other controllers (list view, edit view),
 * - periodically checks backend storage for data updates,
 * - and provides handler for fatal errors (error view).
 */
export default class TodoMainController {

    constructor() {
        this._listCtrl = new TodoListController(this)
        this._editCtrl = new TodoEditController(this);
        this._curCtrl = undefined;

        // Header UI elements.
        this._themeBtn = document.querySelector ('[data-id="todo-btn-theme"]');
        this._infoOpenBtn = document.querySelector ('[data-id="todo-btn-open-info"]');
        this._infoDlg = document.querySelector ('[data-id="todo-info-container"]');
        this._infoCloseBtn = document.querySelector ('[data-id="todo-btn-close-info"]');
        this._headerContainer = document.querySelector ('[data-id="todo-header-container"]');
        // Footer UI elements.
        this._footerContainer = document.querySelector ('[data-id="todo-footer-container"]');
        this._issueCntrText = document.querySelector ('[data-id="todo-text-issue-counter"]');
        // Error view.
        this._errorContainer = document.querySelector ('[data-id="todo-system-failure-container"]');

        this._curCtrl = this._listCtrl;
        this._curTheme = undefined;
        this._curRev = undefined;
        this._revisionCheckHdlr = undefined;
        this._REVISION_CHECK_INTERVAL_MSEC = 1000;
        this._errorContainer.style.display = 'none';
    }

    /**
     * Toggle theme, "light" or "dark".
     * Callback for header theme selection button.
     */
    _onThemeClick() {
        if (this._curTheme === 'light')
            this._setTheme('dark');
        else
            this._setTheme('light');
    }

    _setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this._curTheme = theme;
    }

    /**
     * Display info dialog.
     * Callback for info header button.
     */
    _onInfoOpenClick() {
        this._infoDlg.showModal();
    }

    /**
     * Close info dialog.
     * Callback of info dialog close button.
     */
    _onInfoCloseClick() {
        this._infoDlg.close();
    }

    /**
     * Check revision of the data storage for modifications.
     * On any modification of the data storage it instructs the list controller to update its view.
     * This methode is registered and periodically call-backed by an intervall handler.
     */
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
        this._themeBtn.addEventListener('click', (event) => { this._onThemeClick(event); });
        this._infoOpenBtn.addEventListener('click', (event) => { this._onInfoOpenClick(event); });
        this._infoCloseBtn.addEventListener('click', (event) => { this._onInfoCloseClick(event); });
        this._revisionCheckHdlr = setInterval(() => { this._checkRevision() }, this._REVISION_CHECK_INTERVAL_MSEC);
        this._editCtrl.init();
        this._listCtrl.init();
        this._setTheme('light');
        this.displayListView();
    }

    /**
     * Update the number of open issues (ie. "not-done").
     */
    updateOpenIssueCounter(cnt) {
        this._issueCntrText.textContent = `Offene Pendenzen: ${cnt}`;
    }

    /**
     * Update the revision of data storage.
     * Is called by other views to signal any own change of the data storage and allows to avoid unnecessary
     * access to the storage.
     */
    setRevision(rev) {
        this._curRev = rev;
    }

    /**
     * Display list view.
     * Is called by the other views, according to user request, e.g. in edit view, user saves or cancels and changes
     * back to list view.
     */
    displayListView() {
        this._curCtrl.hide();
        this._curCtrl = this._listCtrl;
        this._listCtrl.display()
    }

    /**
     * Display edit view.
     * Is called by the other views, according to user request, (e.g. in list view, user adds or updates note and
     * changes to edit view.
     */
    displayEditView(id=undefined) {
        this._curCtrl.hide();
        this._curCtrl = this._editCtrl;
        this._editCtrl.display(id)
    }

    /**
     *  Display fatal error and stop execution.
     *  App is stopped by throwing an exception (catched outside of app).
     */
    screech(msg, err) {
        clearInterval(this._revisionCheckHdlr);
        this._curCtrl.hide();
        this._infoDlg.close();
        this._headerContainer.style.display = 'none';
        this._footerContainer.style.display = 'none';
        this._errorContainer.style.display = 'grid';
        console.error(`${msg}:${err}`);
        throw new Error("Something went badly wrong!");
    }
}
