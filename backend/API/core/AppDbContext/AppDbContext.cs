using API.core.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.core.AppDbContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }
    }
}