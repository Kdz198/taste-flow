using MediatR;

namespace MenuServices.Application.MediatRs.Category.MediatR.DeleteCategoryById
{
    public record DeleteCategoryByIdCommand( int Id ) : IRequest<ApiResponse<object>>;
}
