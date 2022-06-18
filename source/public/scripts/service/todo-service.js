/* eslint-disable no-underscore-dangle,import/prefer-default-export,object-shorthand */

export class TodoService {
    static _ajax(method, url, data, headers) {
        window.console.log(method, url, data, headers);
        const fetchHeaders = new Headers({'content-type': 'application/json', ...(headers || {})});
        return fetch(url, {
            method: method,
            headers: fetchHeaders,
            body: JSON.stringify(data)
        }).then(x => x.json());
    }

    // eslint-disable-next-line no-unused-vars

    static async getNotes(orderBy, orderDir, filterBy) { // static
        return TodoService._ajax("GET",
            `/notes/?orderBy=${orderBy}&orderDir=${orderDir}&filterBy=${filterBy}`, undefined); // remove undefined
    }

    static async getNoteById(id) {
        return TodoService._ajax("GET", `/notes/${id}`, undefined);
    }

    static async getState() {
        return TodoService._ajax("HEAD", "/state/");
    }

    static async addNote(note) {
        return TodoService._ajax("POST", "/notes/", {note: note});
    }

    static async updateNote(note) {
        return TodoService._ajax("PUT", "/notes/", {note: note});
    }

    static async deleteNoteById(id) {
        return TodoService._ajax("DELETE", `/notes/${id}`);
    }
}
