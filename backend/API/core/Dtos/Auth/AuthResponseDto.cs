namespace API.core.Dtos.Auth;

public class AuthResponseDto

{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string Token { get; set; }
    public UserInfoDto UserInfo { get; set; }

}
