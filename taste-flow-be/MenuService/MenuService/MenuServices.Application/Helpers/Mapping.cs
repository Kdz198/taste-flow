using MenuServices.Application.Entities;
using MenuServices.Application.MediatRs.Menu.MediatR.CreateMenu;

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
                Ingredients = createMenuCommand.Ingredients,
                Categories = createMenuCommand.Categories.Map( allCategories )
            };

            return menu;
        }

        public static List<Category> Map( this List<int> ids, List<Category> allCategories )
        {
            return allCategories.Where( c => ids.Contains( c.Id ) ).ToList();
        }
    }
}
