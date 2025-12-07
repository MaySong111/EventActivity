# 文件夹结构
YourProject/
├── Data/
│   ├── AppDbContext.cs           // DbContext
│   ├── Configurations/           // Entity 配置（可选）
│   │   ├── BookConfiguration.cs
│   │   └── UserConfiguration.cs
│   └── Seed/                     // 🎯 种子数据放这里
│       ├── DatabaseSeeder.cs     // 主 Seeder
│       ├── BookSeeder.cs         // 具体的 Seeder
│       └── UserSeeder.cs
│
├── Entities/                     // 实体类
│   ├── Book.cs
│   ├── User.cs
│   └── Category.cs
│
├── Migrations/                   // EF 自动生成的迁移文件
│
└── Program.cs


前端: 
 src/
├── App.jsx
├── Navbar.jsx
└── pages/
    ├── HomePage.jsx
    ├── ActivitiesPage.jsx
    └── ActivityCard.jsx
就两层,简单点, 不要弄复杂


# login逻辑
用户登录成功 → 存 Token → Navbar 显示用户名和头像

# react query--读取数据（GET）--就是get请求
现在叫Tanstack query
替代的是: useEffect + fetch + useState
不是zustand

1. const result = useQuery(参数对象)
参数对象只需要 2 个必填属性：
参数是不是固定两个？不是固定只能两个！!!!
  queryKey 和 queryFn 是必填的
但还可以有可选的其他属性，比如：
  enabled: false - 不自动执行
  staleTime: 5000 - 缓存时间
  refetchOnWindowFocus: false - 窗口聚焦时不重新请求
但是！对于初学者，你只需要记住这两个必填的就够了


1) queryKey - 给这个请求起个名字
queryKey: ['activities']    就是个数组，里面放字符串。就像给缓存起个名字。

2) queryFn - 怎么获取数据
这个的属性值必须是函数!!!且 函数返回值必须是 Promise
// ❌ 错误
queryFn: '...'  // 不能是字符串
queryFn: 123    // 不能是数字

queryFn: () => fetch('https://localhost:5001/api/activities').then(res => res.json())

+
2. useQuery 返回什么？返回一个对象
const { data, isLoading, error } = useQuery({...})

data - 获取到的数据（就是你之前的 activities）
isLoading - 是否正在加载（true / false）
error - 如果出错了，错误信息在这里

3. queryKey 到底干什么？
1) 场景 1：在多个地方用同一个数据

// 组件 A
function ComponentA() {
  const { data } = useQuery({
    queryKey: ['activities'],  // ← 名字是 'activities'
    queryFn: fetchActivities
  });
}

// 组件 B（完全不同的组件）
function ComponentB() {
  const { data } = useQuery({
    queryKey: ['activities'],  // ← 同样的名字
    queryFn: fetchActivities
  });
}
结果：只会发一次请求！ 因为名字一样，React Query 知道这是同一个数据。 
!!!! 不像之前fetch在两个组件中使用,哪怕是一样的, 那也是两次请求, 所以那函数的参数中的缓存原来是这样用的, 也就是后续的再次使用这个函数且用的缓存的名字一样的时候,这个时候 会用缓存的!!!!!!

2) 场景 2：区分不同的数据
// 获取所有活动
useQuery({
  queryKey: ['activities'],  // ← 名字 A
  queryFn: fetchAllActivities
});

// 获取 ID=5 的活动
useQuery({
  queryKey: ['activity', 5],  // ← 名字 B（不一样）
  queryFn: () => fetchActivityById(5)
});


结果：会发两次请求。 因为名字不一样，React Query 认为是不同的数据。


4. 对比: React Query 管服务器数据，Zustand 管客户端状态
参数对象的属性名是固定的还是自定义的？

1) Zustand（自定义属性名）
const useStore = create((set) => ({
  // ✅ 你想叫什么就叫什么
  activities: [],
  count: 0,
  userName: 'Bob',
  随便什么名字: '都可以'
}));
Zustand 不限制属性名，因为它是你自己的状态管理。甚至可以没有属性名,就是直接传递参数 函数名(参数1,参数2)


2) React Query（固定属性名）
useQuery({
  queryKey: ['activities'],  // ✅ 必须叫 queryKey
  queryFn: fetchActivities,  // ✅ 必须叫 queryFn
  enabled: true,             // ✅ 可选，但名字也是固定的
  staleTime: 5000           // ✅ 可选，但名字也是固定的
})

// ❌ 错误
useQuery({
  key: ['activities'],       // ❌ 不能叫 key
  fetchFunction: fetch,      // ❌ 不能叫 fetchFunction
  myCustomName: '...'        // ❌ 不认识的属性名
})
React Query 是别人写的库，属性名是固定的，必须按它的规则写。


```js
// useQuery 的定义（简化版）
function useQuery({ queryKey, queryFn }) {
  // 内部逻辑...
}

// 调用时必须传对象(必须写成对象的形式，属性名也必须是固定的)
useQuery({
  queryKey: ['activities'],
  queryFn: fetchActivities
});
```

## 详细的步骤
```jsx
步骤 1：定义 API 函数
// api/activities.js
export async function fetchActivities() {
  const res = await fetch('https://localhost:5001/api/activities');
  if (!res.ok) throw new Error('失败');
  return res.json();
}


步骤 2：在组件里调用 useQuery
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from './api/activities';

function ActivitiesPage() {
  // 调用 useQuery，传入固定的属性名
  const result = useQuery({
    queryKey: ['activities'],  // 属性名必须是 queryKey
    queryFn: fetchActivities   // 属性名必须是 queryFn
  });

  // result 是一个对象，包含：
  // {
  //   data: [...],        // 获取到的数据
  //   isLoading: true,    // 是否加载中
  //   error: null,        // 错误信息
  //   ...更多属性
  // }

  console.log(result);
}


步骤 3：从返回值里取数据
推荐解构
const { data, isPending, error } = useQuery({
  queryKey: ['activities'],
  queryFn: fetchActivities
});

// 现在可以直接用 data, isLoading, error
也就是步骤二和步骤三合并

步骤3: 解构 + 重命名
const { data: events, isPending, error } = useQuery({
  queryKey: ['activities'],
  queryFn: fetchActivities
});

// 把 data 重命名为 events,注意这的data是后端返回的数据, 和queryKey: ['activities']没关系--这个就是一个key, 这个key就缓存识别用的名字,并不是说要 像localStorage.getItem那样用key 取出来, 不是的!!!!



步骤 4：使用数据
function ActivitiesPage() {
  const { data: events = [], isPending, error } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities
  });

  // 处理加载状态
  if (isPending) {
    return <div>加载中...</div>;
  }

  // 处理错误
  if (error) {
    return <div>出错了: {error.message}</div>;
  }

  // 使用数据
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}

解释: 
因为 useQuery() 在请求还没完成时，data 通常是 undefined
如果不设置默认值，下面这一句会报错：
events.map(...)

有默认值则非常安全:
const { data: events = [] } = useQuery(...)
events.map(...)                // ✔️ 不会报错，即使 data 是 undefined

= [] 是给重命名后的变量 events 设定默认值为空数组，避免因 data 未返回导致报错。

注意:
任何解构都能使用：
const [first = 0] = arr;
const { name = 'Unknown' } = user;            
其实完整的是: const { name:name = 'Unknown' } = user;  因为左右相同所以简写
左边的name是从 user 对象提取 name 属性,将它赋给右边的一个叫 name 的本地变量,如果提取到的值是 undefined，则使用默认值 'Unknown'


先正常解构, 然后就是给这个右边的赋值
```


```jsx
const user = { age: 20 };
解构这个user:
const { name = 'Unknown', age } = user;

console.log(name); // 'Unknown', 因为提取到name是undefined
console.log(age);  // 20

```

| 名字                           | 来源                   | 含义                   | 和 fetch 的数据关系 |
| ---------------------------- | -------------------- | --------------------------- | ------------- |
| **queryKey: ['activities']** | 配置 useQuery 时你自己起的名字 | 缓存的唯一标识          | 用来找到这一份数据     |
| **data 作为返回值**               | useQuery hook 自动提供   | 真正的后端请求结果       | 用来在 UI 中展示的数据 |
| **data: activities（解构重命名）**  | JS/TS 解构语法   | 把 data 这个名字改成 activities 变量 | 更易理解它是什么      |



# useMutation - 修改数据(增加/删除/更新)---修改数据，手动触发
对比:
useQuery -读取数据，自动执行!!!!!!!
const { data: activities } = useQuery({
  queryKey: ['activities'],
  queryFn: fetchActivities  // GET 请求
});


## useMutation 的参数详解
```jsx
const mutation = useMutation({
  // 必填：执行的函数
  mutationFn: createActivity,

  // 可选：成功后执行
  onSuccess: (data) => {
    console.log('成功了', data);
    queryClient.invalidateQueries({ queryKey: ['activities'] });
  },

  // 可选：失败后执行
  onError: (error) => {
    console.log('失败了', error);
    alert('操作失败');
  },

  // 可选：无论成功失败都执行
  onSettled: () => {
    console.log('完成了');
  }
});
```


# useMutation 返回什么
```jsx
const mutation = useMutation({ ... });

// mutation 对象包含：
{
  mutate: (data) => {},    // 触发请求的函数
  isPending: false,        // 是否正在执行
  isSuccess: false,        // 是否成功
  isError: false,          // 是否失败
  error: null,             // 错误信息
  data: null,              // 返回的数据
  reset: () => {}          // 重置状态
}
```




# mac专用的, 下载了--oh my zash
这样打开zsh terminal就会看到具体在什么分支操作的, 很清楚
https://ohmyz.sh/#install


# 前端reactjs, 用mui V6.5.0版本

# 让前端地址变成是https
安装:mkcert
执行命令: npm i -D vite-plugin-mkcert
作用是: 在本地电脑上创建一个本地证书颁发机构,由于本地电脑信任本地ca,因此浏览器也会信任这个证书
当然这个不是可以在互联网上可以使用的 有效证书--本质上还是一个自签名证书,但是浏览器会信任它

我的电脑是可以的, 但是并不是所有人的电脑都可以--不可以的话,用http也可以的,不用纠结花时间

不行, 因为可以启动--页面显示---但是几秒之后就 terminal退出了 -且页面显示报错, --最后还是改成了http的,把配置注释了



# 很重要的问题, 点击每一个blog view按钮--那显示这个blog的内容在同一个页面怎么实现呢/ 有很多方法,  哪个好呢!!!!!!!!!!!!!!!!
ActivityList.jsx---对应这个项目叫ActivityList
ActivityDetail.jsxx---对应这个项目叫ActivityCard


为什么说这个问题重要呢, 其实无论最终显示的多花里胡哨, 什么左边是每一个card显示每一个blog, 点击后右边怎么显示好看, 其实本质都是这个标题的问题
先知道怎么处理这个--剩下的就是添加样式了. !!!!!!!! 这就是很简单的显示出来map结果了--但是怎么一步步变成了最后那样的显示内容了, 本质就是这个问题--+ 再添加样式
这个问题想清楚, 才能真正看懂下面的,不然根本梳理不清楚, 会觉得非常乱的

---------------------

你看图, 从后端获取的数据---然后map显示到页面上--但是我 还想要点击这个view 显示这个view对应的blog--不是跳转到一个新的页面(那我知道总结用link就行了 最简单 是不是? ---但是现在是显示在同一一个页面比如就在右边--那要怎么实现呢,  第一; 我知道有一个是 view绑定一个事件函数 传递id --然后  这个事件函数 再发请求获取这个id的信息--然后返回的结果 显示在右边--但是这个是不是会造成一个问题, 那就是 再次发请求 造成浪费呢---- 那实际上是怎么解决这个问题的呢

![alt text](image.png)


重新问claude---很重要
2. App.jsx页面, ActivityList.jsx - Navbar.jsx----- 我现在不知道到底怎么样才合适: 在主页 《navbar> <Bloglist> ---主页显示后端的数据 list---那到底将fetch放到ActivityList.jsx --然后这个 这个写activities.map--然后将这个子组件放到 App.jsx页面中呢--- 还是选择fetch放到 App.jsx中然后 使用子组件 在子组件上传递参数呢? ----- 第二: - activities.map每一个activity 都有一个view button的--想要实现的是 点击这个view 显示这个view对应的blog--不是跳转到一个新的页面 显示在同一一个页面比如就在右边 ------ 这个涉及两个方面的问题

两个问题决定了 fetch到底放到: 放到哪里合适呢放 App.jsx 或 ActivityList.jsx?????


方案 1：fetch 在 ActivityList.jsx，App.jsx 管理布局
App.jsx
 ├─ Navbar
 ├─ ActivityList (自己 fetch 数据)
 └─ BlogDetail
流程分析
1) ActivityList.jsx 自己 fetch 数据，并 map 渲染列表。
2) 每个 activity 有个 View 按钮。
3) 点击 View 需要把这个 activity “传给” BlogDetail。

关键：BlogDetail 在 App.jsx。
ActivityList.jsx 需要把被点击的 activity 或 id “上抛”给父组件 App.jsx： --这就是子 传递给父了!!!!!!
这个方案在子传递父(只是id的话,那父肯定是要再重新fetch的. 如果是 返回的具体的这个activity的内容话--父就不需要重新 fetch请求)

```jsx
// App.jsx
const [selectedActivity, setSelectedActivity] = useState(null);
<ActivityList onView={setSelectedActivity} />
<BlogDetail activity={selectedActivity} />


// ActivityList.jsx
activities.map(activity => (
  <button onClick={() => onView(activity)}>View</button>
))
```


方案 2：fetch 在 App.jsx，列表和详情都是子组件
App.jsx
 ├─ Navbar
 ├─ ActivityList (props: activities, onView)
 └─ BlogDetail (props: selectedActivity)
```jsx
1App.jsx fetch 数据：

const [activities, setActivities] = useState([]);
const [selectedActivity, setSelectedActivity] = useState(null);

useEffect(() => {
  fetch("/api/activities")
    .then(res => res.json())
    .then(data => setActivities(data));
}, []);
function onView(activity) {
    setSelectedActivity(xxx)
}


2ActivityList.jsx 只负责渲染列表：
activities.map(activity => (
  <button onClick={() => onView(activity)}>View</button>
))

3BlogDetail.jsx 直接用 selectedActivity 渲染：
{selectedActivity && <BlogDetail activity={selectedActivity} />}
```

问题: 
其实这两个方法一样的,  --好方法2  你需传递data----到activities.map(activity => (
  <button onClick={() => onView(activity)}>View</button>
))--然后这个呢 子组件也是要 传递 数据给父的--调用父的函数----- 好 然后父会执行这个函数----- 
const [activities, setActivities] = useState([]);
const [selectedActivity, setSelectedActivity] = useState(null);

useEffect(() => {
  fetch("/api/activities")
    .then(res => res.json())
    .then(data => setActivities(data));
}, []);
function onView(activity) {
    setSelectedActivity(xxx)
}   然后父再将这个传递给 另一个子组件? ----但是和方法1 基本一样呢-方法1: 子组件显示list--但是子组件是放到 父组件中的呢----那子组件显示了 不就是父显示吗   然后也是 这个list子组件 传递这个 activity给父-父再 传递参数给BlogDetail --整个过程一样的啊


都是子组件点击按钮 → 调用父组件函数 → 父组件更新状态 → 父组件把状态传给另一个子组件显示
唯一的区别在于 fetch 的位置：
方法 1：fetch 在子组件（ActivityList）内部 → 父组件对列表数据一无所知，只能接收“被选中的 activity”。
方法 2：fetch 在父组件（App.jsx） → 父组件同时知道完整列表和选中状态，传给子组件渲染列表或详情。






3. 

import { Grid2, Box } from "@mui/material";
import ActivityCard from "./ActivityCard";

export default function ActivityList({ activities, onView }) {
  return (
    <Grid2 container>
      <Grid2 size={9}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {activities.map((item) => (
            <ActivityCard key={item.id} activity={item} onView={onView} />
          ))}
        </Box>
      </Grid2>
    </Grid2>
  );
}

// 这个组件放App.jsx中,执行的顺序是: App.jsx -> ActivityList.jsx 这显示内容,然后将每一个activity传递给-> ActivityCard.jsx
// 然后在ActivityCard.jsx中显示每一个activity的详细内容
// 但是为什么ActivityCard.jsx中还要传递一个onView函数进去呢? 因为显示每一个activity的时候,还需要一个按钮来查看这个activity的详细内容
// 用户点击这个按钮, 实际上是点击的ActivityCard.jsx中的View按钮, 这个按钮会调用onView函数, 将当前的activity传递给App.jsx
// 然后App.jsx中会将这个activity设置为selectedActivity, 然后将selectedActivity传递给ActivityCard组件, 显示这个activity的详细内容
// 这样就实现了点击每一个activity的View按钮, 显示这个activity的详细内容的功能 

我说实话, 现在我都绕, 更不要说以后了  本来没用ActivityCard的, 而是ActivityList这里用list标签显示的,然后定义一个detail.jsx
然后这个detail子组件是放到父App.jsx中的, 就是上面的思路
但是现在用ActivityCard 替代 原来 手写在ActivityList这里用list标签--然后也传递函数onview给这个子组件,但是这个组件并没有放到App.jsx中的, 而是复用这个

真的绕




#  我用的是JWT Token 认证--所以注册,登录都是用的userManager
客户端保存 Token，每次请求带上

1. 注册流程：
  用 UserManager.FindByEmailAsync() 查找用户--是否存在
  用 UserManager.CreateAsync() 创建用户
  用 UserManager.AddToRoleAsync() 分配角色
  返回成功消息

2. 登录流程：
  用 UserManager.FindByEmailAsync() 查找用户--是否存在
  用 UserManager.CheckPasswordAsync() 验证密码
  用你的 JwtTokenCreator 生成 Token
  返回 Token 给前端

3. 认证流程：
  前端每次请求带上 Token
  后端用 JWT 中间件自动验证



# ActivityDetailPage到底是用! 还是用null判断
if(!activity) return <div>Activity not found</div>;

!activity  // 以下情况都返回 true：
- activity === null          ✓
- activity === undefined     ✓
- activity === 0             ✓ (数字0)
- activity === ""            ✓ (空字符串)
- activity === false         ✓
- activity === {}            ✗ (空对象是 truthy!)


activity == null 只匹配：
activity == null  // 只有这两种情况返回 true：
- activity === null          ✓
- activity === undefined     ✓




推荐---不设置默认值:

const { data: activity, isPending } = useQuery(...);
if (isPending) return <div>Loading...</div>;
if (!activity) return <div>Activity not found</div>;
// 现在 !activity 能正常工作了


# ActivityDetailPage.jsx中的4个部分是直接复制老师的代码的
因为老师说没有意义,都是一些样式,直接复制就行了

# 调整显示的日期形式
从后端返回的日期都是; 2025-11-02T03:10:48.323188Z 这样形式的

先安装包:--这个是目前最流行的修改日期的小安装包
npm i date-fns
