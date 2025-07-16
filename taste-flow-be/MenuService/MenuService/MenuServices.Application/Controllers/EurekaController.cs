using Microsoft.AspNetCore.Mvc;

namespace MenuServices.Application.Controllers
{
    [ApiController]
    [Route("actuator")]
    public class EurekaController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "UP" });
        }

        [HttpGet("info")]
        public IActionResult Info()
        {
            return Ok(new
            {
                app = "MENU-SERVICE",
                version = "1.0.0",
                environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
            });
        }
    }
}