

namespace API.core.Dtos.Profiles
{
    public class UpdateProfileDto
    {
        public string DisplayName { get; set; }
        public string? Bio { get; set; }
        public IFormFile? File { get; set; }
    }
}