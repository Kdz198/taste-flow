
using MenuServices.Application.Context;
using MenuServices.Application.Entities;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;
using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;
using Steeltoe.Discovery.Eureka;

namespace MenuServices.Application
{
    public class Program
    {
        public static void Main( string[] args )
        {
            var builder = WebApplication.CreateBuilder( args );

            // Add services to the container.
            builder.Services.AddControllers();

            //Sign in with Eureka
            
            builder.Services.Configure<EurekaClientOptions>(options =>
            {
                options.EurekaServerServiceUrls = "https://eureka-server-8r8p.onrender.com/eureka";
                options.ShouldRegisterWithEureka = true;
                options.ShouldFetchRegistry = true;
            });
            
            builder.Configuration["eureka:client:serviceUrl:defaultZone"] = "https://eureka-server-8r8p.onrender.com/eureka";
            builder.Services.AddDiscoveryClient(builder.Configuration);

            var isRender = Environment.GetEnvironmentVariable("RENDER") == "true";
            var hostname = isRender ? "menu-service-bqae.onrender.com" : "localhost";
            var portStr = Environment.GetEnvironmentVariable("PORT");
            var port = string.IsNullOrEmpty(portStr) ? 5252 : int.Parse(portStr);
            builder.WebHost.UseUrls($"http://0.0.0.0:{port}"); // phải là 0.0.0.0 để mở port public
            builder.Services.PostConfigure<EurekaInstanceOptions>(options =>
            {
                options.AppName = "MENU-SERVICE";
                options.HostName = "Menu_Service"; // Internal service name
                options.NonSecurePort = int.Parse(Environment.GetEnvironmentVariable("PORT") ?? "10000"); // Sử dụng port thực tế
                options.NonSecurePortEnabled = true;
                options.SecurePortEnabled = false;
                options.InstanceId = $"MENU-SERVICE:Menu_Service:{options.NonSecurePort}"; // Thêm port để duy nhất
                options.StatusPageUrl = $"http://Menu_Service:{options.NonSecurePort}/actuator/info";
                options.HealthCheckUrl = $"http://Menu_Service:{options.NonSecurePort}/actuator/health";
                options.StatusPageUrlPath = "/actuator/info";
                options.HealthCheckUrlPath = "/actuator/health";
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IRepositories<Menu>, MenuRepositories>();
            builder.Services.AddScoped<IRepositories<Category>, CategoryRepositories>();
            builder.Services.AddMediatR( cfg => cfg.RegisterServicesFromAssembly( typeof( Program ).Assembly ) );
            builder.Services.AddDbContext<AppDbContext>( options =>
                options.UseNpgsql( builder.Configuration.GetConnectionString( "MenuDbConnection" ) ) );
            var app = builder.Build();

            // Configure the HTTP request pipeline.

            // Swagger Middleware
            app.UseSwagger( c =>
            {
                c.RouteTemplate = "api/menus/swagger/{documentName}/swagger.json";
            } );

            app.UseSwaggerUI( c =>
            {
                c.SwaggerEndpoint( "/api/menus/swagger/v1/swagger.json", "Menu Service V1" );
                c.RoutePrefix = "swagger-ui"; // UI will be at /swagger-ui
            } );

            if( app.Environment.IsDevelopment() )
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            ;

            app.UseHttpsRedirection();

            app.UseAuthorization();
            

            app.MapControllers();
            Console.WriteLine("Resolved Eureka URL: " + builder.Configuration["eureka:client:serviceUrl:defaultZone"]);
            Console.WriteLine($"🌐 Running on PORT: {port}");
            app.Run();
        }
    }
}
