﻿using MenuServices.Application.Entities;
using Microsoft.EntityFrameworkCore;

namespace MenuServices.Application.Context
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public AppDbContext( DbContextOptions<AppDbContext> options ) : base( options )
        {
        }
        protected override void OnModelCreating( ModelBuilder modelBuilder )
        {
            base.OnModelCreating( modelBuilder );
            modelBuilder.Entity<Entities.Menu>().ToTable( "Menus" );
            modelBuilder.Entity<Entities.Category>().ToTable( "Categories" );
            modelBuilder.Entity<Entities.Ingredient>().ToTable( "Ingredients" );
            modelBuilder.Entity<Entities.Ingredient>()
                .HasKey( i => new { i.MenuId, i.Id } );
            modelBuilder.Entity<Menu>()
                .Property( m => m.Price )
                .HasPrecision( 18, 4 );
        }
        public DbSet<Entities.Menu> Menus
        {
            get; set;
        } = null!;
        public DbSet<Entities.Category> Categories
        {
            get; set;
        } = null!;
        public DbSet<Entities.Ingredient> Ingredients
        {
            get; set;
        } = null!;
    }
}
