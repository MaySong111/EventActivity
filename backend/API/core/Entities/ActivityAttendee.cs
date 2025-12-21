namespace API.core.Entities
{
    public class ActivityAttendee
    {
        public string ActivityId { get; set; }
        public string UserId { get; set; }
        // 这里可以添加其他属性，比如是否是主持人(该参与者是否是活动的主持人)
        public bool IsHost { get; set; }
        public DateTime DateJoined { get; set; } = DateTime.UtcNow;
        public Activity Activity { get; set; }
        public User User { get; set; }
    }
}