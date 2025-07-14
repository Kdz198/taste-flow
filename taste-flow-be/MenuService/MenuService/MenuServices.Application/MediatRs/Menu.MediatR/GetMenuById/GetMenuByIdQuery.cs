using MediatR;

namespace MenuServices.Application.MediatRs.Menu.MediatR.GetMenuById
{
    public record GetMenuByIdQuery( int id ) : IRequest<ApiResponse<MenuServices.Application.Entities.Menu>>;
}
