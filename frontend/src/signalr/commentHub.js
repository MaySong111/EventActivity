import * as signalR from "@microsoft/signalr";
import useAuthStore from "../store/useAuthStore";
import { API_URL } from "../http";

export const commentConnection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_URL}/commentHub`, {
    withCredentials: true,
    accessTokenFactory: () => useAuthStore.getState().token,
  })
  .withAutomaticReconnect()
  .build();
