using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Category.MediatR.GetCategoryById
{
    public class GetCategoryByIdQuerryHandler : IRequestHandler<GetCategoryByIdQuerry, ApiResponse<MenuServices.Application.Entities.Category>>
    {
        private readonly CategoryRepositories _categoryRepositories;

        public GetCategoryByIdQuerryHandler( IRepositories<Entities.Category> categoryRepositories )
        {
            _categoryRepositories = ( CategoryRepositories ) categoryRepositories;
        }


        public async Task<ApiResponse<Entities.Category>> Handle( GetCategoryByIdQuerry request, CancellationToken cancellationToken )
        {
            var result = await _categoryRepositories.GetByIdAsync( request.id );

            if( result == null )
            {
                return new ApiResponse<Entities.Category>
                    (
                        success: false,
                        message: "Category not found",
                        data: null!
                    );
            }


            return new ApiResponse<Entities.Category>
                (
                    success: true,
                    message: "Finding success",
                    data: result
                );
        }
    }
}
