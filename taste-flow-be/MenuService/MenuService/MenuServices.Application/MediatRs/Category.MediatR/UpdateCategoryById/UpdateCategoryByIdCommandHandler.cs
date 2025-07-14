using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Category.MediatR.UpdateCategoryById
{
    public class UpdateCategoryByIdCommandHandler : IRequestHandler<UpdateCategoryByIdCommand, ApiResponse<Entities.Category>>
    {
        private readonly CategoryRepositories _categoryRepository;

        public UpdateCategoryByIdCommandHandler( IRepositories<Entities.Category> categoryRepository )
        {
            _categoryRepository = ( CategoryRepositories ) ( categoryRepository ?? throw new ArgumentNullException( nameof( categoryRepository ) ) );
        }

        public async Task<ApiResponse<Entities.Category>> Handle( UpdateCategoryByIdCommand request, CancellationToken cancellationToken )
        {
            var category = await _categoryRepository.GetByIdAsync( request.Id );

            if( category == null )
            {
                return new ApiResponse<Entities.Category>
                (
                    success: false,
                    message: "Category not found",
                    data: null!
                );
            }

            category.Name = request.Name;
            category.Status = request.Status;
            var updatedCategory = await _categoryRepository.UpdateAsync( category );
            if( updatedCategory == null )
            {
                return new ApiResponse<Entities.Category>
                (
                    success: false,
                    message: "Failed to update category",
                    data: null!
                );
            }
            return new ApiResponse<Entities.Category>
            (
                success: true,
                message: "Category updated successfully",
                data: updatedCategory
            );

        }
    }
}
