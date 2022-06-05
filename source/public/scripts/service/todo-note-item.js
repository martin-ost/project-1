/* eslint-disable import/prefer-default-export */

export class Note {
    constructor(id, name, creationTime, dueDate, done, priority, description) {
        this.id = id;
        this.name = name;
        this.creationTime = creationTime;
        this.dueDate = dueDate;
        this.done = done;
        this.priority = priority;
        this.description = description;
    }

    copy() {
        return new Note(this.id, this.name, this.creationTime, this.dueDate, this.done, this.priority,
            this.description);
    }
}