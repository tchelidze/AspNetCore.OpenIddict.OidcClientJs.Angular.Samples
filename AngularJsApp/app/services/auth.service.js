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