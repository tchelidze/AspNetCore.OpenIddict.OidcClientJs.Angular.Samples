using AuthorizationServer.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AuthorizationServer.Data
{
    public class AuthorizationServerDbContext : IdentityDbContext<User>
    {
        public AuthorizationServerDbContext(DbContextOptions options)
            : base(options)
        {
        }
    }
}