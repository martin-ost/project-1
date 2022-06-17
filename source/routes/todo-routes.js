import express from 'express';
import { todoController } from "../controllers/todo-controller.js";

const router = express.Router();
router.head("/state/", todoController.getState);
router.post("/notes/", todoController.addNote);
router.put("/notes/", todoController.updateNote);
router.get("/notes/", todoController.getNotes);
router.get("/notes/:id/", todoController.getNoteById);
router.delete("/notes/:id/", todoController.deleteNote);

export const todoRoutes = router;