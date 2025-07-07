using MenuServices.Application.Context;
using MenuServices.Application.Entities;
using MenuServices.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MenuServices.Application.Repositories
{
    public class MenuRepositories : AsbtractRepositories<Menu>
    {
        public MenuRepositories( AppDbContext context ) : base( context )
        {
        }

        public override async Task<IEnumerable<Menu>> GetAllAsync()
        {
            return await _context.Menus
                .Include( m => m.Categories )
                .Include( m => m.Ingredients )
                .ToListAsync();
        }

        public override async Task<Menu> GetByIdAsync( int id )
        {
            var menu = await _context.Menus
                .Include( m => m.Categories )
                .Include( m => m.Ingredients )
                .FirstOrDefaultAsync( m => m.Id == id );
            return menu!;
        }
    }
}
