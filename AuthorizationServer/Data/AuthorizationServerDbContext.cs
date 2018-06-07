using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AuthorizationServer.Data
{
    public class AuthorizationServerDbContext : IdentityDbContext<IdentityUser>
    {
        public AuthorizationServerDbContext(DbContextOptions options)
            : base(options) { }
    }
}