import { todoStore } from '../services/todo-store.js'

class TodoController {
    constructor(store) {
        this.getRevision = async (req, res) => {
            res.json(await store.revision());
        };
        this.addNote = async (req, res) => {
            try {
                res.json(await store.add(req.body.note));
            } catch(err) {
                res.statusMessage = "DB failure when adding new note.";
                res.sendStatus(500);
            }
        };
        this.updateNote = async (req, res) => {
            try {
                res.json(await store.update(req.body.note));
            } catch(err) {
                res.statusMessage = "DB failure when updating note.";
                res.sendStatus(500);
            }
        };
        this.getNotes = async (req, res) => {
            try {
                res.json(await store.all(req.query.orderBy, req.query.orderDir, req.query.filterBy));
            } catch(err) {
                res.statusMessage = "DB failure when retrieving notes.";
                res.sendStatus(500);
            }
        };
        this.getNoteById = async (req, res) => {
            try {
                res.json(await store.get(req.params.id));
            } catch(err) {
                res.statusMessage = "DB failure when retrieving note.";
                res.sendStatus(500);
            }
        };
        this.deleteNote = async (req, res) => {
            try {
                const result = await store.delete(req.params.id);
                if (result.numDeleted === 0) {
                    res.statusMessage = "Note not found.";
                    res.sendStatus(404);
                } else {
                    res.statusCode = 202; // accepted, but note is just marked as deleted in db-file.
                    res.json(result.revision);
                }
            } catch(err) {
                res.statusMessage = "DB failure when deleting note.";
                res.sendStatus(500);
            }
        };
    }
}

export const todoController = new TodoController(todoStore);