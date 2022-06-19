/* eslint-disable no-underscore-dangle,import/prefer-default-export,object-shorthand */

export class TodoService {

    static _log(msg) {
        if (true) console.log(msg);
    }

    static _request(method, url, data, headers) {
        TodoService._log(`${method}, ${url}, ${data}, ${headers}`);
        const fetchHeaders = new Headers({'content-type': 'application/json', ...(headers || {})});
        return fetch(url, { method: method, headers: fetchHeaders, body: JSON.stringify(data) })
            .then(rsp => {
                TodoService._log(rsp);
                if (rsp.status >= 400) throw new Error(`${rsp.status}:${rsp.statusText}`);
                return rsp.json();
            });
    }

    static async getNotes(orderBy, orderDir, filterBy) { // static
        return TodoService._request("GET",
            `/notes/?orderBy=${orderBy}&orderDir=${orderDir}&filterBy=${filterBy}`, undefined); // remove undefined
    }

    static getNoteById(id) {
        return TodoService._request("GET", `/notes/${id}`, undefined);
    }

    static async getRevision() {
        return TodoService._request("HEAD", "/revision/");
    }

    static async addNote(note) {
        return TodoService._request("POST", "/notes/", {note: note});
    }

    static async updateNote(note) {
        return TodoService._request("PUT", "/notes/", {note: note});
    }

    static async deleteNoteById(id) {
        return TodoService._request("DELETE", `/notes/${id}`);
    }
}
