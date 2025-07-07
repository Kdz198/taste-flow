using MediatR;
using MenuServices.Application.DTOs;

namespace MenuServices.Application.MediatRs.Menu.MediatR.CreateMenu
{
    public record CreateMenuCommand(
        string Name,
        decimal Price,
        string ImgUrl,
        List<IngredientDTO> Ingredients,
        List<int> Categories ) : IRequest<ApiResponse<MenuServices.Application.Entities.Menu>>;
}
