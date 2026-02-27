using System.Security.Claims;
using API.core.AppDbContext;
using API.core.Dtos;
using API.core.Dtos.Activity;
using API.core.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    // 这个新写法,当只有一个构造函数的时候,那可以用主构造函数简化写法,而不是之前的定义构造函数,传递参数--生成private readonly 字段--然后在构造函数中赋值
    public class ActivitiesController(AppDbContext _context, IMapper mapper, UserManager<User> userManager) : BaseApiController
    {
        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        private async Task<Activity?> GetActivityByIdInternal(string id)
        {
            return await _context.Activities.FindAsync(id);
        }


        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> GetActivities([FromQuery] string? filter = "",
        [FromQuery] DateTime? startDate = null,
            [FromQuery] int currentPage = 1,
            [FromQuery] int pageSize = 6)
        {

            var query = _context.Activities.AsQueryable();

            // if startDate is provided, filter activities that are on or after the startDate
            if (startDate.HasValue)
            {
                query = query.Where(a => a.Date >= startDate.Value);
            }
            // var activities = await context.Activities
            //     .Include(a => a.Attendees)
            //     .ThenInclude(aa => aa.User)
            //     .ToListAsync();
            // change to use ProjectTo for AutoMapper optimization, avoid loading unnecessary data
            // var activitiesDto = await context.Activities.ProjectTo<ActivityDto>(mapper.ConfigurationProvider).ToListAsync();
            // 1. get current user id
            var currentUserId = GetCurrentUserId();

            // if filter is provided, filter activities based on whether the current user is hosting or attending the activity
            if (!string.IsNullOrEmpty(filter) && currentUserId != null)
            {
                if (filter == "hosting")
                {
                    query = query.Where(a => a.Attendees.Any(aa => aa.UserId == currentUserId && aa.IsHost));
                }
                else if (filter == "attending")
                {
                    query = query.Where(a => a.Attendees.Any(aa => aa.UserId == currentUserId && !aa.IsHost));
                }
            }

            // 2. apply pagination
            var totalCount = await query.CountAsync();
            var pagedActivities = await query.ProjectTo<ActivityDto>(mapper.ConfigurationProvider).
                        Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
            return Ok(new { totalCount, pagedActivities });
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> GetActivityById([FromRoute] string id)
        {
            // var activity = await context.Activities
            //     .Include(a => a.Attendees)
            //     .ThenInclude(aa => aa.User)
            //     .FirstOrDefaultAsync(a => a.Id == id);
            // change to use ProjectTo for AutoMapper optimization, avoid loading unnecessary data
            var activityDto = await _context.Activities
                .Where(a => a.Id == id)
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
               .FirstOrDefaultAsync();

            if (activityDto == null)
            {
                return NotFound(new { Message = "Activity not found" });
            }
            return Ok(activityDto);
        }


        [HttpPost]
        public async Task<ActionResult> CreateActivity(CreateActivityDto dto)
        {
            var activity = mapper.Map<Activity>(dto);
            // 此时并没有调用数据库, 实际上是在内存中创建了一个实体对象,所以并不需要用AddAsync异步方法!!!!
            _context.Activities.Add(activity);

            // 创建活动的人要自动成为主办方（Host）
            // 1. 获取当前登录用户的UserId
            var userId = GetCurrentUserId();
            Console.WriteLine("Current UserId: " + userId);
            if (userId == null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            // 2. 创建ActivityAttendee实体对象,并设置IsHost为true
            var attendee = new ActivityAttendee
            {
                ActivityId = activity.Id,
                UserId = userId,
                IsHost = true,
            };
            // 3. 将ActivityAttendee对象添加到数据库上下文中
            activity.Attendees.Add(attendee);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Created successfully" });
        }


        // only the host can update or delete the activity
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(string id, CreateActivityDto dto)
        {
            var activity = await GetActivityByIdInternal(id);
            if (activity == null) return NotFound(new { Message = "Activity not found" });

            // 1. 获取当前登录用户的UserId
            var userId = GetCurrentUserId();

            // 2. 获取活动的主办方UserId
            var existingHost = await _context.ActivityAttendees.Where(aa => aa.ActivityId == id && aa.IsHost)
               .Select(aa => aa.UserId)
               .FirstOrDefaultAsync();

            if (existingHost != userId)
            {
                return Forbid(); // 403 Forbidden
            }

            mapper.Map(dto, activity);     // 将dto的值映射到已经存在的实体对象上,更新现有的实体对象的属性值!!!!!
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Updated successfully" });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(string id)
        {
            var activity = await GetActivityByIdInternal(id);
            if (activity == null) return NotFound(new { Message = "Activity not found" });

            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Deleted successfully" });
        }


        [HttpPost("{id}/toggle-cancel")]
        public async Task<IActionResult> CancelOrReactivateActivity(string id)
        {
            // 1. check if activity exists
            var activity = await GetActivityByIdInternal(id);
            if (activity == null) return NotFound(new { Message = "Activity not found" });

            // 2. check if current user is the host, only host can cancel or reactivate the activity
            var userId = GetCurrentUserId();
            // check existing,if not exist, return null
            var existingHost = await _context.ActivityAttendees.Where(aa => aa.ActivityId == id && aa.IsHost)
               .Select(aa => aa.UserId)
               .FirstOrDefaultAsync();

            if (existingHost != userId)
            {
                return Forbid(); // 403 Forbidden
            }

            // 3. toggle the IsCancelled property
            activity.IsCancelled = !activity.IsCancelled;
            await _context.SaveChangesAsync();
            return Ok();
        }


        // non-host user join the activity
        [HttpPost("{id}/attend")]
        public async Task<IActionResult> AttendActivity(string id)
        {
            // 1. check if activity exists
            var activity = await GetActivityByIdInternal(id);
            if (activity == null) return NotFound(new { Message = "Activity not found" });

            // 2. get current user id
            var userId = GetCurrentUserId();

            // 3. check if user already joined the activity
            var existingAttendance = await _context.ActivityAttendees
                .FirstOrDefaultAsync(aa => aa.ActivityId == id && aa.UserId == userId);


            if (existingAttendance != null)
            {
                return BadRequest(new { Message = "User already joined the activity" });
            }
            // 4. create new attendance
            var attendance = new ActivityAttendee
            {
                ActivityId = id,
                UserId = userId,
                IsHost = false
            };
            _context.ActivityAttendees.Add(attendance);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // non-host user cancel attendance
        [HttpDelete("{id}/unattend")]
        public async Task<IActionResult> UnattendActivity(string id)
        {
            // 1. check if activity exists
            var activity = await GetActivityByIdInternal(id);
            if (activity == null) return NotFound(new { Message = "Activity not found" });
            // 2. get current user id
            var userId = GetCurrentUserId();
            // 3. check if user already joined the activity
            var existingAttendance = await _context.ActivityAttendees
                .FirstOrDefaultAsync(aa => aa.ActivityId == id && aa.UserId == userId);
            if (existingAttendance == null)
            {
                return BadRequest(new { Message = "User has not joined the activity" });
            }
            // 4. remove attendance
            _context.ActivityAttendees.Remove(existingAttendance);
            await _context.SaveChangesAsync();
            return Ok();
        }



        //  loggedInUser can get activity details(获取当前用户的所有活动)
        [HttpGet("mine")]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> GetMyActivities()
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                return Unauthorized(new { Message = "User not authenticated" });
            }

            var myActivities = await _context.Activities
                .Where(a => a.Attendees.Any(aa => aa.UserId == currentUserId))
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(myActivities);
        }


        //  获取指定用户作为Host的活动
        [HttpGet("user/{userId}/hosting")]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> GetActivitiesUserIsHosting(string userId)
        {
            var hostingActivities = await _context.Activities
                .Where(a => a.Attendees.Any(aa => aa.UserId == userId && aa.IsHost))
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(hostingActivities);
        }

    }
}