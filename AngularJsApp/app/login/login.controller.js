
app.controller('LoginController', ['$scope', '$http', 'authService', function ($scope, $http, authService) {
    $scope.login = function () {
        authService.login();
    }
}]);
