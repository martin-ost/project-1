/* eslint-disable no-underscore-dangle,import/prefer-default-export */
import Datastore from 'nedb-promises';

class TodoStore {

    constructor() {
        const _options = { filename: './data/todo-notes.db', autoload: true };
        this._db = new Datastore(_options);
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
        await this._db.insert(note);
        return this._revision++;
    }

    async update(note) {
        await this._db.update({ _id: (note._id) }, {$set: note});
        return this._revision++;
    }

    async delete(id) {
        const num = await this._db.remove({ _id: id }, {});
        if (num !== 0) this._revision++;
        return { revision: this._revision, numDeleted: num };
    }

    async get(id) {
        return this._db.findOne({_id: id});
    }

    async all(orderBy, orderDir, filterBy) {
        return this._db.find(TodoStore._getFilter(filterBy)).sort({[orderBy]:orderDir}).exec();
    }
}

export const todoStore = new TodoStore();
