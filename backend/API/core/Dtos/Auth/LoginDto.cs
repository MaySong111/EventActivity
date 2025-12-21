using System.ComponentModel.DataAnnotations;
namespace API.core.Dtos.Auto;

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    // [Required] 不需要加这个，因为密码的复杂性要求会自动检查密码是否为空
    public string Password { get; set; } = "";
    public bool RememberMe { get; set; } = false;
}
