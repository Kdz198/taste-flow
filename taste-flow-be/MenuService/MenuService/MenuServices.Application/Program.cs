using MenuServices.Application.Context;
using MenuServices.Application.Entities;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Steeltoe.Discovery.Client;
using Steeltoe.Discovery.Eureka;

namespace MenuServices.Application
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container
            builder.Services.AddControllers();

            // Configure CORS for Swagger endpoint only
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("SwaggerPolicy", builder =>
                {
                    builder.WithOrigins("http://localhost:8080", "https://apigateway-28rx.onrender.com")
                           .WithMethods("GET")
                           .AllowAnyHeader();
                });
            });

            // Configure Eureka Client
            builder.Services.Configure<EurekaClientOptions>(options =>
            {
                options.EurekaServerServiceUrls = "https://eureka-server-8r8p.onrender.com/eureka";
                options.ShouldRegisterWithEureka = true;
                options.ShouldFetchRegistry = true;
            });

            builder.Configuration["eureka:client:serviceUrl:defaultZone"] = "https://eureka-server-8r8p.onrender.com/eureka";
            builder.Services.AddDiscoveryClient(builder.Configuration);

            // Determine port and hostname based on environment
            var isRender = Environment.GetEnvironmentVariable("RENDER") == "true";
            var portStr = Environment.GetEnvironmentVariable("PORT");
            var port = string.IsNullOrEmpty(portStr) ? 80 : int.Parse(portStr); // Use Render-assigned port or 80
            builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

            builder.Services.PostConfigure<EurekaInstanceOptions>(options =>
            {
                options.AppName = "MENU-SERVICE";
                options.HostName = "menu-service-bqae.onrender.com"; // Public URL
                options.NonSecurePort = port; // Sync with WebHost port
                options.NonSecurePortEnabled = true;
                options.SecurePortEnabled = false;
                options.InstanceId = $"MENU-SERVICE:menu-service-bqae.onrender.com:{options.NonSecurePort}";
                options.StatusPageUrl = $"http://menu-service-bqae.onrender.com:{options.NonSecurePort}/actuator/info";
                options.HealthCheckUrl = $"http://menu-service-bqae.onrender.com:{options.NonSecurePort}/actuator/health";
                options.StatusPageUrlPath = "/actuator/info";
                options.HealthCheckUrlPath = "/actuator/health";
            });

            // Add Health Checks
            builder.Services.AddHealthChecks();

            // Swagger/OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Repositories and MediatR
            builder.Services.AddScoped<IRepositories<Menu>, MenuRepositories>();
            builder.Services.AddScoped<IRepositories<Category>, CategoryRepositories>();
            builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

            // Database
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("MenuDbConnection")));

            var app = builder.Build();

            // Configure HTTP pipeline
            app.UseCors("SwaggerPolicy"); // Apply CORS policy before Swagger
            app.UseSwagger(c => c.RouteTemplate = "api/menus/swagger/{documentName}/swagger.json");
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/api/menus/swagger/v1/swagger.json", "Menu Service V1");
                c.RoutePrefix = "swagger-ui";
            });

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Health check endpoint
            app.MapHealthChecks("/actuator/health", new HealthCheckOptions
            {
                ResponseWriter = async (context, report) =>
                {
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync("{\"status\":\"UP\"}");
                }
            });

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            Console.WriteLine("Resolved Eureka URL: " + builder.Configuration["eureka:client:serviceUrl:defaultZone"]);
            Console.WriteLine($"🌐 Running on PORT: {port}");
            app.Run();
        }
    }
}