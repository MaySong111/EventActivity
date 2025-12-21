namespace API.core.Entities
{
    public class Activity
    {
        // 这里为什么不直接用 Guid 类型？可以,但是在很多情况下我们更喜欢用字符串表示 ID，比如在前端传输数据时，字符串更通用
        // 我其他的项目就是直接用的guid--但是前端是需要id的,那前端的url里就会有一大串的guid,不太美观---所以直接将guid转成字符串--就是为了方便前端使用
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string Title { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public required string Description { get; set; }
        public required string Category { get; set; }
        public bool IsCancelled { get; set; }
        // location props
        public required string City { get; set; }
        public required string Venue { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public List<ActivityAttendee> Attendees { get; set; } = [];
    }
}

//如果确实想要string为空,可以用string? 这样就表示这个属性是可空/可选的
// 还可以添加required关键字,表示这个属性是必须的,不能为null
// string vs string? vs required string
// string：说"我不想要 null"，但无法强制在创建时赋值
// required string：不仅说"我不想要 null"，还强制你在创建对象时!!!必须赋值---这就是为什么要用required--检查的时间点早以及要求更严格
// string?：明确允许 null

// 有 required
// public class Book
// {
//     public required string Title { get; set; }  // 必须赋值
// }

// // 现在：
// var book = new Book();  // ❌ 编译错误：必须初始化 Title
// var book = new Book { Title = "C# Guide" };  // ✅ 正确
// -----------------------


// 没有 required
// public class Book
// {
//     public string Title { get; set; }  // 看起来不能为空
// }

// // 但是可以这样创建：
// var book = new Book();  // ✅ 编译通过，但 Title 是 null！
// Console.WriteLine(book.Title.Length);  // 💥 NullReferenceException