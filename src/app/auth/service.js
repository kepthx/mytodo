(function(){
    angular.module('auth')
    .service('AuthService', function($cookies, $http, Restangular){
        'user strict';
        
        var self = this;
        this.status = {
            authorised: false
        };
        
        this.loginByCredentials = function(username, password){
            return Restangular.all('sessions').post({email: username, password: password})
                .then(function(response){
                    return self.loginByToken(response.content);
                })
        };
        
        this.loginByToken = function(token){
            $http.defaults.headers.common["X-Token"] = token;
            return Restangular.all('sessions').get(token)
            .then(function(response){
                $cookies.accessToken = token;
                self.status.authorised = true;
                return response;
            })
        };
        
        this.logout = function(){
            self.status.authorised = false;
            $cookies.accessToken = '';
            Restangular.all('sessions').remove();
        };
    });
})();