import { todoStore } from '../services/todo-store.js'

class TodoController {
    constructor(store) {
        this.getRevision = async (req, res) => {
            try {
                res.json(await store.revision());
            } catch(err) {
                res.sendStatus(500);
                throw(err);
            }
        };
        this.addNote = async (req, res) => {
            try {
                res.json(await store.add(req.body.note));
            } catch(err) {
                res.sendStatus(500);
                throw(err);
            }
        };
        this.updateNote = async (req, res) => {
            try {
                res.json(await store.update(req.body.note));
            } catch(err) {
                await res.sendStatus(500);
                throw(err);
            }
        };
        this.getNotes = async (req, res) => {
            try {
                res.json(await store.all(req.query.orderBy, req.query.orderDir, req.query.filterBy));
            } catch(err) {
                res.sendStatus(500);
                throw(err);
            }
        };
        this.getNoteById = async (req, res) => {
            try {
                res.json(await store.get(req.params.id));
            } catch(err) {
                res.sendStatus(500);
                throw(err);
            }
        };
        this.deleteNote = async (req, res) => {
            try {
                const result = await store.delete(req.params.id);
                if (result.numDeleted === 0)
                    res.sendStatus(404); // not found
                return res.json(result.revision);
            } catch(err) {
                res.sendStatus(500);
                throw(err);
            }
        };
    }
}

export const todoController = new TodoController(todoStore);