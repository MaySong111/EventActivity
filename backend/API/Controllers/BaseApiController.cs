using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {

    }
}


// 控制器也是类，可以继承自定义的基类BaseApiController，从而共享一些通用的功能或配置
// 那其他的控制器就可以继承这个基础的控制器 就不是继承ControllerBase这个了