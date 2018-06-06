using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Server;
using AuthorizationServer.Models.Shared;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OpenIddict;
using OpenIddict.Core;
using OpenIddict.Models;

namespace AuthorizationServer.Controllers
{
    public class AuthorizationController : Controller
    {
        private readonly IdentityOptions _identityOptions;
        private readonly OpenIddictOptions _openIddictOptions;
        private readonly OpenIddictScopeManager<OpenIddictScope<string>> _scopeManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthorizationController(
            UserManager<IdentityUser> userManager,
            IOptionsSnapshot<OpenIddictOptions> openIddictOptions,
            SignInManager<IdentityUser> signInManager,
            IOptions<IdentityOptions> identityOptions,
            OpenIddictScopeManager<OpenIddictScope<string>> scopeManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _scopeManager = scopeManager;
            _identityOptions = identityOptions.Value;
            _openIddictOptions = openIddictOptions.Get(OpenIdConnectServerDefaults.AuthenticationScheme);
        }

        [HttpGet("~/connect/authorize")]
        public async Task<IActionResult> Authorize(OpenIdConnectRequest request)
        {
            if (!User.Identity.IsAuthenticated)
            {
                // if it's access_token renew request and user has logged out from IdP then we send error back.
                if (request.HasPrompt(OpenIdConnectConstants.Prompts.None))
                {
                    var properties = new AuthenticationProperties(new Dictionary<string, string>
                    {
                        [OpenIdConnectConstants.Properties.Error] = OpenIdConnectConstants.Errors.LoginRequired,
                        [OpenIdConnectConstants.Properties.ErrorDescription] = "The user is not logged in."
                    });

                    return Forbid(properties, OpenIdConnectServerDefaults.AuthenticationScheme);
                }

                return Challenge();
            }

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return View("Error", new ErrorViewModel
                {
                    Error = OpenIdConnectConstants.Errors.ServerError,
                    ErrorDescription = "An internal server error occured"
                });
            }

            var ticket = await CreateTicketAsync(request, user);

            return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
        }

        [HttpGet("~/connect/logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return SignOut(OpenIdConnectServerDefaults.AuthenticationScheme);
        }


        private async Task<AuthenticationTicket> CreateTicketAsync(
            OpenIdConnectRequest request,
            IdentityUser user,
            AuthenticationProperties authenticationProperties = null)
        {
            var scopes = _openIddictOptions
                .Scopes
                .Intersect(request.GetScopes())
                .ToImmutableArray();

            var identity = await CreateIdentityFromUserAsync(user, scopes);

            var ticket = new AuthenticationTicket(
                new ClaimsPrincipal(identity),
                authenticationProperties ?? new AuthenticationProperties(),
                OpenIdConnectServerDefaults.AuthenticationScheme);

            ticket.SetResources(await _scopeManager.ListResourcesAsync(scopes));
            ticket.SetAudiences(request.ClientId);
            ticket.SetScopes(scopes);

            return ticket;
        }

        public async Task<ClaimsIdentity> CreateIdentityFromUserAsync(IdentityUser user, IReadOnlyList<string> scopes)
        {
            var principal = await _signInManager.CreateUserPrincipalAsync(user);
            var identity = (ClaimsIdentity)principal.Identity;

            principal
                .Claims
                .Where(claim => claim.Type == _identityOptions.ClaimsIdentity.SecurityStampClaimType)
                .ToList()
                .ForEach(claim => claim.SetDestinations(OpenIdConnectConstants.Destinations.AccessToken));

            if (scopes.Contains(OpenIdConnectConstants.Scopes.OpenId))
            {
                var idTokenClaims = new Dictionary<string, string>();

                idTokenClaims["username"] = user.UserName;
                idTokenClaims["phonenumber"] = user.PhoneNumber;

                // You can add other user related data to id_token

                idTokenClaims
                    .Where(it => !string.IsNullOrEmpty(it.Value))
                    .ToList()
                    .ForEach(it =>
                        identity.AddClaim(it.Key, it.Value, OpenIdConnectConstants.Destinations.IdentityToken));
            }

            return identity;
        }
    }
}