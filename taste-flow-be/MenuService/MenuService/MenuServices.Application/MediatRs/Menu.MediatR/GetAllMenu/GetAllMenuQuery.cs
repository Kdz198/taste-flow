using MediatR;

namespace MenuServices.Application.MediatRs.Menu.MediatR.GetAllMenu
{
    public record GetAllMenuQuery() : IRequest<ApiResponse<List<MenuServices.Application.Entities.Menu>>>;
}
