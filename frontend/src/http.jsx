import useAuthStore from "./store/useAuthStore";

export const API_URL = "https://localhost:5001";
export const BASE_URL = "https://localhost:5001/api";
export const LocationIQ_API_KEY =
  "https://api.locationiq.com/v1/autocomplete?key=pk.84379dc40b13d8829c0e786f398d8be7";

export const pageSize = 10;

function getAuthHeaders() {
  const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function getActivities(pageSize, currentPage, filter, startDate) {
  const dateStr = startDate ? startDate.toISOString() : "";
  var response = await fetch(
    `${BASE_URL}/activities/?pageSize=${pageSize}&currentPage=${currentPage}&filter=${filter}&startDate=${dateStr}`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  const data = await response.json();
  return data;
}

export async function getActivity(id) {
  var response = await fetch(`${BASE_URL}/activities/${id}`, {
    headers: getAuthHeaders(),
  });
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch activity");
  }
  const data = await response.json();
  return data;
}

export async function createActivity(activity) {
  var response = await fetch(`${BASE_URL}/activities`, {
    headers: getAuthHeaders(),
    method: "POST",
    body: JSON.stringify(activity),
  });

  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  return response.json();
}

export async function updateActivity({ id, activity }) {
  console.log("Updating: activity object no id", activity);
  var response = await fetch(`${BASE_URL}/activities/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(activity),
  });
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  if (response.status === 403) {
    throw new Error("Forbidden: You are not the host of this activity");
  }

  return await response.json();
}

export async function deleteActivity(id) {
  var response = await fetch(`${BASE_URL}/activities/${id}`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }
  return await response.json();
}

export async function attendActivity(id) {
  var response = await fetch(`${BASE_URL}/activities/${id}/attend`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

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
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }
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
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }
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

  if (response.status === 500) {
    throw new Error("Server error. Please try again later.");
  }
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message);
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
    const error = new Error(responseData.message);
    error.errors = responseData.errors;
    throw error;
  }
  return responseData;
}

// Profile APIs--------------------------------
export async function editProfile(data) {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${BASE_URL}/profiles/me`, {
    method: "PUT",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: data,
  });

  if (response.status === 401 || response.status === 404) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Update failed");
  }

  return responseData;
}

export async function getProfile(userId) {
  var response = await fetch(`${BASE_URL}/profiles/${userId}`, {
    headers: getAuthHeaders(),
  });
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch profile");
  }
  const data = await response.json();
  return data;
}

// Comments APIs--------------------------------
export async function getComments(activityId) {
  var response = await fetch(`${BASE_URL}/comments/${activityId}`, {
    headers: getAuthHeaders(),
  });
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch comments");
  }
  const data = await response.json();
  return data;
}

export async function addComment({ id, body }) {
  var response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ id, body }),
  });
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create comment");
  }
  return true;
}

export async function deleteComment(commentId) {
  var response = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (response.status === 401) {
    window.location.href = "/login";
    useAuthStore.getState().logout();
    return;
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete comment");
  }
  return true;
}
