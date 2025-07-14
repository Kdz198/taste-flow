using MenuServices.Application.DTOs;
using MenuServices.Application.Entities;
using MenuServices.Application.MediatRs.Menu.MediatR.CreateMenu;
using MenuServices.Application.MediatRs.Menu.MediatR.UpdateMenu;

namespace MenuServices.Application.Helpers
{
    public static class Mapping
    {
        public static Menu ConvertCreateCommandToMenu( this CreateMenuCommand createMenuCommand, List<Category> allCategories )
        {
            var menu = new Menu
            {
                Name = createMenuCommand.Name,
                Price = createMenuCommand.Price,
                ImgUrl = createMenuCommand.ImgUrl,
                Ingredients = createMenuCommand.Ingredients.MapIngredients(),
                Categories = createMenuCommand.Categories.Map( allCategories )
            };

            return menu;
        }

        public static List<Category> Map( this List<int> ids, List<Category> allCategories )
        {
            return allCategories.Where( c => ids.Contains( c.Id ) ).ToList();
        }

        public static List<Ingredient> MapIngredients( this List<IngredientDTO> ids )
        {
            var ingredients = new List<Ingredient>();

            foreach( var ingredient in ids )
            {
                if( ingredient.Id == 0 )
                {
                    throw new ArgumentException( "Ingredient ID cannot be zero." );
                }
                ingredients.Add( new Ingredient
                {
                    Id = ingredient.Id,
                    Quantity = ingredient.Quantity
                } );
            }

            return ingredients;
        }

        public static Menu ConvertUpdateCommandToMenu( this UpdateMenuCommand updateMenuCommand, Menu menuToUpdate, List<Category> allCategories )
        {
            menuToUpdate.Id = updateMenuCommand.id;
            menuToUpdate.Name = updateMenuCommand.Name!;
            menuToUpdate.Price = ( decimal ) updateMenuCommand.Price!;
            menuToUpdate.ImgUrl = updateMenuCommand.ImageUrl!;
            menuToUpdate.Ingredients = updateMenuCommand.IngredientsId.MapIngredients();
            menuToUpdate.Categories = updateMenuCommand.CategoriesId.Map( allCategories );
            return menuToUpdate;
        }
    }
}
