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
  if (!result.ok) {
    if (result.status === 401) {
      throw new Error("AUTH/TOKEN_EXPIRED");
    }
    throw new Error("Failed to fetch activities");
  }

  const data = await result.json();
  return data;
}

export async function getActivity(id) {
  var result = await fetch(`${BASE_URL}/activities/${id}`, {
    headers: getAuthHeaders(),
  });
  const data = await result.json();
  return data;
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
  if (result.status === 403) {
    throw new Error("Forbidden: You are not the host of this activity");
  }

  return await result.json();
}

export async function deleteActivity(id) {
  var result = await fetch(`${BASE_URL}/activities/${id}`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
  return await result.json();
}

export async function attendActivity(id) {
  var response = await fetch(`${BASE_URL}/activities/${id}/attend`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Failed to join activity");
  }
  return true;
}

export async function unattendActivity(id) {
  var response = await fetch(`${BASE_URL}/activities/${id}/unattend`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Failed to leave activity");
  }
  return true;
}

export async function toggleActivityCancellation(id) {
  var response = await fetch(`${BASE_URL}/activities/${id}/toggle-cancel`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  console.log("toggleActivityCancellation response:", response);

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Failed to toggle cancellation");
  }
  return true;
}

// Authentication APIs--------------------------------
export async function loginUser(data) {
  var response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw new Error(responseData.message || "Login failed");
  }
  return responseData;
}

export async function registerUser(data) {
  var response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || "Registration failed");
  }
  return responseData;
}

// Profile APIs--------------------------------
export async function uploadProfilePhoto(file) {
  const token = useAuthStore.getState().token;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/profiles/upload-photo`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || "Photo upload failed");
  }

  const data = await response.json();
  return data; // 返回图片的 URL
}
