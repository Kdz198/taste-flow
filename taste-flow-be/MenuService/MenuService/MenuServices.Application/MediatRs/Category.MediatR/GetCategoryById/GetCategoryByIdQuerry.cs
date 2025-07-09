using MediatR;

namespace MenuServices.Application.MediatRs.Category.MediatR.GetCategoryById
{
    public record GetCategoryByIdQuerry( int id ) : IRequest<ApiResponse<Entities.Category>>;
}
