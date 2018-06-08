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