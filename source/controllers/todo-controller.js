/* eslint-disable import/prefer-default-export */

import { todoStore } from '../services/todo-store.js'

class TodoController {
    constructor(store) {
        this.getState = async (req, res) => {
            res.json(await store.state());
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
            res.json(await store.delete(req.params.id)); // TODO should return 402 if not ok
        };
    }
}

export const todoController = new TodoController(todoStore);
