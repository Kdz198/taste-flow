using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Category.MediatR.CreateCategory
{
    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, ApiResponse<Entities.Category>>
    {
        private readonly CategoryRepositories _categoryRepositories;
        public CreateCategoryCommandHandler( IRepositories<Entities.Category> categoryRepositories )
        {
            _categoryRepositories = ( CategoryRepositories ) ( categoryRepositories ?? throw new ArgumentNullException( nameof( categoryRepositories ) ) );
        }
        public async Task<ApiResponse<Entities.Category>> Handle( CreateCategoryCommand request, CancellationToken cancellationToken )
        {
            var result = await _categoryRepositories.AddAsync( new Entities.Category
            {
                Name = request.Name,
                Status = request.Status
            } );
            if( result == null )
            {
                return new ApiResponse<Entities.Category>
                (
                    success: false,
                    message: "Failed to create category",
                    data: null!
                );
            }
            return new ApiResponse<Entities.Category>
            (
                success: true,
                message: "Category created successfully",
                data: result
            );
        }
    }
}
