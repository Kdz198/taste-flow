using MediatR;
using MenuServices.Application.Entities;

namespace MenuServices.Application.MediatRs.Menu.MediatR.CreateMenu
{
    public record CreateMenuCommand(
        string Name,
        decimal Price,
        string ImgUrl,
        List<Ingredient> Ingredients,
        List<int> Categories ) : IRequest<ApiResponse<MenuServices.Application.Entities.Menu>>;
}
