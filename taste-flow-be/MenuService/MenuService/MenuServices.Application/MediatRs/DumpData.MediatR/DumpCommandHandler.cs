using MediatR;
using MenuServices.Application.Interfaces;
using MenuServices.Application.Repositories;

namespace MenuServices.Application.MediatRs.DumpData.MediatR
{
    public class DumpCommandHandler : IRequestHandler<DumpCommand, ApiResponse<Object>>
    {
        private readonly MenuRepositories _menuRepositories;
        private readonly CategoryRepositories _categoryRepositories;

        private List<Entities.Category> _categories = new()
            {
                new Entities.Category { Name = "Beverages" },
                new Entities.Category { Name = "Beverages" },
                new Entities.Category { Name = "Appetizers" },
                new Entities.Category { Name = "Main Course" },
                new Entities.Category { Name = "Desserts" }
            };

        private List<Entities.Menu> _menus;

        public DumpCommandHandler( IRepositories<Entities.Menu> menuRepositories, IRepositories<Entities.Category> categoryRepositories )
        {
            _menuRepositories = ( MenuRepositories ) ( menuRepositories ?? throw new ArgumentNullException( nameof( menuRepositories ) ) );
            _categoryRepositories = ( CategoryRepositories ) ( categoryRepositories ?? throw new ArgumentNullException( nameof( categoryRepositories ) ) );

            var resultCategory = _categoryRepositories.LoadDumpData( _categories );

            if( !resultCategory.Result )
            {
                throw new Exception( "Failed to load categories." );
            }

            _menus = new List<Entities.Menu>
                {
                    new() {
                        Name = "Coca Cola",
                        Price = 1.99m,
                        ImgUrl = "https://example.com/coca-cola.jpg",
                        Ingredients = new List<Entities.Ingredient>
                        {
                            new() { Id = 1, Quantity = 2 },
                            new() { Id = 2, Quantity = 3 },
                        },
                        Categories =  _categoryRepositories.GetByIdAsync(1).Result != null ? new List<Entities.Category> { _categoryRepositories.GetByIdAsync(1).Result } : new List<Entities.Category>()
                    }
                };
        }

        public Task<ApiResponse<object>> Handle( DumpCommand request, CancellationToken cancellationToken )
        {
            if( request == null )
            {
                throw new ArgumentNullException( nameof( request ) );
            }

            var resultMenu = _menuRepositories.LoadDumpData( _menus );
            if( resultMenu.Result )
            {
                return Task.FromResult( new ApiResponse<object>( true, "Data loaded successfully.", new Object() ) );
            }
            else
            {
                return Task.FromResult( new ApiResponse<object>( false, "Failed to load data.", new Object() ) );
            }
        }
    }
}
