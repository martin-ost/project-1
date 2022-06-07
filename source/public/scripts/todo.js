// TODO:
// - Rework HTML/CSS, using Google guidelines.
// - Check color schema for date picker, radio buttons and tick box.
// - Implement info view.
// - Keyboard navigation does not work for SVG "buttons"
// - How to locally install Handlebars, manually copy? Directly use NPM repository?
// - Locally install fonts (.woff2).
// - Rename item-list-controller to item-list-view.
// - Dynamically generate selection lists (sort, filter) with Handlebars.
// - What is teh problem with the function maps for filter and sort?
// - Test on different browsers/platforms.
// - Configure ESLint.
// - How to set tags in Github?
// - Add class diagram to README.md.
// - Confirmation box before deleting an item (as modal window).
// - Check js code according to Google guidelines.
// - How to define Handlebars in js code?
// - Use "normalize.css" (or "reset.css", http://web.simmons.edu/~grovesd/comm244/notes/week4/css-reset).
// - Rethink use validity for name label.

import { TodoService } from './service/todo-service.js';
import { testNotes } from "./test/todo-test-data.js";
import { TodoMainController } from './controller/todo-main-controller.js';

const store = new TodoService();
testNotes.map(n => store.addNote(n));

new TodoMainController(store).init();