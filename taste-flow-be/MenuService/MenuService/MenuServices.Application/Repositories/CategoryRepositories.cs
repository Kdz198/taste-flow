using MenuServices.Application.Context;
using MenuServices.Application.Entities;
using MenuServices.Application.Interfaces;

namespace MenuServices.Application.Repositories
{
    public class CategoryRepositories : AsbtractRepositories<Category>
    {
        public CategoryRepositories( AppDbContext context ) : base( context )
        {
        }

        public async Task<IEnumerable<Category>> GetByNameAsync( string name )
        {
            return await Task.FromResult(
                _context.Categories
                .Where( c => c.Name.Contains( name, StringComparison.OrdinalIgnoreCase ) )
                .AsEnumerable()
            );
        }
    }
}
