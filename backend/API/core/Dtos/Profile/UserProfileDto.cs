namespace API.core.Dtos.Profile
{
    public class UserProfileDto
    {
        public required string Id { get; set; }
        public required string DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? ImageUrl { get; set; }
    }
}