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
        if(res.status != 200) throw new Error('Request failed with code ' + res.status);
        return res.json();
    });
}

module.exports = {
    request: request
}
