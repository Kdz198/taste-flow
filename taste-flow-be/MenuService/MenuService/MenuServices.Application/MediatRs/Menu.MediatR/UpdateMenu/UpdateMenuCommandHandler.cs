using MediatR;
using MenuServices.Application.Helpers;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Menu.MediatR.UpdateMenu
{
    public class UpdateMenuCommandHandler : IRequestHandler<UpdateMenuCommand, ApiResponse<Entities.Menu>>
    {
        private readonly MenuRepositories _menuRepository;
        private readonly CategoryRepositories _categoryRepository;

        public UpdateMenuCommandHandler( IRepositories<Entities.Menu> menuRepository, IRepositories<Entities.Category> categoryRepository )
        {
            _menuRepository = ( MenuRepositories ) ( menuRepository ?? throw new ArgumentNullException( nameof( menuRepository ) ) );
            _categoryRepository = ( CategoryRepositories ) ( categoryRepository ?? throw new ArgumentNullException( nameof( categoryRepository ) ) );
        }

        public async Task<ApiResponse<Entities.Menu>> Handle( UpdateMenuCommand request, CancellationToken cancellationToken )
        {
            var menu = await _menuRepository.GetByIdAsync( request.id );
            if( menu == null )
            {
                return new ApiResponse<Entities.Menu>( false, "Menu not found", null! );
            }
            if( request.CategoriesId == null || !request.CategoriesId.Any() )
            {
                return new ApiResponse<Entities.Menu>( false, "Categories cannot be empty", null! );
            }

            if( request.IngredientsId == null || !request.IngredientsId.Any() )
            {
                return new ApiResponse<Entities.Menu>( false, "Ingredients cannot be empty", null! );
            }

            var categories = ( await _categoryRepository.GetAllAsync() ).ToList();
            var updatedMenu = request.ConvertUpdateCommandToMenu( menu, categories );

            var result = await _menuRepository.UpdateAsync( updatedMenu );
            if( result == null )
            {
                return new ApiResponse<Entities.Menu>( false, "Cannot update data", null! );
            }
            return new ApiResponse<Entities.Menu>( true, "Data updated successfully", result );
        }
    }
}
