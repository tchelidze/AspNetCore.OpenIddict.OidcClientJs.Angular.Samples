using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AuthorizationServer.Data
{
    public class AuthorizationServerDbContext : IdentityDbContext<IdentityUser>
    { 
    }
}