/* eslint-disable import/prefer-default-export */

import { todoStore } from '../services/todo-store.js'

class TodoController {
    constructor(store) {
        this.getRevision = async (req, res) => {
            res.json(await store.revision());
        };
        this.addNote = async (req, res) => {
            res.json(await store.add(req.body.note));
        };
        this.updateNote = async (req, res) => {
            res.json(await store.update(req.body.note));
        };
        this.getNotes = async (req, res) => {
            res.json(await store.all(req.query.orderBy, req.query.orderDir, req.query.filterBy));
        };
        this.getNoteById = async (req, res) => {
            res.json(await store.get(req.params.id));
        };
        this.deleteNote = async (req, res) => {
            const result = await store.delete(req.params.id);
            if (result.numDeleted === 0) res.sendStatus(404); // not found
            return res.json(result.revision);
        }
    }
}

export const todoController = new TodoController(todoStore);
