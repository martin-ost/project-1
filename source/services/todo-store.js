/* eslint-disable no-underscore-dangle,import/prefer-default-export */

// https://github.com/bajankristof/nedb-promises
// https://github.com/bajankristof/nedb-promises/blob/master/docs.md
import Datastore from 'nedb-promises';


class TodoStore {

    constructor() {
        const options = { filename: './data/todo-notes.db', autoload: true };
        this.db = new Datastore(options);
        this._revision = 0;
    }

    static _getFilter(criteria) {
        switch (true) {
            case (criteria === 'not-done'):
                return {done:false};
            case (criteria === 'over-due'):
                return { $and: [ {dueDate:{$lt:(new Date().getTime())}}, {done:false}]};
            default:
                return {};
        }
    }

    async revision() {
        return this._revision;
    }

    async add(note) {
        await this.db.insert(note);
        return this._revision++;
    }

    async update(note) {
        await this.db.update({ _id: (note._id) }, {$set: note});
        return this._revision++;
    }

    async delete(id) {
        await this.db.remove({ _id: id });
        return this._revision++;
    }

    async get(id) {
        return this.db.findOne({_id: id});
    }

    async all(orderBy, orderDir, filterBy) {
        return this.db.find(TodoStore._getFilter(filterBy)).sort({[orderBy]:orderDir}).exec();
    }
}

export const todoStore = new TodoStore();
