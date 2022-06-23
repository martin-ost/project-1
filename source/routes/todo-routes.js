/**
 * @file CAS FEE 2022 / Project 1 / Backend:  Express Router
 * @author Martin Frey <martin.frey@ost.ch>
 */

import express from 'express';
import { todoController } from "../controllers/todo-controller.js";

/* Register all RestAPI requests with the express router. */
const router = express.Router();
router.get("/revision/", todoController.getRevision);
router.post("/notes/", todoController.addNote);
router.put("/notes/", todoController.updateNote);
router.get("/notes/", todoController.getNotes);
router.get("/notes/:id/", todoController.getNoteById);
router.delete("/notes/:id/", todoController.deleteNote);

export const todoRoutes = router;