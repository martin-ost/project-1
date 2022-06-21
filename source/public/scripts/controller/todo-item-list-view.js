export default class TodoItemListView {

    constructor() {
        this._itemListContainer = document.querySelector('[data-id="todo-item-list-container"]');
        // eslint-disable-next-line no-undef
        this._itemListTemplateCompiled = Handlebars.compile(
            document.querySelector('[data-id="todo-item-list-template"]').innerHTML);
    }

    static _getCreationTimeView(creationTime) {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
        return new Date(creationTime).toLocaleDateString('de-CH', options);
    }

    static _getDueDateView(date) {
        const milliSecsPerDay = 1000*60*60*24;
        const days = Math.floor((new Date().getTime() - date) / milliSecsPerDay);
        switch (true) {
            case (days === 1):return "Morgen";
            case (days === -1): return "Gestern";
            case (days < 0): return `in ${Math.abs(days)} Tagen`;
            case (days > 0): return `vor ${days} Tagen`;
            default: return "Heute";
        }
    }

    static _getPriorityView(priority) {
        return "↯".repeat(priority);
    }

    // eslint-disable-next-line class-methods-use-this
    init() {
        // eslint-disable-next-line no-undef
        Handlebars.registerHelper('print_due_date',
            (date) => TodoItemListView._getDueDateView(date));
        // eslint-disable-next-line no-undef
        Handlebars.registerHelper('print_priority',
            (priority) => TodoItemListView._getPriorityView(priority));
        // eslint-disable-next-line no-undef
        Handlebars.registerHelper('print_creation_time',
            (time) => TodoItemListView._getCreationTimeView(time));
    }

    render(notes) {
        this._itemListContainer.innerHTML = this._itemListTemplateCompiled(notes);
    }
}