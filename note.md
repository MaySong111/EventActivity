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