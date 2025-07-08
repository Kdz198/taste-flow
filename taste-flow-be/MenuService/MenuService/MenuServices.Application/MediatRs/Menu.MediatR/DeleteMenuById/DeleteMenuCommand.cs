using MediatR;

namespace MenuServices.Application.MediatRs.Menu.MediatR.DeleteMenuById
{
    public record DeleteMenuCommand( int Id ) : IRequest<ApiResponse<object>>;
}
