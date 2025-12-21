using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using API.core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.core.Services;

public class JwtTokenCreator(UserManager<User> userManager, IConfiguration configuration)
{
    public async Task<string> GenerateToken(User user, bool rememberMe)
    {
        // step1: define token claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Role, "User"), // assuming a default role of "User"
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("DisplayName", user.UserName)
        };

        // step2: create signing credentials
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var tokenExpiry = rememberMe ? DateTime.Now.AddDays(7) : DateTime.Now.AddHours(2);
        // step3: create the token
        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: tokenExpiry,
            signingCredentials: creds
        );
        // step4: return the token string
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return tokenString;
    }
}
