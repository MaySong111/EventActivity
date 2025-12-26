import useAuthStore from "./store/useAuthStore";

export const BASE_URL = "https://localhost:5001/api";
export const LocationIQ_API_KEY =
  "https://api.locationiq.com/v1/autocomplete?key=pk.84379dc40b13d8829c0e786f398d8be7";

function getAuthHeaders() {
  const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function getActivities() {
  var result = await fetch(`${BASE_URL}/activities`, {
    headers: getAuthHeaders(),
  });
  if (result.status === 401) {
    // if token is expired or invalid, clear it and redirect to login page
    useAuthStore.getState().logout();
    window.location.href = "/login";
  }
  return result.json();
}

export async function getActivity(id) {
  var result = await fetch(`${BASE_URL}/activities/${id}`, {
    headers: getAuthHeaders(),
  });

  return result.json();
}

export async function createActivity(activity) {
  var response = await fetch(`${BASE_URL}/activities`, {
    headers: getAuthHeaders(),
    method: "POST",
    body: JSON.stringify(activity),
  });

  if (response.status === 401) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  return response.json();
}

export async function updateActivity(id, activity) {
  console.log("Updating: activity object no id", activity);
  var result = await fetch(`${BASE_URL}/activities/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(activity),
  });
  if (!result.ok) {
    throw new Error("Update failed");
  }
  return result.json();
}

export async function deleteActivity(id) {
  var result = await fetch(`${BASE_URL}/activities/${id}`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
  return await result.json();
}

// Authentication APIs--------------------------------
export async function loginUser(data) {
  var response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Login failed");
  }
  if (response.status === 401) {
    // if token is expired or invalid,clear it and redirect to login page
    useAuthStore.getState().logout();
    window.location.href = "/login";
  }
  return response.json();
}

export async function registerUser(data) {
  var response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return response.json();
}
