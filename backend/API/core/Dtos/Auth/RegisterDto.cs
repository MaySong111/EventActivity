using System.ComponentModel.DataAnnotations;

namespace API.core.Dtos.Auto;

public class RegisterDto
{
    // 注意 因为program.cs中配置了options.User.RequireUniqueEmail = true;，这就是想要用户名是邮箱   

    [Required]
    public string DisplayName { get; set; } = "";
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    // [Required] 不需要加这个，因为密码的复杂性要求会自动检查密码是否为空
    public string Password { get; set; } = "";
}
