import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getComments, addComment, deleteComment } from "../http";
import { useEffect } from "react";
import { commentConnection } from "../signalR/commentHub";

export default function useComment(activityId) {
  const queryClient = useQueryClient();

  // 1. 获取所有评论（React Query）
  const { data: comments } = useQuery({
    queryKey: ["comments", activityId],
    queryFn: () => getComments(activityId),
  });

  // 2. WebSocket 监听和房间管理
  useEffect(() => {
    const startConnection = async () => {
      // 打开连接
      if (commentConnection.state === "Disconnected") {
        await commentConnection.start();
      }

      // 加入房间
      await commentConnection.invoke("JoinActivity", activityId);

      // 监听新评论
      commentConnection.on("ReceiveComment", (newComment) => {
        // 更新缓存
        queryClient.setQueryData(["comments", activityId], (oldData) => {
          return oldData ? [newComment, ...oldData] : [newComment];
        });
      });
    };

    startConnection();

    // 清理：离开房间
    return () => {
      commentConnection.invoke("LeaveActivity", activityId);
      commentConnection.off("ReceiveComment");
    };
  }, [activityId, queryClient]);

  // 3. 添加评论 mutation
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", activityId]);
      toast.success("Comment added");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // 4. 删除评论 mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", activityId]);
      toast.success("Comment deleted");
    },
  });

  return {
    comments,
    addCommentMutation,
    deleteCommentMutation,
  };
}
