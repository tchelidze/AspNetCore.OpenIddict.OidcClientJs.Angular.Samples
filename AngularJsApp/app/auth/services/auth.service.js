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
