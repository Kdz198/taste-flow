using MediatR;
using MenuServices.Application.Helpers;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Menu.MediatR.CreateMenu
{
    public class CreateMenuCommandHandler : IRequestHandler<CreateMenuCommand, ApiResponse<MenuServices.Application.Entities.Menu>>
    {
        private readonly MenuRepositories _menuRepositories;
        private readonly CategoryRepositories _categoryRepositories;

        public CreateMenuCommandHandler( IRepositories<Entities.Menu> menuRepositories, IRepositories<Entities.Category> categoryRepositories )
        {
            _menuRepositories = ( MenuRepositories ) ( menuRepositories ?? throw new ArgumentNullException( nameof( menuRepositories ) ) );
            _categoryRepositories = ( CategoryRepositories ) ( categoryRepositories ?? throw new ArgumentNullException( nameof( categoryRepositories ) ) );
        }

        public Task<ApiResponse<Entities.Menu>> Handle( CreateMenuCommand request, CancellationToken cancellationToken )
        {
            var categoriesTask = _categoryRepositories.GetAllAsync();
            var categories = categoriesTask.Result.ToList();

            var menu = request.ConvertCreateCommandToMenu( categories );
            var result = _menuRepositories.AddAsync( menu );

            if( result.Result == null )
            {
                return Task.FromResult( new ApiResponse<Entities.Menu>( false, "Cannot add data", null! ) );
            }

            return Task.FromResult( new ApiResponse<Entities.Menu>( true, "Data added successfully", result.Result ) );
        }
    }
}
