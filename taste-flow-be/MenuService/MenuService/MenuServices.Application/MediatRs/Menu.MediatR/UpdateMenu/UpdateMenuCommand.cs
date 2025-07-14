using MediatR;
using MenuServices.Application.DTOs;

namespace MenuServices.Application.MediatRs.Menu.MediatR.UpdateMenu
{
    public record UpdateMenuCommand( int id ) : IRequest<ApiResponse<Entities.Menu>>
    {
        public string? Name
        {
            get; init;
        }
        public string? Description
        {
            get; init;
        }
        public decimal? Price
        {
            get; init;
        }
        public string? ImageUrl
        {
            get; init;
        }
        public bool? IsAvailable
        {
            get; init;
        }
        public List<int> CategoriesId
        {
            get; init;
        } = new List<int>();
        public List<IngredientDTO> IngredientsId
        {
            get; init;
        } = new List<IngredientDTO>();
    }
}
