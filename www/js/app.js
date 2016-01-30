// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngDialog' ,'dash.controller', 'diy.controller', 'diagnosis.controller' ,'starter.services'])

.constant('_', window._)

.run(function($ionicPlatform, $rootScope, keypadSetting, $localstorage) {
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
        // $rootScope.enableDebug = false;
    });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.transition('none');
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
                controller: 'DashCtrl',
                resolve: {
                    setup: function($q, $rootScope, keypadSetting, _, $localstorage) {
                        $rootScope.storeKeypads = $localstorage.getObject('keypads');

                        if (_.isEmpty($rootScope.storeKeypads)) {
                            $rootScope.config = {
                                keypads: [
                                    {type: '10b', buttons: []}
                                ],
                                firstTime: 'yes'
                            };
                        } else {
                            $rootScope.config = {
                                keypads: $rootScope.storeKeypads
                            };
                        }

                        keypadSetting.initialize($rootScope.config.keypads);
                        $rootScope.keypad = [];
                        $rootScope.currentKeypad = 0;
                        $rootScope.currentKeypadType = $rootScope.config.keypads[$rootScope.currentKeypad].type;
                        $rootScope.WifiConnect = $rootScope.WifiConnect || false;

                        for (var i = 0; i < $rootScope.config.keypads.length; i++) {
                            var keypadType = $rootScope.config.keypads[i].type;
                            $rootScope.keypad.push({
                                "buttons": []
                            });
                            //check  if the diy mode has already generate the buttons names
                            if ( _.isEmpty($rootScope.config.keypads[i].buttons)) {
                                keypadSetting.buttons[keypadType].forEach(function(element) {
                                    $rootScope.keypad[i].buttons.push({
                                        "name": element.name,
                                        "value": element.value,
                                        "led": ['off', 'off', 'off']
                                    });
                                })
                            } else {
                                $rootScope.config.keypads[i].buttons.forEach(function(element) {
                                    $rootScope.keypad[i].buttons.push({
                                        "name": element.name,
                                        "value": element.value,
                                        "led": ['off', 'off', 'off']
                                    });
                                })
                            }
                        }
                        return;
                    }
                }
            }
        }
    })

    .state('app.diy', {
        url: "/diy",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/diy.html",
                controller: 'DIYCtrl'
            }
        }
    })
    
    .state('app.diagnosis', {
        url: "/diagnosis",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/diagnosis.html",
                controller: 'DiagnosisCtrl',
                resolve: {
                    setup: function($q, $rootScope, diagnosisSetting, _) {
                        $rootScope.debugMsg = [0];
                        return;
                    }
                }
            }
        }
    });

    $urlRouterProvider.otherwise('/app/dash');
    // // setup an abstract state for the tabs directive

    // // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/dash');

});