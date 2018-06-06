using System.Security.Claims;
using AspNet.Security.OAuth.Introspection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ResourceServer1.Controllers
{
    public class ProtectedResourceController : Controller
    {
        [Authorize(AuthenticationSchemes = OAuthIntrospectionDefaults.AuthenticationScheme)]
        [HttpGet]
        public IActionResult Index() => Json(new
        {
            Type = "public",
            Value = $"Hello {((ClaimsIdentity)User.Identity).Name}"
        });
    }
}