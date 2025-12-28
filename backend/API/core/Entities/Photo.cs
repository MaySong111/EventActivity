namespace API.core.Entities
{
    public class Photo
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Url { get; set; }
        public required string PublicId { get; set; }

        //nav prop
        public required string UserId { get; set; }
    }
}