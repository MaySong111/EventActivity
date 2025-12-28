using Microsoft.AspNetCore.Identity;
namespace API.core.Entities;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public List<ActivityAttendee> Activities { get; set; } = [];
    public string? PhotoId { get; set; }
    public Photo? Photo { get; set; }
}