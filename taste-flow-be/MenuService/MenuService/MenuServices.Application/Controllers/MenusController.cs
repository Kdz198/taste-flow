using MediatR;
using MenuServices.Application.MediatRs.Menu.MediatR.CreateMenu;
using Microsoft.AspNetCore.Mvc;

namespace MenuServices.Application.Controllers
{
    [Route( "api/[controller]" )]
    [ApiController]
    public class MenusController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MenusController( IMediator mediator )
        {
            _mediator = mediator ?? throw new ArgumentNullException( nameof( mediator ) );
        }

        [HttpPost]
        public async Task<IActionResult> CreateMenu( [FromBody] CreateMenuCommand createMenuCommand )
        {
            var response = await _mediator.Send( createMenuCommand );
            return ( IActionResult ) response;
        }

    }
}
