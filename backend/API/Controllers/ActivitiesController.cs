using API.core.AppDbContext;
using API.core.Dtos;
using API.core.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // 这个新写法,当只有一个构造函数的时候,那可以用主构造函数简化写法,而不是之前的定义构造函数,传递参数--生成private readonly 字段--然后在构造函数中赋值
    public class ActivitiesController(AppDbContext context, IMapper mapper, UserManager<User> userManager) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            var activities = await context.Activities.ToListAsync();
            return Ok(activities);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivityById([FromRoute] string id)
        {
            var activity = await context.Activities.FindAsync(id);
            if (activity == null) return NotFound();
            return Ok(activity);
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateActivity(CreateActivityDto dto)
        {
            var activity = mapper.Map<Activity>(dto);
            // 此时并没有调用数据库, 实际上是在内存中创建了一个实体对象,所以并不需要用AddAsync异步方法!!!!
            context.Activities.Add(activity);
            await context.SaveChangesAsync();
            // return CreatedAtAction(nameof(GetActivityById), new { id = activity.Id }, activity);
            return Ok(activity.Id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(string id, CreateActivityDto dto)
        {
            var activity = await context.Activities.FindAsync(id); // 必须先从数据库中取出实体对象
            if (activity == null) return NotFound();

            mapper.Map(dto, activity);     // 将dto的值映射到已经存在的实体对象上,更新现有的实体对象的属性值!!!!!
            await context.SaveChangesAsync();
            return NoContent();         // 返回204状态码,表示请求成功,但是没有内容返回
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(string id)
        {
            var activity = await context.Activities.FindAsync(id); // 必须先从数据库中取出实体对象
            if (activity == null) return NotFound();

            context.Activities.Remove(activity);
            await context.SaveChangesAsync();
            return Ok();
        }

    }
}