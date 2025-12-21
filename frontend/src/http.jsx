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
    // Token 过期或无效，清除并跳转到登录页
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

export async function getUserInfo() {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      "content-type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  const user = await response.json();
  return user;
}
