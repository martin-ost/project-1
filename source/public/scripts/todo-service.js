import Note from './note-item.js';

class TodoService {
    constructor() {
        this.notes = [];

        // Add some dummy notes for testing.

        this.notes[0] = new Note(
            1,
            "Pendenz 1",
            "26.05.2022",
            "Heute",
            false,
            1,
            "description 1");

        this.notes[1] = new Note(
            2,
            "Pendenz 2",
            "26.05.2022",
            "Heute",
            false,
            1,
            "description 2");

        this.notes[2] = new Note(
            3,
            "Pendenz 3",
            "26.05.2022",
            "Heute",
            false,
            1,
            "description 3");

    }

    // Get notes from storage, ordered, and filtered.
    getNotes(orderBy, filterBy) {
        return this.notes;
    }
    // Add note to storage.
    addNote(note)  {
    }

    // Update existing note to storage.
    updateNote(note) {
    }

    // Get specific note from storage, given its id.
    getNoteById(id) {
        return this.notes[0];
    }

    // Remove note from storage, given its id.
    deleteNoteById (id) {
    }
}

// todo: what is this for?
export default new TodoService();