using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Menu.MediatR.GetAllMenu
{
    public class GetAllMenuQueryHandler : IRequestHandler<GetAllMenuQuery, ApiResponse<List<MenuServices.Application.Entities.Menu>>>
    {
        private readonly MenuRepositories _menuRepository;

        public GetAllMenuQueryHandler( IRepositories<Entities.Menu> menuRepository )
        {
            _menuRepository = ( MenuRepositories ) ( menuRepository ?? throw new ArgumentNullException( nameof( menuRepository ) ) );
        }

        public Task<ApiResponse<List<Entities.Menu>>> Handle( GetAllMenuQuery request, CancellationToken cancellationToken )
        {
            var result = _menuRepository.GetAllAsync();
            if( result.Result == null || !result.Result.Any() )
            {
                return Task.FromResult( new ApiResponse<List<Entities.Menu>>( false, "No data found", null! ) );
            }
            var menus = result.Result.ToList();
            return Task.FromResult( new ApiResponse<List<Entities.Menu>>( true, "Data retrieved successfully", menus ) );
        }
    }
}
