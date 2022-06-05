import { TodoService } from './service/todo-service.js';
import { testNotes } from "./test/todo-test-data.js";
import { TodoMainController } from './controller/todo-main-controller.js';

const store = new TodoService();
testNotes.map(n => store.addNote(n));

new TodoMainController(store).init();