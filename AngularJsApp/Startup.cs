using System.Collections.Generic;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AngularJsApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration) => Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddCors(it => it.AddPolicy("AllowAny", builder =>
            {
                builder
                    .AllowAnyOrigin()
                    .AllowAnyOrigin()
                    .AllowAnyHeader();
            }));
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = "/index.html";
                    context.Response.StatusCode = 200;
                    await next();
                }
            });

            var options = new DefaultFilesOptions
            {
                DefaultFileNames = new List<string>
                {
                    "/index.html"
                }
            };

            app.UseDefaultFiles(options);
            app.UseStaticFiles();
            app.UseFileServer(false);
            app.UseMvc();
        }
    }
}