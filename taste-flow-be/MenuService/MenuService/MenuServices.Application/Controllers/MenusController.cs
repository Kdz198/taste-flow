using MediatR;
using MenuServices.Application.MediatRs.Menu.MediatR.CreateMenu;
using MenuServices.Application.MediatRs.Menu.MediatR.DeleteMenuById;
using MenuServices.Application.MediatRs.Menu.MediatR.GetAllIngredientsFromList;
using MenuServices.Application.MediatRs.Menu.MediatR.GetAllMenu;
using MenuServices.Application.MediatRs.Menu.MediatR.GetMenuById;
using MenuServices.Application.MediatRs.Menu.MediatR.UpdateMenu;
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
            return Ok( response );
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMenus()
        {
            var query = new GetAllMenuQuery();
            var response = await _mediator.Send( query );
            if( response.Success )
            {
                return Ok( response );
            }
            return NotFound( response );
        }

        [HttpGet( "{id:int}" )]
        public async Task<IActionResult> GetMenuById( int id )
        {
            var query = new GetMenuByIdQuery( id );
            var response = await _mediator.Send( query );
            if( response.Success )
            {
                return Ok( response );
            }
            return NotFound( response );
        }

        [HttpPut( "{id:int}" )]
        public async Task<IActionResult> UpdateMenu( int id, [FromBody] UpdateMenuCommand updateMenuCommand )
        {
            if( id != updateMenuCommand.id )
            {
                return BadRequest( "Menu ID mismatch." );
            }
            var response = await _mediator.Send( updateMenuCommand );
            if( response.Success )
            {
                return Ok( response );
            }
            return NotFound( response );
        }

        [HttpDelete( "{id:int}" )]
        public async Task<IActionResult> DeleteMenu( int id )
        {
            var command = new DeleteMenuCommand( id );
            var response = await _mediator.Send( command );
            if( response.Success )
            {
                return Ok( response );
            }
            return NotFound( response );
        }

        [HttpPost( "ingredients" )]
        public async Task<IActionResult> GetAllIngredientsFromList( [FromBody] GetAllIngredientsFromListQuerry menus )
        {
            var response = await _mediator.Send( menus );
            if( response.Success )
            {
                return Ok( response );
            }
            return NotFound( response );
        }
    }

}
