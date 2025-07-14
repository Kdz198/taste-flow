using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MenuServices.Application.Controllers
{
    [Route( "api/[controller]" )]
    [ApiController]
    public class DumpControllers : ControllerBase
    {
        private readonly IMediator _mediator;
        public DumpControllers( IMediator mediator )
        {
            _mediator = mediator ?? throw new ArgumentNullException( nameof( mediator ) );
        }

        [HttpPost]
        [Route( "dump" )]
        public async Task<IActionResult> LoadDumpData( CancellationToken cancellationToken )
        {
            var result = await _mediator.Send( new MediatRs.DumpData.MediatR.DumpCommand(), cancellationToken );
            return Ok( result );
        }
    }
}
