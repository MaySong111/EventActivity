namespace API.core.Dtos.Comment
{
    public class CommentDto
    {
        public required string Id { get; set; }
        public required string Body { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public required string DisplayName { get; set; }
        public string? ImageUrl { get; set; }
    }
}