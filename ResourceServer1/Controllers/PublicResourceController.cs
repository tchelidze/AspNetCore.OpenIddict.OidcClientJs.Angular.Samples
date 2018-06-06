using Microsoft.AspNetCore.Mvc;

namespace ResourceServer1.Controllers
{
    public class PublicResourceController : Controller
    {
        [HttpGet]
        public IActionResult Index() => Json(new
        {
            Type = "public",
            Value = "Hello anonymous"
        });
    }
}