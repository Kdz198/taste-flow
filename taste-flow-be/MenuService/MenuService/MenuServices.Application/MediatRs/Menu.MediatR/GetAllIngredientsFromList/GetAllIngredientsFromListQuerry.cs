using MediatR;
using MenuServices.Application.DTOs;

namespace MenuServices.Application.MediatRs.Menu.MediatR.GetAllIngredientsFromList
{
    public record GetAllIngredientsFromListQuerry( List<int> Menus ) : IRequest<ApiResponse<List<IngredientDTO>>>;
}
