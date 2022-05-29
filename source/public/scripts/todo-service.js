import Note from './todo-note-item.js';

class TodoService {

    sortCriterias = new Map([
        [ "priority", (n1,n2) => n2.priority - n1.priority ],
        [ "name", (n1,n2) => n1.name > n2.name ],
        [ "creation-date", (n1,n2) => n2.creationTime - n1.creationTime ],
        [ "due-date", (n1,n2) => n2.dueDate - n1.dueDate ]
    ]);

    filterCriterias = new Map([
        [ "all", (n) => true ],
        [ "not-done", (n) => !n.done ],
        [ "over-due", (n) => n.dueDate > new Date().getTime() ]
    ]);

    constructor() {
        this.nextId = 1;
        this.notes = new Map();
    }

    // Get notes as a copy from storage as an array, ordered, and filtered.
    getNotes(orderBy, direction, filterBy) {
        const order = this.sortCriterias.get(orderBy);
        const filter = this.filterCriterias.get(filterBy);
        const result = ([...this.notes.values()].map(n => n.copy())).sort(order).filter(filter);
        return (direction === "ascending") ? result : result.reverse();
    }

    // Assign unique ID, copy note, store copy
    addNote(note) {
        const n = note.copy();
        n.id = this.nextId++;
        n.creationDate = new Date().getTime();
        this.notes.set(n.id, n);
        return n.id;
    }

    // Update existing note to storage.
    updateNote(note) {
        if (this.notes.has(note.id)) {
            this.notes.set(note.id, note.copy());
            return note.id;
        }
    }

    // Get specific note from storage, given its id.
    getNoteById(id) {
        if (this.notes.has(id)) {
            return this.notes.get(id).copy();
        }
    }

    // Remove note from storage, given its id.
    deleteNoteById(id) {
        if (this.notes.has(id)) {
            this.notes.delete(id);
        }
    }

    // Add some dummy notes for testing.
    initWithTestData() {
        this.addNote(new Note(
            0,
            "Pendenz 1",
            new Date("2022-04-22").getTime(),
            new Date().getTime(),
            true,
            1,
            "description 1"));

        this.addNote(new Note(
            0,
            "Pendenz 2",
            new Date("2022-04-23").getTime(),
            (new Date().getTime())+(1000*60*60*24),
            false,
            2,
            "description 2"));

        this.addNote(new Note(
            0,
            "Pendenz 3",
            new Date("2022-04-24").getTime(),
            (new Date().getTime())-(1000*60*60*24),
            true,
            3,
            "description 3"));

        this.addNote(new Note(
            0,
            "Pendenz 4",
            new Date("2022-04-25").getTime(),
            (new Date().getTime())+(2*1000*60*60*24),
            false,
            4,
            "description 4 xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx"));

        this.addNote(new Note(
            0,
            "Pendenz 5",
            new Date("2022-04-26").getTime(),
            (new Date().getTime())-(2*1000*60*60*24),
            false,
            5,
            "description 5"));
    }
}

export default new TodoService();