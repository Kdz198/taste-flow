using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Menu.MediatR.GetMenuById
{
    public class GetMenuByIdQueryHandler : IRequestHandler<GetMenuByIdQuery, ApiResponse<MenuServices.Application.Entities.Menu>>
    {
        private readonly MenuRepositories _menuRepositories;
        public GetMenuByIdQueryHandler( IRepositories<Entities.Menu> menuRepositories )
        {
            _menuRepositories = ( MenuRepositories ) menuRepositories;
        }

        public async Task<ApiResponse<MenuServices.Application.Entities.Menu>> Handle( GetMenuByIdQuery request, CancellationToken cancellationToken )
        {
            var menu = await _menuRepositories.GetByIdAsync( request.id );
            if( menu == null )
            {
                return new ApiResponse<MenuServices.Application.Entities.Menu>(
                    success: false,
                    message: "Menu not found",
                    data: null!
                );
            }

            return new ApiResponse<MenuServices.Application.Entities.Menu>(
                success: true,
                message: "Finding Success",
                data: menu
            );
        }
    }
}
