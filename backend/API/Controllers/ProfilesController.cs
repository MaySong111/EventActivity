using System.Security.Claims;
using API.core.AppDbContext;
using API.core.Entities;
using API.core.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfilesController(CloudinaryService _cloudinaryService, AppDbContext _context) : ControllerBase
    {
        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto([FromForm] IFormFile file)
        {
            // 1. validate the image
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No File uploaded." });
            }

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            var permittedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            if (!permittedExtensions.Contains(ext))
            {
                return BadRequest(new { message = "Invalid file type. Only JPG, JPEG, and PNG are allowed." });
            }

            // 2. get current user id
            // 当前登录的用户id
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == null)
            {
                return Unauthorized();
            }
            // 找用户表--对应的photo导航属性,到photos表找对应的UserId---和当前登录的用户id比对
            var existing = _context.Users.Include(u => u.Photo).FirstOrDefault(u => u.Id == currentUserId);

            if (existing != null && existing.Photo != null)
            {
                // delete existing photo from cloudinary
                await _cloudinaryService.DeletePhotoAsync(existing.Photo.PublicId);
                // delete existing photo record from database
                _context.Photos.Remove(existing.Photo);
            }

            // 3. upload new photo to cloudinary
            var uploadResult = _cloudinaryService.UploadPhotoAsync(file).Result;
            // 4. save photo info to database
            var photo = new Photo
            {
                Url = uploadResult.Url,
                PublicId = uploadResult.PublicId,
                UserId = currentUserId
            };

            _context.Photos.Add(photo);
            await _context.SaveChangesAsync();
            return Ok(new { imageUrl = uploadResult.Url });
        }
    }
}