/**
 * @file CAS FEE 2022 / Project 1 / Backend:  Express Router
 *
 * Persistent storage uses "nedb", a non-sql database, mostly compatible with MongoDB:
 *
 * - https://github.com/bajankristof/nedb-promises
 * - https://github.com/bajankristof/nedb-promises/blob/master/docs.md
 *
 * @author Martin Frey <martin.frey@ost.ch>
 */

import Datastore from 'nedb-promises';

class TodoStore {

    constructor() {
        // Create directory if it doesn't already exist.
        const _options = { filename: './data/todo-notes.db', autoload: true };
        this._db = new Datastore(_options);
        this._revision = 0; // revision ID is not persistent
    }

    /**
     * Return the nedb filter expression for the given filter criteria (string identifier).
     */
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

    /*
    * Return the current revision ID, reflecting any change in the data storage.
    */
    async revision() {
        return this._revision;
    }

    /**
     * Add the given note to the data storage (data storage assigns a new ID).
     * Returns the updated revision ID.
     * The new note ID is not returned, but the frontend need to retrieve "all" messages afterwards.
     * The Note data object is not checked, but blindly stored.
     */
    async add(note) {
        await this._db.insert(note);
        return this._revision++;
    }

    /**
     * Update the data storage with the given note.
     * Returns the updated revision ID.
     * If the note has no ID, data storage silently assigns a new ID.
     */
    async update(note) {
        await this._db.update({ _id: (note._id) }, {$set: note});
        return this._revision++;
    }

    /**
     * Delete the given note (addressed with its ID) from the data storage.
     * Returns an object containing the updated revision ID and the number of deleted items (expected to be 1).
     * Revision ID is only updated if note could be deleted (eg. valid ID).
     */
    async delete(id) {
        const num = await this._db.remove({ _id: id }, {});
        if (num !== 0) this._revision++;
        return { revision: this._revision, numDeleted: num };
    }

    /**
     * Return note, addressed by its ID.
     * If note is not found, it returns null.
     */
    async get(id) {
        return this._db.findOne({_id: id});
    }

    /**
     * Return all notes (array) that match with the given filter criteria.
     * The notes are sorted according to the given order criteria and direction.
     * If no notes are found, it returns an empty array.
     */
    async all(orderBy, orderDir, filterBy) {
        return this._db.find(TodoStore._getFilter(filterBy)).sort({[orderBy]:orderDir}).exec();
    }
}

export const todoStore = new TodoStore();
