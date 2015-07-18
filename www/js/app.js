// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    $rootScope.keypad = [];
    var tenButtons = ["a","b","c","d","e","f","g","h","i","j"];
    for (var i=0; i<10; i++) {
      $rootScope.keypad[i] = { led:{} };
      for (var k=0; k<3; k++) {
        tenButtons.forEach(function(element){
          $rootScope.keypad[i].led[element + k] = "off";
        })
      }
    }
    $rootScope.keypad[0].led['a1'] = "on";
    console.log($rootScope.keypad);
  });

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html"
    //controller: 'AppCtrl'
  })

  .state('app.dash', {
    url: "/dash",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/dash.html",
        controller: 'DashCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/dash');
  // // setup an abstract state for the tabs directive

  // // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/dash');

});
