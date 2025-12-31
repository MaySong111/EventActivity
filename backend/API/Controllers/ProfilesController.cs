using System.Security.Claims;
using API.core.AppDbContext;
using API.core.Dtos.Profiles;
using API.core.Entities;
using API.core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilesController(CloudinaryService _cloudinaryService, AppDbContext _context) : ControllerBase
    {
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto dto)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _context.Users.Include(u => u.Photo).FirstOrDefaultAsync(u => u.Id == currentUserId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.DisplayName = dto.DisplayName;
            user.Bio = dto.Bio;

            if (dto.File != null)
            {
                var ext = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
                var permittedExtensions = new[] { ".jpg", ".jpeg", ".png" };

                if (!permittedExtensions.Contains(ext))
                {
                    return BadRequest(new { message = "Invalid file type" });
                }

                if (user.Photo != null)
                {
                    await _cloudinaryService.DeletePhotoAsync(user.Photo.PublicId);
                    _context.Photos.Remove(user.Photo);
                }

                var uploadResult = await _cloudinaryService.UploadPhotoAsync(dto.File);

                var photo = new Photo
                {
                    Url = uploadResult.Url,
                    PublicId = uploadResult.PublicId,
                    UserId = currentUserId
                };

                _context.Photos.Add(photo);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                displayName = user.DisplayName,
                imageUrl = user.Photo?.Url ?? "/default-avatar.png",
                bio = user.Bio
            });
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfile(string userId)
        {
            var user = await _context.Users
                .Include(u => u.Photo)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new
            {
                displayName = user.DisplayName,
                imageUrl = user.Photo?.Url ?? "/default-avatar.png",
                bio = user.Bio
            });
        }
    }
}