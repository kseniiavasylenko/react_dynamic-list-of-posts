const BASE_URL = 'https://mate.academy/students-api';

type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';

export const request = <T>(
  url: string,
  method: RequestMethod = 'GET',
  data?: unknown,
): Promise<T> => {
  const options: RequestInit = { method };

  if (data) {
    options.body = JSON.stringify(data);
    options.headers = { 'Content-Type': 'application/json' };
  }

  return fetch(`${BASE_URL}${url}`, options).then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  });
};
