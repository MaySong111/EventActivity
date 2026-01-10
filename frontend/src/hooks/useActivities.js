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
  getMyActivities,
  getHostedActivities,
} from "../http";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function useActivities(
  id = null,
  pageSize = 10,
  currentPage = 1,
  filter = "",
  startDate = null
) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: isLoadingActivities,
    error: activitiesError,
  } = useQuery({
    queryKey: ["activities", filter, startDate, currentPage, pageSize],
    queryFn: () => getActivities(pageSize, currentPage, filter, startDate),
    enabled: !id && location.pathname === "/activities" && !!currentUser,
    select: (data) => {
      return {
        totalCount: data.totalCount,
        pagedActivities: data.pagedActivities.map((activity) => ({
          ...activity,
          isHost: currentUser?.id === activity.hostId,
          isAttending: activity.attendees.some((a) => a.id === currentUser?.id),
        })),
      };
    },
  });

  // 获取单个活动详情(id 是活动 ID，不是用户 ID。)
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


  // get current logged-in user all activities 
  const {data: myActivities} = useQuery({
    queryKey: ["myActivities"],
    queryFn: () => getMyActivities(),
    enabled: !!currentUser,
  }); 

  // get specific user's hosted activities
  const {data: userHostedActivities} = useQuery({
    queryKey: ["userHostedActivities", id],
    queryFn: () => getHostedActivities(id),
    enabled: !!id && !!currentUser,
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
    mutationFn: updateActivity,
    onSuccess: () => {
      // console.log("useActivities - Updated activity",id);
      queryClient.invalidateQueries(["activities"]);
      queryClient.invalidateQueries(["activities", id]);
      navigate(`/activities/${id}`);
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: (result) => {
      toast.success(result.message || "Deleted successfully");
      queryClient.invalidateQueries(["activities"]);
    },
  });

  const attendActivityMutation = useMutation({
    mutationFn: attendActivity,
    onSuccess: () => {
      queryClient.invalidateQueries(["activities", id]);
      queryClient.invalidateQueries(["activities"]);
    },
  });

  const unattendActivityMutation = useMutation({
    mutationFn: unattendActivity,
    onSuccess: () => {
      queryClient.invalidateQueries(["activities", id]);
      queryClient.invalidateQueries(["activities"]);
      toast.success("Left activity successfully");
    },
  });

  const toggleCancellationMutation = useMutation({
    mutationFn: toggleActivityCancellation,
    onSuccess: () => {
      // console.log("queryClient invalidating queries for activity id:", id);
      queryClient.invalidateQueries(["activities", id]);
      queryClient.invalidateQueries(["activities"]);
    },


  });

  return {
    activities: data?.pagedActivities,
    totalCount: data?.totalCount,
    isLoadingActivities,
    activitiesError,
    activity,
    isLoadingActivity,
    myActivities,
    userHostedActivities,
    createActivityMutation,
    updateActivityMutation,
    deleteActivityMutation,
    attendActivityMutation,
    unattendActivityMutation,
    toggleCancellationMutation,
  };
}
