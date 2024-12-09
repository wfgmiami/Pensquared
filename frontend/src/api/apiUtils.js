export async function handleResponse(response) {
  if (response.ok) {
    // console.log("frontend/src/api/apiUtils: response: ", response);
    // 204 - No Content success status response code
    if (response.status === 204) return response;
    return response.json();
  }
  if (response.status === 400 || response.status === 401) {
    // So, a server-side validation error occurred.
    // Server side validation returns a string error message, so parse as text instead of json.
    const error = await response.text();
    throw new Error(error);
  }

  throw new Error("Network response was not ok.");
}

// In a real app, would likely call an error logging service.
export function handleError(error) {
  // eslint-disable-next-line no-console
  console.error("API call failed. " + error);
  throw error;
}
