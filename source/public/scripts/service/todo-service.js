/**
 * @file CAS FEE 2022 / Project 1 / Frontend: AJAX Rest API with Backend
 * @author Martin Frey <martin.frey@ost.ch>
 */

export default class TodoService {

    /**
     * Retrieve resources from backend, based on "fetch":
     *
     * - https://developer.mozilla.org/en/docs/Web/API/Fetch_API
     *
     * In case of an error an exception is thrown:
     *
     * - a remote failure is signalled by the response code, including an error message conveyed in the body
     * - on a local failure (e.g. network connection fails), the initial exception is just re-thrown
     */
    static async _request(method, url, data, headers) {
        const fetchHeaders = new Headers({'content-type': 'application/json', ...(headers || {})});
        return fetch(url, {method, headers: fetchHeaders, body: JSON.stringify(data)})
            .then(async rsp => {
                if (rsp.status >= 400) // remote issue by server
                    // error message text from body is resolved from promise "rsp" by methode ".json()"
                    throw new Error(`Response(${rsp.status}:${rsp.statusText}:${await rsp.json().then(msg => msg)})`)
                return rsp.json();})
            .catch(err => {
                throw err; }); // local issue, e.g. network connection broke
    }

    /**
     * Get all notes that match with the given filter criteria from the backend.
     * The backend returns the notes sorted by the order criteria and direction.
     */
    static async getNotes(orderBy, orderDir, filterBy) {
        return TodoService._request("GET",
            `/notes/?orderBy=${orderBy}&orderDir=${orderDir}&filterBy=${filterBy}`);
    }

    /**
     * Get all notes that are meet the given filter criteria.
     * The backend returns the notes sorted by the order criteria and direction.
     */
    static getNoteById(id) {
        return TodoService._request("GET", `/notes/${id}`);
    }

    /**
     * Get storage revision ID.
     * The backend updates the revision ID each time the data in the storage is modified (add, update or delete Note).
     */
    static async getRevision() {
        return TodoService._request("GET", "/revision/");
    }

    /**
     * Add new note to backend storage.
     * The note ID does not need to be passed (but will not fail if it already contains an ID).
     * The backend returns the new revision ID of the data storage.
     */
    static async addNote(note) {
        return TodoService._request("POST", "/notes/", {note});
    }

    /**
     * Update backend storage with the given note (addressed by its ID).
     * The backend returns the new revision ID of the data storage.
     */
    static async updateNote(note) {
        return TodoService._request("PUT", "/notes/", {note});
    }

    /**
     * Delete note (addressed by its ID) from the backend storage.
     * The backend returns the new revision ID of the data storage.
     * If the ID does not exist, the backend returns a 404 status code (leads to exception in _request methode).
     */
    static async deleteNoteById(id) {
        return TodoService._request("DELETE", `/notes/${id}`);
    }
}
