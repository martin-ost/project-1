/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */

export class TodoService {

    constructor() {
        this.sortCriterias = new Map([
            [ 'priority', (n1,n2) => n2.priority - n1.priority ],
            [ 'name', (n1,n2) => n1.name > n2.name ],
            [ 'creation-date', (n1,n2) => n2.creationTime - n1.creationTime ],
            [ 'due-date', (n1,n2) => n2.dueDate - n1.dueDate ]
        ]);

        this.filterCriterias = new Map([
            [ 'all', () => true ],
            [ 'not-done', (n) => !n.done ],
            [ 'over-due', (n) => n.dueDate > new Date().getTime() ]
        ]);

        // todo: use UUIDs
        this._nextId = 1;
        this._notes = new Map();
    }

    // Get notes as a copy from storage as an array, ordered, and filtered.
    getNotes(orderBy, direction, filterBy) {
        if (!this.sortCriterias.has(orderBy) || !this.filterCriterias.has(filterBy))
            return [];
        const order = this.sortCriterias.get(orderBy);
        const filter = this.filterCriterias.get(filterBy);
        // noinspection JSCheckFunctionSignatures
        const result = ([...this._notes.values()].map(n => n.copy())).sort(order).filter(filter);
        return (direction === 'ascending') ? result : result.reverse();
    }

    // Assign unique ID, copy note, store copy
    addNote(note) {
        const n = note.copy();
        n.id = this._nextId++;
        n.creationDate = new Date().getTime();
        this._notes.set(n.id, n);
        return n.id;
    }

    // Update existing note to storage.
    updateNote(note) {
        const i = parseInt(note.id, 10);
        if ((!this._notes.has(i)) || (i === 0))
            return undefined;
        this._notes.set(i, note.copy());
        return i;
    }

    // Get specific note from storage, given its id.
    getNoteById(id) {
        const i = parseInt(id,10);
        if ((!this._notes.has(i)) || (i === 0))
            return undefined;
        return this._notes.get(i).copy();
    }

    // Remove note from storage, given its id.
    deleteNoteById(id) {
        const i = parseInt(id,10);
        if ((!this._notes.has(i)) || (i === 0))
            return undefined;
        this._notes.delete(i);
        return i;
    }
}