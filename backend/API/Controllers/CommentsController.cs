using System.Security.Claims;
using API.core.AppDbContext;
using API.core.Dtos.Comment;
using API.core.Entities;
using API.SignalR;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController(AppDbContext _context, IMapper _mapper, IHubContext<CommentHub> _hub) : ControllerBase
    {
        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        private async Task<Activity?> GetActivityByIdInternal(string id)
        {
            return await _context.Activities.FindAsync(id);
        }


        [HttpGet("{activityId}")]
        public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentsForActivity(string activityId)
        {
            var activity = await GetActivityByIdInternal(activityId);
            if (activity == null) return NotFound(new { Message = "Activity not found" });

            var commentsdto = await _context.Comments
                .Where(c => c.ActivityId == activityId)
                .OrderByDescending(c => c.CreatedAt)
                .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(commentsdto);
        }


        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto dto)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { Message = "User not authenticated" });

            var activity = await GetActivityByIdInternal(dto.Id);
            if (activity == null) return NotFound(new { Message = "Activity not found" });
            var comment = new Comment
            {
                Body = dto.Body,
                ActivityId = dto.Id,
                UserId = userId,
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            var commentDto = _mapper.Map<CommentDto>(comment);

            await _hub.Clients.Group(dto.Id).SendAsync("ReceiveComment", commentDto);

            return Ok();
        }


        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(string commentId)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized(new { Message = "User not authenticated" });

            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null) return NotFound(new { Message = "Comment not found" });

            if (comment.UserId != userId) return BadRequest(new { Message = "You are not authorized to delete this comment" });

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            await _hub.Clients.All.SendAsync("DeleteComment", commentId);
            return Ok();
        }
    }
}