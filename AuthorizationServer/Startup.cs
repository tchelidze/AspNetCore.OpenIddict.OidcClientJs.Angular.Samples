using AspNet.Security.OpenIdConnect.Primitives;
using AuthorizationServer.Auth;
using AuthorizationServer.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenIddict.Core;

namespace AuthorizationServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddDbContext<AuthorizationServerDbContext>(options =>
                {
                    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
                    options.UseOpenIddict();
                });

            services
                .AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<AuthorizationServerDbContext>();

            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            services.AddOpenIddict(options =>
            {
                options.AddEntityFrameworkCoreStores<AuthorizationServerDbContext>();

                options.AddMvcBinders();

                options
                    .EnableAuthorizationEndpoint("/connect/authorize")
                    .EnableLogoutEndpoint("/connect/logout")
                    .EnableIntrospectionEndpoint("/connect/introspect");
                /*todo */
                //.EnableUserinfoEndpoint("/api/userinfo");

                options.RegisterScopes(
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIddictConstants.Scopes.Roles,
                    MyAuthorizationServerConstants.Scopes.ResourceServer1Api,
                    MyAuthorizationServerConstants.Scopes.ResourceServer2Api);

                options.EnableScopeValidation();

                options.AllowImplicitFlow();

                options.DisableHttpsRequirement();

                // For testing purpose only. It's 'in-memory' signing key and will be discarded on application restart.
                options.AddEphemeralSigningKey();

                options.UseJsonWebTokens();
            });

            services
                .AddAuthentication()
                .AddOAuthValidation();

            services
                .AddCors();

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors(builder =>
            {
                // Allow request from Client's origin.
                builder.WithOrigins("http://localhost:4321");
                builder.WithMethods("GET");
                builder.WithHeaders("Authorization");
            });

            app.UseAuthentication();

            app.UseMvcWithDefaultRoute();

            DbSeeder.Seed(app.ApplicationServices);
        }
    }
}