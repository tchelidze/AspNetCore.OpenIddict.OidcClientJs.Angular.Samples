﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using OpenIddict.Core;
using OpenIddict.Models;

namespace AuthorizationServer.Auth
{
    public static class AuthDbSeeder
    {
        public static void Seed(IServiceProvider services)
        {
            using (var scope = services.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                SeedApplications(scope);
                SeedScopes(scope);
            }
        }

        private static void SeedApplications(IServiceScope scope)
        {
            var manager =
                scope.ServiceProvider.GetRequiredService<OpenIddictApplicationManager<OpenIddictApplication>>();

            new List<OpenIddictApplicationDescriptor>
                {
                    new OpenIddictApplicationDescriptor
                    {
                        ClientId = "angularjs-client",
                        DisplayName = "AngularJs Client",
                        PostLogoutRedirectUris = {new Uri("http://localhost:4321/signout-oidc")},
                        RedirectUris = {new Uri("http://localhost:9000/signin-oidc")},
                        Permissions =
                        {
                            OpenIddictConstants.Permissions.Endpoints.Authorization,
                            OpenIddictConstants.Permissions.Endpoints.Logout,
                            OpenIddictConstants.Permissions.GrantTypes.Implicit
                        }
                    },
                    new OpenIddictApplicationDescriptor
                    {
                        ClientId = "ResourceServer1",
                        ClientSecret = "b7a497c7-02b2-4705-a11f-b1f310d5ddaa",
                        Permissions =
                        {
                            OpenIddictConstants.Permissions.Endpoints.Introspection
                        }
                    },
                    new OpenIddictApplicationDescriptor
                    {
                        ClientId = "ResourceServer2",
                        ClientSecret = "51d3b3f4-5846-4192-8983-eebe13453499",
                        Permissions =
                        {
                            OpenIddictConstants.Permissions.Endpoints.Introspection
                        }
                    }
                }
                .Where(descriptor => manager.FindByClientIdAsync(descriptor.ClientId).Result == null)
                .ToList()
                .ForEach(descriptor => manager.CreateAsync(descriptor).Wait());
        }

        private static void SeedScopes(IServiceScope scope)
        {
            var manager = scope.ServiceProvider.GetRequiredService<OpenIddictScopeManager<OpenIddictScope>>();

            new List<OpenIddictScopeDescriptor>
                {
                    new OpenIddictScopeDescriptor
                    {
                        Name = MyAuthorizationServerConstants.Scopes.ResourceServer1Api,
                        Resources = {MyAuthorizationServerConstants.Resource.ResourceServer1}
                    },
                    new OpenIddictScopeDescriptor
                    {
                        Name = MyAuthorizationServerConstants.Scopes.ResourceServer2Api,
                        Resources = {MyAuthorizationServerConstants.Resource.ResourceServer2}
                    }
                }
                .Where(it => manager.FindByNameAsync(it.Name) == null)
                .ToList()
                .ForEach(it => manager.CreateAsync(it).Wait());
        }
    }
}