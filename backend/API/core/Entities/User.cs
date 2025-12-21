using Microsoft.AspNetCore.Identity;
namespace API.core.Entities;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
    public List<ActivityAttendee> Activities { get; set; } = [];
}