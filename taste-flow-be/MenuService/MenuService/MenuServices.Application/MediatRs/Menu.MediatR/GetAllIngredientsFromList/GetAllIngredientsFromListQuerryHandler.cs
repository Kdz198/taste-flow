using MediatR;
using MenuServices.Application.DTOs;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.Menu.MediatR.GetAllIngredientsFromList
{
    public class GetAllIngredientsFromListQuerryHandler : IRequestHandler<GetAllIngredientsFromListQuerry, ApiResponse<List<IngredientDTO>>>
    {
        private readonly MenuRepositories _menuRepositories;

        public GetAllIngredientsFromListQuerryHandler( IRepositories<Entities.Menu> menuRepositories )
        {
            _menuRepositories = ( MenuRepositories ) ( menuRepositories ?? throw new ArgumentNullException( nameof( menuRepositories ) ) );
        }
        public Task<ApiResponse<List<IngredientDTO>>> Handle( GetAllIngredientsFromListQuerry request, CancellationToken cancellationToken )
        {
            List<IngredientDTO> ingredients = new();

            foreach( var menuId in request.Menus )
            {
                var menu = _menuRepositories.GetByIdAsync( menuId );
                if( menu.Result != null && menu.Result.Ingredients != null )
                {
                    ingredients.AddRange( menu.Result.Ingredients.Select( i => new IngredientDTO
                    {
                        Id = i.Id,
                        Quantity = i.Quantity,
                    } ) );
                }
            }

            if( ingredients.Count == 0 )
            {
                return Task.FromResult( new ApiResponse<List<IngredientDTO>>( false, "No ingredients found for the provided menu IDs", null! ) );
            }

            ingredients = ingredients
                .GroupBy( i => i.Id )
                .Select( g => new IngredientDTO
                {
                    Id = g.Key,
                    Quantity = g.Sum( x => x.Quantity )
                } )
                .ToList();

            return Task.FromResult( new ApiResponse<List<IngredientDTO>>( true, "Ingredients retrieved successfully", ingredients ) );
        }
    }
}
