import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Avatar,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import useComment from "../hooks/useComment";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function ActivityDetailsChat() {
  const { id } = useParams();
  const { comments, addCommentMutation } = useComment(id);
  const [inputValue, setInputValue] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    addCommentMutation.mutate({
      id,
      body: inputValue,
    });
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleAddComment(e);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600}>
            Chat about this event below
          </Typography>

          <div>
            <form>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                placeholder="Enter your comment (Enter to submit, SHIFT + Enter for new line)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </form>
          </div>

          <Box sx={{ height: 400, overflowY: "auto" }}>
            {comments?.map((comment) => (
              <Box key={comment.id} sx={{ display: "flex", my: 2 }}>
                <Avatar
                  src={comment?.imageUrl || "/default-user.png"}
                  alt={"user image"}
                  sx={{ mr: 2 }}
                />
                <Box display="flex" flexDirection="column">
                  <Box display="flex" alignItems="center" gap={3}>
                    <Typography
                      component={Link}
                      to={`/profiles/${comment.userId}`}
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", textDecoration: "none" }}
                    >
                      {comment?.displayName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {`${formatDistanceToNow(
                        new Date(comment.createdAt)
                      )} ago`}
                    </Typography>
                  </Box>

                  <Typography sx={{ whiteSpace: "pre-wrap" }}>
                    {comment.body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
