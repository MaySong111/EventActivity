import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  attendActivity,
  unattendActivity,
  toggleActivityCancellation,
} from "../http";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function useActivities(id = null) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: activities,
    isLoading: isLoadingActivities,
    error: activitiesError,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: () => getActivities(),
    enabled: !id && location.pathname === "/activities" && !!currentUser,
    select: (data) => {
      return data.map((activity) => ({
        ...activity,
        isHost: currentUser?.id === activity.hostId,
        isAttending: activity.attendees.some((a) => a.id === currentUser?.id),
      }));
    },
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activities", id],
    queryFn: () => getActivity(id),
    enabled: !!id && !!currentUser,
    select: (data) => {
      return {
        ...data,
        isHost: currentUser?.id === data.hostId,
        isAttending: data.attendees.some((a) => a.id === currentUser?.id),
      };
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: (result) => {
      toast.success(result.message || "Created successfully");
      queryClient.invalidateQueries(["activities"]);
      navigate("/activities");
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ id, activity }) => updateActivity(id, activity),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["activities"]);
      queryClient.invalidateQueries(["activities", id]);
      navigate(`/activities/${id}`);
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: () => deleteActivity(id),
    onSuccess: (result) => {
      toast.success(result.message || "Deleted successfully");
      queryClient.invalidateQueries(["activities"]);
    },
  });

  const attendActivityMutation = useMutation({
    mutationFn: () => attendActivity(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["activities", id]);
      queryClient.invalidateQueries(["activities"]);
    },
  });

  const unattendActivityMutation = useMutation({
    mutationFn: () => unattendActivity(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["activities", id]);
      queryClient.invalidateQueries(["activities"]);
      toast.success("Left activity successfully");
    },
  });

  const toggleCancellationMutation = useMutation({
    mutationFn: () => toggleActivityCancellation(id),
    onSuccess: (_, id) => {
      // console.log("queryClient invalidating queries for activity id:", id);
      queryClient.invalidateQueries(["activities", id]);
      queryClient.invalidateQueries(["activities"]);
    },
  });

  return {
    activities,
    isLoadingActivities,
    activitiesError,
    activity,
    isLoadingActivity,
    createActivityMutation,
    updateActivityMutation,
    deleteActivityMutation,
    attendActivityMutation,
    unattendActivityMutation,
    toggleCancellationMutation,
  };
}
