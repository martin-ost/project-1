// TODO:
// - Rework HTML/CSS, using Google guidelines.
// - Check color schema for date picker, radio buttons and tick box.
// - Implement info view, as modal window.
// - Change style for keyboard navigation.
// - How to locally install Handlebars, manually copy? Directly use NPM repository?
// - Locally install fonts (.woff2).
// - Dynamically generate selection lists (sort, filter) with Handlebars.
// - What is the problem with the function maps for filter and sort?
// - Test on different browsers/platforms.
// - Configure ESLint.
// - How to set tags in Github?
// - Add class diagram to README.md.
// - Check js code according to Google guidelines.
// - How to define Handlebars in js code?
// - Rethink use validity for name label.
// - Use '#' instead of '_' for private members
// - Use HTML/CSS Checker

// import { TodoTestService } from './service/todo-test-service.js';
import { TodoService } from './service/todo-service.js';
import { TodoMainController } from './controller/todo-main-controller.js';

const store = new TodoService();
new TodoMainController(store).init();