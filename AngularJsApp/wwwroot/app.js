"use strict";
var app = angular.module('oidc_client_js_demo_app', ['ui.router']); 
app.config([
    "$locationProvider", "$stateProvider", "$urlRouterProvider", "$urlMatcherFactoryProvider", "$compileProvider",
    function ($locationProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $compileProvider) {

        //console.log('Appt.Main is now running')
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            }).hashPrefix("!");
        };
        $urlMatcherFactoryProvider.strictMode(false);
        $compileProvider.debugInfoEnabled(false);

        $stateProvider
            .state("protectedresource",
            {
                url: "/protectedresource",
                templateUrl: "./views/protectedresource/protectedresource.html",
                controller: "ProtectedResourceController"
            })
            .state("login",
            {
                url: "/login",
                templateUrl: "./views/login/login.html",
                controller: "LoginController"
            })
            .state("user",
            {
                url: "/user",
                templateUrl: "./views/user/user.html",
                controller: "UserController"
            });

        $urlRouterProvider.otherwise("/home");
    }
]);
app.controller('HomeController', ['$scope', function ($scope) {
    $scope.message = "Welcome to ASP.NET Core!";
}]);


app.controller('LoginController', ['$scope', '$http', 'authService', function ($scope, $http, authService) {
    $scope.login = function () {
        authService.login();
    }
}]);

app.controller("ProtectedResourceController", ['$scope', '$http', function ($scope, $http) {

}])
app.service('authService', function () {

    this.oidcClient = null;

    this.initOidcConfiguration = function () {
        const settings = {
            authority: 'http://localhost:1302/',
            client_id: 'angularjs-client',
            redirect_uri: 'http://localhost:1302/connect/authorize',
            post_logout_redirect_uri: 'http://localhost:1144/home',
            response_type: 'id_token token',
            scope: 'openid email',
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
app.controller("UserController",
    [
        "$scope", "$http", function ($scope, $http) {
            $scope.title = "All User";
            $scope.ListUser = null;
            $scope.userModel = {};
            $scope.userModel.id = 0;
            getallData();

            //******=========Get All User=========******
            function getallData() {
                $http({
                    method: "GET",
                    url: "/api/Values/GetUser/"
                }).then(function (response) {
                    $scope.ListUser = response.data;
                },
                    function (error) {
                        console.log(error);
                    });
            };

            //******=========Get Single User=========******
            $scope.getUser = function (user) {
                $http({
                    method: "GET",
                    url: `/api/Values/GetUserByID/${parseInt(user.id)}`
                }).then(function (response) {
                    $scope.userModel = response.data;
                },
                    function (error) {
                        console.log(error);
                    });
            };

            //******=========Save User=========******
            $scope.saveUser = function () {
                $http({
                    method: "POST",
                    url: "/api/Values/PostUser/",
                    data: $scope.userModel
                }).then(function (response) {
                    $scope.reset();
                    getallData();
                },
                    function (error) {
                        console.log(error);
                    });
            };

            //******=========Update User=========******
            $scope.updateUser = function () {
                $http({
                    method: "PUT",
                    url: `/api/Values/PutUser/${parseInt($scope.userModel.id)}`,
                    data: $scope.userModel
                }).then(function (response) {
                    $scope.reset();
                    getallData();
                },
                    function (error) {
                        console.log(error);
                    });
            };

            //******=========Delete User=========******
            $scope.deleteUser = function (user) {
                const IsConf = confirm(`You are about to delete ${user.Name}. Are you sure?`);
                if (IsConf) {
                    $http({
                        method: "DELETE",
                        url: `/api/Values/DeleteUserByID/${parseInt(user.id)}`
                    }).then(function (response) {
                        $scope.reset();
                        getallData();
                    },
                        function (error) {
                            console.log(error);
                        });
                }
            };

            //******=========Clear Form=========******
            $scope.reset = function () {
                const msg = "Form Cleared";
                $scope.userModel = {};
                $scope.userModel.id = 0;
            };
        }
    ]);

app.directive("navbarMenu", function () {
    return {
        restrict: 'E',
        templateUrl: 'views/shared/navbar/nav.html'
    };
});

app.directive("sidebarMenu", function () {
    return {
        restrict: 'E',
        templateUrl: 'views/shared/sidebar/menu.html'
    };
});