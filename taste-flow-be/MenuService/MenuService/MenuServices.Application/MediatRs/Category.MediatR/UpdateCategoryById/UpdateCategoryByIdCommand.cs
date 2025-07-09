using MediatR;

namespace MenuServices.Application.MediatRs.Category.MediatR.UpdateCategoryById
{
    public record UpdateCategoryByIdCommand() : IRequest<ApiResponse<Entities.Category>>
    {
        public int Id
        {
            get; set;
        }
        public string Name { get; set; } = string.Empty;
        public bool Status { get; set; } = true;
    }
}
