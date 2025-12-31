namespace API.core.Entities
{
    public class Comment
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Body { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // nav props
        public required string ActivityId { get; set; }
        public Activity? Activity { get; set; }

        public required string UserId { get; set; }
        public User? User { get; set; }
    }

}