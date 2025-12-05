using API.core.Dtos.Auto;
using API.core.Entities;
using API.core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<User> userManager, JwtTokenCreator jwtTokenCreator) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDto dto)
        {
            // 1. check if user with the same email exists
            var existingUser = await userManager.FindByEmailAsync(dto.Email);
            // email 已存在则返回409 Conflict,而不是400 Bad Request(400是参数格式错误等)
            if (existingUser != null)
            {
                // return BadRequest(new { Message = "Email is already in use." });
                return Conflict(new { Message = "Email is already in use." });
            }
            // 2. create new user
            var newUser = new User
            {
                UserName = dto.Email, // 使用邮箱作为用户名
                Email = dto.Email,
                DisplayName = dto.DisplayName
            };

            // 3. save user to database
            var result = await userManager.CreateAsync(newUser, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { Message = "User registration failed.", Errors = result.Errors });
            }
            return Created("", new { Message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<ActionResult<ResponseApiDto>> Login([FromBody] LoginDto dto)
        {
            // 1. find user by email
            var user = await userManager.FindByEmailAsync(dto.Email);
            // 邮箱不存在 = 身份验证失败并不是找不到用户(所以不是NotFound),而是Unauthorized401
            if (user == null)
            {
                return Unauthorized();
            }
            // 2. check password
            var passwordValid = await userManager.CheckPasswordAsync(user, dto.Password);
            // 密码错误 = 身份验证失败401 Unauthorized
            if (!passwordValid)
            {
                return Unauthorized();
            }
            else
            {
                // 3. return user info (you might want to return a token here instead), include token in ResponseApiDto
                // 3.1 generate JWT token
                var token = await jwtTokenCreator.GenerateToken(user);
                // 3.2 create response DTO
                var response = new ResponseApiDto
                {
                    Token = token,
                    DisplayName = user.DisplayName,
                    Email = user.Email
                };
                // 3.3 return response
                return Ok(response);
            }

        }
    }
}
