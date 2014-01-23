angular.module('fittr.services')

.provider('UserService', function() {
  var baseUrl = "http://localhost:3000/";

  this.$get = function($http, $q, localStorageService) {
    return {
      currentUser: {},

      signup: function(user) {
        console.log(user);
        var creatingUser = $q.defer();
        
        $http.post(baseUrl + 'signup', user)
          .success(function(data, status, headers, config) {
            console.log("data: ", data, "status: ", status);
            creatingUser.resolve(data); 
          })
          .error(function(data, status, headers, config) {
            creatingUser.reject(data, status);
          });

        return creatingUser.promise;
      },

      login: function(user) {
        var loggingInUser = $q.defer();

        $http.post(baseUrl + 'login', user)
          .success(function(data, status, headers, config) {
            console.log("data: ", data, "status: ", status);
            loggingInUser.resolve(data);
            // TODO: investigate how to indicate to user that signup was successfull
            // TODO: investigate how to properly move from this state to connect devices state
            // - how about combining the two. indication of success is transition to 'connect devices'
            // state    
            // this.setUser(data);   
            
          })
          .error(function(data, status, headers, config) {
            loggingInUser.reject(data, status);
          // TODO: investigate how to indicate to user that signup was successfull
          // TODO: investigate how to properly move from this state to connect devices state
          });

        return loggingInUser.promise;
      },

      retrieve: function(userId, token) {
        var retrievingUser = $q.defer();

        console.log("retrieve: ", userId);
        $http.get(baseUrl + "users/" + userId)
          .success(function(data, status, headers, config) {
            console.log("data: ", data, "status: ", status);
            retrievingUser.resolve(data);     
          })
          .error(function(data, status, headers, config) {
            retrievingUser.reject(data, status);
          });
        return retrievingUser.promise;
      },

      save: function(userData) {
        this.currentUser = userData;
      },

      saveToLocal: function(userData) {
        console.log("saving user into localStorage");
        localStorageService.add('currentUser', userData);
      },
      retrieveFromLocal: function() {
        return localStorageService.get('currentUser');
      }
    };
  };
});
