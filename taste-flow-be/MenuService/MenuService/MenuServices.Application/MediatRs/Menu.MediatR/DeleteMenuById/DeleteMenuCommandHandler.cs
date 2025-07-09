using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Menu.MediatR.DeleteMenuById
{
    public class DeleteMenuCommandHandler : IRequestHandler<DeleteMenuCommand, ApiResponse<object>>
    {
        private readonly MenuRepositories _menuRepository;

        public DeleteMenuCommandHandler( IRepositories<Entities.Menu> menuRepository )
        {
            _menuRepository = ( MenuRepositories ) ( menuRepository ?? throw new ArgumentNullException( nameof( menuRepository ) ) );
        }
        public Task<ApiResponse<object>> Handle( DeleteMenuCommand request, CancellationToken cancellationToken )
        {
            var menu = _menuRepository.GetByIdAsync( request.Id );
            if( menu.Result == null )
            {
                return Task.FromResult( new ApiResponse<object>( false, "Menu not found", null! ) );
            }
            var result = _menuRepository.DeleteAsync( request.Id );
            if( !result.Result )
            {
                return Task.FromResult( new ApiResponse<object>( false, "Cannot delete data", null! ) );
            }
            return Task.FromResult( new ApiResponse<object>( true, "Data deleted successfully", null! ) );
        }
    }
}
