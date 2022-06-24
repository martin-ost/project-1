/**
 * @file CAS FEE 2022 / Project 1 / Frontend: Item-List View
 * @author Martin Frey <martin.frey@ost.ch>
 */

/**
 * The ItemListView class is used by the controller to render the given notes.
 * It is based on the Handlebars template engine (minimal but runs on steroids).
 *
 * - https://handlebarsjs.com/
 */
export default class TodoItemListView {

    constructor() {
        this._itemListContainer = document.querySelector('[data-id="todo-item-list-container"]');
        // eslint-disable-next-line no-undef
        this._itemListTemplateCompiled = Handlebars.compile(
            document.querySelector('[data-id="todo-item-list-template"]').innerHTML);
    }

    /**
     * Format creation time (Unix UTC timestamp) into a local display string (dd/mm/yyyy).
     */
    static _getCreationTimeView(creationTime) {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
        return new Date(creationTime).toLocaleDateString('de-CH', options);
    }

    /**
     * Format the due date (Unix UTC timestamp) into a display string.
     * The display string reflects a relative time: "before x days", "yesterday", "today", "tomorrow" and "in x days".
     */
    static _getDueDateView(date) {
        const milliSecsPerDay = 1000*60*60*24;
        const days = Math.ceil((date - new Date().getTime()) / milliSecsPerDay);
        switch (true) {
            case (days === 1):
                return "Morgen";
            case (days === -1):
                return "Gestern";
            case (days > 0):
                return `in ${days} Tagen`;
            case (days < 0):
                return `vor ${Math.abs(days)} Tagen`;
            default:
                return "Heute";
        }
    }

    /**
     * Format the priority into a display string, using "↯" characters according to the priority number.
     */
    static _getPriorityView(priority) {
        return "↯".repeat(priority);
    }

    /**
     * Install the above formatting methods as Handlebars helper functions.
     */
    // eslint-disable-next-line class-methods-use-this
    init() {
        // eslint-disable-next-line no-undef
        Handlebars.registerHelper('print_due_date', (date) => TodoItemListView._getDueDateView(date));
        // eslint-disable-next-line no-undef
        Handlebars.registerHelper('print_priority', (priority) => TodoItemListView._getPriorityView(priority));
        // eslint-disable-next-line no-undef
        Handlebars.registerHelper('print_creation_time', (time) => TodoItemListView._getCreationTimeView(time));
    }

    /**
     * Render notes to HTML and insert it to the right place in the DOM (item list container).
     */
    render(notes) {
        this._itemListContainer.innerHTML = this._itemListTemplateCompiled(notes);
    }
}