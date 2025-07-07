
using MenuServices.Application.Context;
using MenuServices.Application.Entities;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;
using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;

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
            builder.Services.AddDiscoveryClient(builder.Configuration);
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IRepositories<Menu>, MenuRepositories>();
            builder.Services.AddScoped<IRepositories<Category>, CategoryRepositories>();
            builder.Services.AddMediatR( cfg => cfg.RegisterServicesFromAssembly( typeof( Program ).Assembly ) );
            builder.Services.AddDbContext<AppDbContext>( options =>
                options.UseSqlServer( builder.Configuration.GetConnectionString( "MenuDbConnection" ) ) );
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if( app.Environment.IsDevelopment() )
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            //Config Eureka Server
            app.UseDiscoveryClient();
            
            app.MapControllers();

            app.Run();
        }
    }
}
