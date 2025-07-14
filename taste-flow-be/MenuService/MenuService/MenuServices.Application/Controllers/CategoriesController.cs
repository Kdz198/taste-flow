using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MenuServices.Application.Controllers
{
    [Route( "api/[controller]" )]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CategoriesController( IMediator mediator )
        {
            _mediator = mediator ?? throw new ArgumentNullException( nameof( mediator ) );
        }

        [HttpGet( "{id:int}" )]
        public ActionResult GetById( int id )
        {
            var query = new MenuServices.Application.MediatRs.Category.MediatR.GetCategoryById.GetCategoryByIdQuerry( id );
            var response = _mediator.Send( query ).Result;
            if( !response.Success )
            {
                return NotFound( response );
            }
            return Ok( new
            {
                response
            } );
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            var query = new MenuServices.Application.MediatRs.Category.MediatR.GetAllCategory.GetAllCategoryQuerry();
            var response = _mediator.Send( query ).Result;
            if( !response.Success )
            {
                return NotFound( response );
            }
            return Ok( new
            {
                response
            } );
        }

        [HttpPut( "{id:int}" )]
        public ActionResult Update( int id, [FromBody] MenuServices.Application.MediatRs.Category.MediatR.UpdateCategoryById.UpdateCategoryByIdCommand updateCategoryCommand )
        {
            if( id != updateCategoryCommand.Id )
            {
                return BadRequest( "Category ID mismatch." );
            }
            var response = _mediator.Send( updateCategoryCommand ).Result;
            if( !response.Success )
            {
                return NotFound( response );
            }
            return Ok( new
            {
                response
            } );
        }

        [HttpPost]
        public ActionResult Create( [FromBody] MenuServices.Application.MediatRs.Category.MediatR.CreateCategory.CreateCategoryCommand createCategoryCommand )
        {
            var response = _mediator.Send( createCategoryCommand ).Result;
            if( !response.Success )
            {
                return BadRequest( response );
            }
            return Ok( response );
        }

        [HttpDelete( "{id:int}" )]
        public ActionResult Delete( int id )
        {
            var command = new MenuServices.Application.MediatRs.Category.MediatR.DeleteCategoryById.DeleteCategoryByIdCommand( id );
            var response = _mediator.Send( command ).Result;
            if( !response.Success )
            {
                return NotFound( response );
            }
            return Ok( response );
        }
    }
}
