namespace API.core.Entities
{
    public class ActivityAttendee
    {
        public string? ActivityId { get; set; }
        public string? UserId { get; set; }
        public Activity Activity { get; set; }
        public User User { get; set; }

        // add additional props,like IsHost,DateJoined
        public bool IsHost { get; set; }
        public DateTime DateJoined { get; set; } = DateTime.UtcNow;
    }
}