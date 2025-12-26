using API.core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.core.AppDbContext
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
    {
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        
        override protected void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // 配置 ActivityAttendee 的复合主键
            builder.Entity<ActivityAttendee>()
                .HasKey(aa => new { aa.ActivityId, aa.UserId });

            // 配置 Activity 和 ActivityAttendee 之间的关系
            builder.Entity<ActivityAttendee>()
                .HasOne(aa => aa.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            // 配置 User 和 ActivityAttendee 之间的关系
            builder.Entity<ActivityAttendee>()
                .HasOne(aa => aa.User)
                .WithMany(u => u.Activities)
                .HasForeignKey(aa => aa.UserId);
        }
    }
}