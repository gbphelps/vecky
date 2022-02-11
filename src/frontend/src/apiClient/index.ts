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

function request(method: string, endpoint: string, body?: {}) {
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfMeta?.getAttribute('content') ?? '';

  if (endpoint.startsWith('/')) throw new Error(`Endpoint should not use initial forward slash. Did you mean ${endpoint.slice(1)}?`);

  return fetch(`/api/${endpoint}`, {
    credentials: 'same-origin',
    headers: {
      'CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    method,
    ...(body ? { body: JSON.stringify(body) } : null),
  }).then(async (res) => {
    if (res.status < 300) {
      return {
        code: res.status,
        data: await res.json(),
      };
    }

    throw new Error(JSON.stringify({
      code: res.status,
      error: await res.json(),
    }));
  });
}

export default request;
