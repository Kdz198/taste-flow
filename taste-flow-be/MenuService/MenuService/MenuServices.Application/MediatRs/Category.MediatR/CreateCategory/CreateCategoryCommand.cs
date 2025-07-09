using MediatR;

namespace MenuServices.Application.MediatRs.Category.MediatR.CreateCategory
{
    public record CreateCategoryCommand : IRequest<ApiResponse<Entities.Category>>
    {
        public string Name { get; set; } = string.Empty;
        public bool Status { get; set; } = true;
    }
}
