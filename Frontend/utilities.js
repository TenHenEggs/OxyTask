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
    if (res.status !== 200 && res.status !== 201 && res.status !== 202)
      throw new Error('Request failed with code ' + res.status);
    return res.json();
  }).then(res => {
    if (res.success) return res.data;
    else throw new Error(res.error);
  });
}

function serializeForm(form) {
  const data = new FormData(form)
  return Object.fromEntries(data.entries());
}

function elementFromString(string) {
  const tmp = document.createElement('div');
  tmp.innerHTML = string;
  return tmp.children[0];
}

module.exports = {
  request: request,
  serializeForm: serializeForm,
  elementFromString: elementFromString
}
