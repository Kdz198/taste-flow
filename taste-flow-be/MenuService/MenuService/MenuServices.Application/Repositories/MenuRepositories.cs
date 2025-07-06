using MenuServices.Application.Context;
using MenuServices.Application.Entities;
using MenuServices.Application.Interfaces;

namespace MenuServices.Application.Repositories
{
    public class MenuRepositories : AsbtractRepositories<Menu>
    {
        public MenuRepositories( AppDbContext context ) : base( context )
        {
        }
    }
}
