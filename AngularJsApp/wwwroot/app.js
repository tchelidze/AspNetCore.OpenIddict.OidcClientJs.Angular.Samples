"use strict";
var app = angular.module('oidc_client_js_demo_app', ['ui.router']); 
app.config([
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$urlMatcherFactoryProvider',
    '$compileProvider',
    function (
        $locationProvider,
        $stateProvider,
        $urlRouterProvider,
        $urlMatcherFactoryProvider,
        $compileProvider
    ) {
        //console.log('Appt.Main is now running')
        if (window.history && window.history.pushState) {
            $locationProvider
                .html5Mode({
                    enabled: true,
                    requireBase: true
                })
                .hashPrefix('!');
        }

        $urlMatcherFactoryProvider.strictMode(false);
        $compileProvider.debugInfoEnabled(false);

        $stateProvider
            .state('protectedresource', {
                url: '/protectedresource',
                templateUrl: './views/protectedresource/protectedresource.html',
                controller: 'ProtectedResourceController'
            })
            .state('login', {
                url: '/login',
                templateUrl: './views/auth/controllers/login/login.html',
                controller: 'LoginController'
            })
            .state('/signin-oidc', {
                url: '/signin-oidc',
                templateUrl: './views/auth/controllers/signin-oidc/signin-oidc.html',
                controller: 'SignInOidcController'
            })
            .state('/home',
            {
                url: '/home',
                templateUrl: './views/home/home.html',
                controller: 'HomeController'
            });

        $urlRouterProvider.otherwise('/home');
    }
]);

app.controller('HomeController', ['$scope', function ($scope) {
    $scope.message = "Welcome to ASP.NET Core!";
}]);

app.controller("ProtectedResourceController", ['$scope', '$http', function ($scope, $http) {

}])
app.service("authService",
    function () {

        const settings = {
            authority: "http://localhost:7111",
            client_id: "angularjs-client",
            redirect_uri: "http://localhost:7222/signin-oidc",
            post_logout_redirect_uri: "http://localhost:1144/signout-oidc",
            response_type: "id_token token",
            scope: "openid profile ResourceServer1Api",
            filterProtocolClaims: true,
            loadUserInfo: true,
            automaticSilentRenew: true,
            silent_redirect_uri: "http://localhost:7222/signin-oidc",
        };

        this.oidcUserManager = new Oidc.UserManager(settings);

        this.login = function () {
            this.oidcUserManager
                .signinRedirect({ state: "some data" }).then(function () {
                    console.log("signinRedirect done");
                }).catch(function (err) {
                    console.log(err);
                });
        };

        this.getUser = function () {
            this.oidcUserManager.getUser().then(function (user) {
                console.log(user);
            });
        };

        this.oidcUserManager.events.addAccessTokenExpiring(function () {
            console.log("token expiring");
            log("token expiring");
        });

        this.oidcUserManager.events.addAccessTokenExpired(function () {
            console.log("token expired");
            log("token expired");
        });

        this.oidcUserManager.events.addSilentRenewError(function (e) {
            console.log("silent renew error", e.message);
            log("silent renew error", e.message);
        });

        this.oidcUserManager.events.addUserLoaded(function (user) {
            console.log("user loaded", user);
            oidcUserManager.getUser().then(function () {
                console.log("getUser loaded user after userLoaded event fired");
            });
        });

        this.oidcUserManager.events.addUserUnloaded(function (e) {
            console.log("user unloaded");
        });
    });

app.controller('LoginController', ['$scope', '$http', 'authService', function ($scope, $http, authService) {
    $scope.login = function () {
        authService.login();
    }
}]);

app.controller('SignInOidcController', ['$scope','authService', function ($scope,authService) {
    $scope.getUser = function () {
        authService.getUser();
    };
}]);
