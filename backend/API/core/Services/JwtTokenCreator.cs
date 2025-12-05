using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.core.Services;

public class JwtTokenCreator(UserManager<IdentityUser> userManager, IConfiguration configuration)
{
    public async Task<string> GenerateToken(IdentityUser user)
    {
        // step1: define token claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Role, "User"), // assuming a default role of "User"
            new Claim(ClaimTypes.Email, user.Email)
        };

        // step2: create signing credentials
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        // step3: create the token
        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );
        // step4: return the token string
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return tokenString;
    }
}
