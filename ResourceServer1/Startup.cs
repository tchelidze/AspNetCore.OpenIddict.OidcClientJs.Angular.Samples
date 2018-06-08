using System;
using AspNet.Security.OAuth.Introspection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ResourceServer1
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(options =>
                {
                    options.DefaultScheme = OAuthIntrospectionDefaults.AuthenticationScheme;
                })
                .AddOAuthIntrospection(options =>
                {
                    options.Authority = new Uri("http://localhost:7111/");
                    options.Audiences.Add("ResourceServer1");
                    options.ClientId = "ResourceServer1";
                    options.ClientSecret = "b7a497c7-02b2-4705-a11f-b1f310d5ddaa";
                    options.RequireHttpsMetadata = false;
                });

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseCors(builder =>
            {
                /*todo client's domain*/
                builder.WithOrigins("http://localhost:7222");
                builder.WithMethods("GET");
                builder.WithHeaders("Authorization");
            });

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    "default",
                    "{controller=PublicResource}/{action=Index}"
                );

                routes.MapRoute(
                    "api",
                    "api/{controller=PublicResource}/{action=Index}",
                    new { controller = "Resource" }
                );
            });
        }
    }
}