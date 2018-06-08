"use strict";
var app = angular.module('oidc_client_js_demo_app', ['ui.router']); 
app.config([
  '$locationProvider',
  '$stateProvider',
  '$urlRouterProvider',
  '$urlMatcherFactoryProvider',
  '$compileProvider',
  function(
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
      });

    $urlRouterProvider.otherwise('/home');
  }
]);

app.controller('HomeController', ['$scope', function ($scope) {
    $scope.message = "Welcome to ASP.NET Core!";
}]);

app.controller("ProtectedResourceController", ['$scope', '$http', function ($scope, $http) {

}])
app.service('authService', function () {
    this.oidcClient = null;

    this.initOidcConfiguration = function () {
        const settings = {
            authority: 'http://localhost:7111',
            client_id: 'angularjs-client',
            redirect_uri: 'http://localhost:1144/signin-oidc',
            post_logout_redirect_uri: 'http://localhost:1144/signout-oidc',
            response_type: 'id_token token',
            scope: 'openid profile ResourceServer1Api',
            filterProtocolClaims: true,
            loadUserInfo: false
        };

        this.oidcClient = new Oidc.OidcClient(settings);
        Oidc.Log.logger = console;
        Oidc.Log.level = Oidc.Log.INFO;
    };

    this.login = function () {
        this.oidcClient
            .createSigninRequest({ state: { bar: 15 } })
            .then(function (req) {
                window.location = req.url;
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    this.initOidcConfiguration();
});


app.controller('LoginController', ['$scope', '$http', 'authService', function ($scope, $http, authService) {
    $scope.login = function () {
        authService.login();
    }
}]);

app.controller('SignInOidcController', [
  function() {
    console.log('active');
  }
]);
