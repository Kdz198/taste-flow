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
    }
}
