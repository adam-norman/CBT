using Customers.API.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Customers.API.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Customer> Customers { get; set; }
    }
}
