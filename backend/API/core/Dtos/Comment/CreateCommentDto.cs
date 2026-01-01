namespace API.core.Dtos.Comment
{
    public class CreateCommentDto
    {
        public required string Id { get; set; }
        public required string Body { get; set; }
    }
}