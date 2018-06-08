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
