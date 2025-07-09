using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Category.MediatR.DeleteCategoryById
{
    public record DeleteCategoryByIdCommandHandler : IRequestHandler<DeleteCategoryByIdCommand, ApiResponse<object>>
    {
        private readonly CategoryRepositories _categoryRepositories;

        public DeleteCategoryByIdCommandHandler( IRepositories<Entities.Category> categoryRepositories )
        {
            _categoryRepositories = ( CategoryRepositories ) ( categoryRepositories ?? throw new ArgumentNullException( nameof( categoryRepositories ) ) );
        }

        public Task<ApiResponse<object>> Handle( DeleteCategoryByIdCommand request, CancellationToken cancellationToken )
        {
            var category = _categoryRepositories.GetByIdAsync( request.Id );
            if( category.Result == null )
            {
                return Task.FromResult( new ApiResponse<object>( false, "Category not found", null! ) );
            }
            var result = _categoryRepositories.DeleteAsync( request.Id );
            if( !result.Result )
            {
                return Task.FromResult( new ApiResponse<object>( false, "Cannot delete data", null! ) );
            }
            return Task.FromResult( new ApiResponse<object>( true, "Data deleted successfully", null! ) );
        }
    }
}
