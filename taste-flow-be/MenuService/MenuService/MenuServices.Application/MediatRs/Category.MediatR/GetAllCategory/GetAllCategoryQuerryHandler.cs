using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Category.MediatR.GetAllCategory
{
    public class GetAllCategoryQuerryHandler : IRequestHandler<GetAllCategoryQuerry, ApiResponse<List<Entities.Category>>>
    {
        private readonly CategoryRepositories _categoryRepositories;

        public GetAllCategoryQuerryHandler( IRepositories<Entities.Category> categoryRepositories )
        {
            _categoryRepositories = ( CategoryRepositories ) categoryRepositories;
        }

        public async Task<ApiResponse<List<Entities.Category>>> Handle( GetAllCategoryQuerry request, CancellationToken cancellationToken )
        {
            var result = await _categoryRepositories.GetAllAsync();
            if( result == null || !result.Any() )
            {
                return new ApiResponse<List<Entities.Category>>
                {

                    Success = false,
                    Message = "No categories found.",
                    Data = null!
                };
            }
            return new ApiResponse<List<Entities.Category>>
            {
                Success = true,
                Message = "Categories retrieved successfully.",
                Data = ( List<Entities.Category> ) result
            };
        }
    }
}
