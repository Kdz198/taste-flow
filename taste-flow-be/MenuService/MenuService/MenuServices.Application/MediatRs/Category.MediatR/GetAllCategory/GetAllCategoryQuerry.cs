using MediatR;

namespace MenuServices.Application.MediatRs.Category.MediatR.GetAllCategory
{
    public record GetAllCategoryQuerry() : IRequest<ApiResponse<List<Entities.Category>>>;
}
