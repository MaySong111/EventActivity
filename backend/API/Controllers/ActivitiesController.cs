using System.Security.Claims;
using API.core.AppDbContext;
using API.core.Dtos;
using API.core.Dtos.Activity;
using API.core.Entities;
using AutoMapper;
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
    public class ActivitiesController(AppDbContext context, IMapper mapper, UserManager<User> userManager) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<List<ResponseActivityDto<Activity>>>> GetActivities()
        {
            var activities = await context.Activities.ToListAsync();
            if (activities == null || activities.Count == 0)
            {
                return Ok(new ResponseActivityDto<List<Activity>> { IsSuccess = true, Message = "No activities found", Data = activities });
            }
            return Ok(new ResponseActivityDto<List<Activity>> { IsSuccess = true, Message = "Success", Data = activities });
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ResponseActivityDto<Activity>>> GetActivityById([FromRoute] string id)
        {
            // var activites = await context.Activities.Include(a => a.Attendees).Where(a => a.Id == id).ToListAsync();
            var activity = await context.Activities.FindAsync(id);
            // if (activity == null) return NotFound();

            // return Ok(activites);
            return Ok(new ResponseActivityDto<Activity> { IsSuccess = true, Message = "Success", Data = activity });
        }


        [HttpPost]
        public async Task<ActionResult<ResponseActivityDto<object>>> CreateActivity(CreateActivityDto dto)
        {
            var activity = mapper.Map<Activity>(dto);
            // 此时并没有调用数据库, 实际上是在内存中创建了一个实体对象,所以并不需要用AddAsync异步方法!!!!
            context.Activities.Add(activity);

            // 创建活动的人要自动成为主办方（Host）
            // 1. 获取当前登录用户的UserId
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine("Current UserId: " + userId);
            if (userId == null)
            {
                return Unauthorized(new ResponseActivityDto<object> { IsSuccess = false, Message = "User not authenticated" });
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
            await context.SaveChangesAsync();
            return Ok(new ResponseActivityDto<object> { IsSuccess = true, Message = "Created successfully" });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(string id, CreateActivityDto dto)
        {
            var activity = await context.Activities.FindAsync(id); // 必须先从数据库中取出实体对象
            if (activity == null) return NotFound(new ResponseActivityDto<object> { IsSuccess = false, Message = "Activity not found" });

            mapper.Map(dto, activity);     // 将dto的值映射到已经存在的实体对象上,更新现有的实体对象的属性值!!!!!
            await context.SaveChangesAsync();
            return Ok(new ResponseActivityDto<object> { IsSuccess = true, Message = "Updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ResponseActivityDto<object>>> DeleteActivity(string id)
        {
            var activity = await context.Activities.FindAsync(id); // 必须先从数据库中取出实体对象
            if (activity == null) return NotFound();

            context.Activities.Remove(activity);
            await context.SaveChangesAsync();
            return Ok(new ResponseActivityDto<object> { IsSuccess = true, Message = "Deleted successfully" });
        }


    }
}