using MediatR;
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

        [HttpGet]
        public async Task<IActionResult> GetMenus()
        {
            var menus = await _mediator.Send();
            return Ok( menus );
        }

        [HttpGet( "{id}" )]
        public async Task<IActionResult> GetMenuById( int id )
        {
            try
            {
                var menu = await _mediator.Send( id );
                return Ok( menu );
            }
            catch( KeyNotFoundException ex )
            {
                return NotFound( ex.Message );
            }
        }

    }
}
