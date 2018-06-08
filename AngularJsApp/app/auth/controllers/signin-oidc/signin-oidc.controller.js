app.controller('SignInOidcController', ['$scope','authService', function ($scope,authService) {
    $scope.getUser = function () {
        authService.getUser();
    };
}]);
