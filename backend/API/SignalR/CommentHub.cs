using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class CommentHub : Hub
    {
        public async Task JoinActivity(string activityId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
        }

        public async Task LeaveActivity(string activityId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, activityId);
        }
    }
}