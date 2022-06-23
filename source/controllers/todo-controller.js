/**
 * @file CAS FEE 2022 / Project 1 / Backend: Front Controller
 * @author Martin Frey <martin.frey@ost.ch>
 */

import { todoStore } from '../services/todo-store.js'

/**
 * The front controller class:
 *
 * - receives requests from the frontend (via express framework),
 * - processes them (asking storage),
 * - handles errors,
 * - and returns the result as a response.
 *
 * If the data storage reports an error (exception), the status code of the response is set to 500 and returns an error
 * message, describing the issue in more detail.
 */
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
                    res.status(404).json("Note not found"); // no item found for deletion
                else
                    res.status(202).json(result.revision); // accepted, but note is just marked as deleted in db-file
            } catch(err) {
                res.status(500).json("DB failure when deleting note");
            }
        };
    }
}

export const todoController = new TodoController(todoStore);