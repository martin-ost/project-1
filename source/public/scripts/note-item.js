export default class NoteItem {
    constructor(id, name, creationDate, dueDate, done, priority, description) {
        this.id = id;
        this.name = name;
        this.creationDate = creationDate;
        this.dueDate = dueDate;
        this.done = done;
        this.priority = priority;
        this.description = description;
    }
}