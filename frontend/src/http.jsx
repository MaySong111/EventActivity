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

  const data = await result.json();
  console.log("getActivities fetched data:", data);
  const currentUser = useAuthStore.getState().user;

  // 给每个活动加上 isHost 和 isGoing
  const activitiesWithFlags = await data.map((activity) => ({
    ...activity,
    isHost: activity.hostId === currentUser?.id,
    isAttending: activity.attendees.some(
      (attendee) => attendee.id === currentUser?.id
    ),
  }));

  return activitiesWithFlags;
}

export async function getActivity(id) {
  var result = await fetch(`${BASE_URL}/activities/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await result.json();
  console.log("getActivity fetched data:", data);
  const currentUser = useAuthStore.getState().user;

  // 给活动加上 isHost 和 isGoing 标志
  const activityWithFlags = {
    ...data,
    isHost: data.hostId === currentUser?.id,
    isAttending: data.attendees.some((attendee) => attendee.id === currentUser?.id),
  };
  return activityWithFlags;
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
