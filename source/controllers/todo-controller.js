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
                res.status(500).json("DB failure when adding new note");
            }
        };

        this.updateNote = async (req, res) => {
            try {
                res.json(await store.update(req.body.note));
            } catch(err) {
                res.status(500).json("DB failure when retrieving notes");
            }
        };

        this.getNotes = async (req, res) => {
            try {
                res.json(await store.all(req.query.orderBy, req.query.orderDir, req.query.filterBy));
            } catch(err) {
                res.status(500).json("DB failure when retrieving notes");
            }
        };

        this.getNoteById = async (req, res) => {
            try {
                res.json(await store.get(req.params.id));
            } catch(err) {
                res.status(500).json("DB failure when retrieving note");
            }
        };

        this.deleteNote = async (req, res) => {
            try {
                const result = await store.delete(req.params.id);
                if (result.numDeleted === 0)
                    res.status(404).json("Note not found");
                else
                    res.status(202).json(result.revision); // accepted, but note is just marked as deleted in db-file.
            } catch(err) {
                res.status(500).json("DB failure when deleting note");
            }
        };
    }
}

export const todoController = new TodoController(todoStore);