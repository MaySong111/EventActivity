import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login(u, t) {
        set({ user: u, token: t });
      },
      logout() {
        set({ user: null, token: null })
        // clear react-query cache
        if(window.queryClient) {
          window.queryClient.clear();
        }
      },
    }),
    { name: "events-auth" }
  )
);

export default useAuthStore;
