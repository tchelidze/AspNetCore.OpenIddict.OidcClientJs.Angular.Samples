using System;
using AuthorizationServer.Auth;
using Microsoft.Extensions.DependencyInjection;

namespace AuthorizationServer.Data
{
    public static class DbSeeder
    {
        public static void Seed(IServiceProvider services)
        {
            using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AuthorizationServerDbContext>();
                context.Database.EnsureCreatedAsync().Wait();
                AuthDbSeeder.Seed(services);
            }
        }
    }
}