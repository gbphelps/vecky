//   fetch('/api/users', {
//     credentials: 'same-origin', // <-- includes cookies in the request
//     headers: {
//       'CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
//       'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     body: JSON.stringify({
//       username: 'apple',
//       password: 'apple',
//     }),
//   });

function request(method: string, endpoint: string, body: object) {
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfMeta?.getAttribute('content') ?? '';

  return fetch(`/api/${endpoint}`, {
    credentials: 'same-origin',
    headers: {
      'CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    method,
    body: JSON.stringify(body),
  });
}

export default request;
