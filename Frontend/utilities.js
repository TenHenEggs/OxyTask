function request(uri, method, body) {
    const server = 'http://localhost:8080';

    return fetch(server + uri, {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => {
        if (res.status !== 200 && res.status !== 201 && res.status !== 202) throw new Error('Request failed with code ' + res.status);
        return res.json();
    });
}

function deleteTable(id) {
    return request('/api/tables/' + id, 'DELETE');
}

module.exports = {
    request: request,
    deleteTable: deleteTable
}
