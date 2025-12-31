import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore";
import { editProfile} from "../http";
import toast from "react-hot-toast";

export default function useProfiles() {
  const editProfileMutation = useMutation({
    mutationFn: (data) => editProfile(data),
    onSuccess: (data) => {
      const { user, token, login } = useAuthStore.getState();
      login({ ...user, ...data }, token);
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return  editProfileMutation ;
}
