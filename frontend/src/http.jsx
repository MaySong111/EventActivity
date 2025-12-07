export const BASE_URL = "https://localhost:5001/api";

export async function getActivities() {
  var result = await fetch(`${BASE_URL}/activities`);
  return result.json();
}

export async function getActivity(id) {
  var result = await fetch(`${BASE_URL}/activities/${id}`);
  return result.json();
}

export async function createActivity(activity) {
  var result = await fetch(`${BASE_URL}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });
  return result.json();
}

export async function updateActivity(id, activity) {
  var result = await fetch(`${BASE_URL}/activities/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });
  return result.json();
}

export async function deleteActivity(id) {
  var result = await fetch(`${BASE_URL}/activities/${id}`, {
    method: "DELETE",
  });
  return await result.json();
}

export async function loginUser(data) {
  var response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Login failed");
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
  var user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}