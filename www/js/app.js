// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'oitozero.ngSweetAlert' ,'dash.controller', 'diy.controller' ,'starter.services'])

.run(function($ionicPlatform, $rootScope, tenKeypad) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            window.plugins.insomnia.keepAwake()
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
        $rootScope.keypad = [];
        $rootScope.currentKeypad = 0;
        var colors = ["light", "stable", "positive", "calm", "balanced", "energized", "assertive", "royal", "dark"]
        for (var i = 0; i < tenKeypad.keypads.length; i++) {
            $rootScope.keypad.push({
                "buttons": []
            });
            tenKeypad.buttons.forEach(function(element) {
                $rootScope.keypad[i].buttons.push({
                    "name": element.name,
                    "led": ['off', 'off', 'off']
                });
            })
        }
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
    })

    .state('app.diy', {
        url: "/diy",
        cache: true,
        views: {
            'menuContent': {
                templateUrl: "templates/diy.html",
                controller: 'DIYCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/app/dash');
    // // setup an abstract state for the tabs directive

    // // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/dash');

});