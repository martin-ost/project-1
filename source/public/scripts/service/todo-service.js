export default class TodoService {

    static async _request(method, url, data, headers) {
        const fetchHeaders = new Headers({'content-type': 'application/json', ...(headers || {})});
        return fetch(url, {method, headers: fetchHeaders, body: JSON.stringify(data)})
            .then(async rsp => {
                if (rsp.status >= 400) {
                    // const msg = await rsp.json().then(body => body);
                    throw new Error(`Response(${rsp.status}:${rsp.statusText}:${await rsp.json().then(body => body)})`)
                }
                return rsp.json();
            })
            .catch(err => { throw err; }); // local issue
    }

    static async getNotes(orderBy, orderDir, filterBy) {
        return TodoService._request("GET",
            `/notes/?orderBy=${orderBy}&orderDir=${orderDir}&filterBy=${filterBy}`);
    }

    static getNoteById(id) {
        return TodoService._request("GET", `/notes/${id}`);
    }

    static async getRevision() {
        return TodoService._request("GET", "/revision/");
    }

    static async addNote(note) {
        return TodoService._request("POST", "/notes/", {note});
    }

    static async updateNote(note) {
        return TodoService._request("PUT", "/notes/", {note});
    }

    static async deleteNoteById(id) {
        return TodoService._request("DELETE", `/notes/${id}`);
    }
}
