(function() {
  'use strict';

  angular
    .module('loadsAppWeb')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    /*$stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      });*/

    /* Default route just in the case gets a wrong url */
    $urlRouterProvider.otherwise('/login');

    /**
     * Routes
     * List of site routes
     */
    $stateProvider
        .state('public', { // This is the container for public pages (User doesn't need to be logged)
                url: '',
                abstract: true,
                cache: false,
                views: {
                    'app': {
                        templateUrl: 'app/main/templates/layouts/public.html',
                        controller: 'PublicController',
                        controllerAs: 'public'
                    }
                },
                resolve: {
                    skipIfLoggedIn: skipIfLoggedIn  //This is a rule that evaluates if the user is logged or not; if this isn't logged, it'll let you continue, otherwise it will return you to home page
                }
            }
        )
        .state('private', { // This is the container for private pages (User has to be logged)
                url: '',
                abstract: true,
                cache: false,
                views: {
                    'app': {
                        templateUrl: 'app/main/templates/layouts/private.html',
                        controller: 'PrivateController',
                        controllerAs: 'private'
                    }
                },
                resolve: {
                    loginRequired: loginRequired //This is a rule that evaluates if the user is logged or not; if this isn't logged, it will return you to login page
                }
            }
        )
        .state('public.login', { // Login page route
                url: '/login',
                cache: false,
                views: {
                    'container@public': {
                        templateUrl: 'app/auth/templates/login.html',
                        controller: 'LoginController',
                        controllerAs: 'login'
                    }
                }
            }
        )
        .state('public.forgotpassword', { // Forgot password page route
                url: '/forgot-password',
                cache: false,
                views: {
                    'container@public': {
                        templateUrl: 'app/auth/templates/forgot_password.html',
                        controller: 'ForgotPasswordController',
                        controllerAs: 'forgotpassword'
                    }
                }
            }
        )
        .state('public.signup', { // Sign up page route
                url: '/sign-up',
                cache: false,
                views: {
                    'container@public': {
                        templateUrl: 'app/auth/templates/sign_up.html',
                        controller: 'SignUpController',
                        controllerAs: 'signup'
                    }
                }
            }
        )
        .state('private.home', { // Home page route
            url: '/home',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/main/templates/home.html',
                    controller: 'HomeController',
                    controllerAs: 'home'
                }
            }
        })
        .state('private.loads', { // Loads page route
            url: '/loads',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/loads/templates/loads.html',
                    controller: 'LoadsController',
                    controllerAs: 'loads'
                }
            }
        })
        .state('private.loads.params', { // Loads page route with searching params
            url: '/:from/:to/:pickup/:delivery/:price_min/:price_max/:length/:size/:weight/:load_type/:load_id/:shipper/:review/:deadhead',
            cache: false,
            params: {
                from: null,
                to: null,
                pickup: null,
                delivery: null,
                price_min: null,
                price_max: null,
                length: null,
                size: null,
                weight: null,
                load_type: null,
                load_id: null,
                shipper: null,
                review: null,
                deadhead: null
            },
            views: {
                'container@private': {
                    templateUrl: 'app/loads/templates/loads.html',
                    controller: 'LoadsController',
                    controllerAs: 'loads'
                }
            }
        })
        .state('private.loads.details', { // Load details page route
            url: '/details',
            cache: false,
            params: {
                id: null
            },
            views: {
                'container@private': {
                    templateUrl: 'app/loads/templates/details.html',
                    controller: 'LoadsDetailsController',
                    controllerAs: 'loadsdetails'
                }
            }
        })
        .state('private.loads.add', { // Load creation page route
            url: '/add',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/loads/templates/add.html',
                    controller: 'LoadsAddController',
                    controllerAs: 'loadsadd'
                }
            },
            data: {
              permissions: {
                only: ['GENERADOR_CARGA'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.loads.edit', { // Load edition page route
            url: '/edit',
            cache: false,
            params: {
                id: null
            },
            views: {
                'container@private': {
                    templateUrl: 'app/loads/templates/edit.html',
                    controller: 'LoadsEditController',
                    controllerAs: 'loadsedit'
                }
            },
            data: {
              permissions: {
                only: ['GENERADOR_CARGA'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.loadslog', { // Loads log page route
            url: '/loads_log',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/loads/templates/loads-log.html',
                    controller: 'LoadsLogController',
                    controllerAs: 'loadslog'
                }
            }
        })
        .state('private.carriers', { // Carrier page route
            url: '/carriers',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/carriers/templates/carriers.html',
                    controller: 'CarriersController',
                    controllerAs: 'carriers'
                }
            },
            data: {
              permissions: {
                only: ['GENERADOR_CARGA'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.carriers.params', { // Carrier page with searching params
            url: '/:company/:trailer_type/:len/:wei/:size/:skils_truck/:reviews',
            cache: false,
            params: {
                company: null,
                trailer_type: null,
                len: null,
                wei: null,
                size: null,
                skils_truck: null,
                reviews: null
            },
            views: {
                'container@private': {
                    templateUrl: 'app/carriers/templates/carriers.html',
                    controller: 'CarriersController',
                    controllerAs: 'carriers'
                }
            },
            data: {
              permissions: {
                only: ['GENERADOR_CARGA'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.carriers.details', { // Carrier details page route
            url: '/details',
            cache: false,
            params: {
                id: null,
                load_id: null
            },
            views: {
                'container@private': {
                    templateUrl: 'app/carriers/templates/details.html',
                    controller: 'CarriersDetailsController',
                    controllerAs: 'carriersdetails'
                }
            }
        })
        .state('private.trucks', { // Trucks page route
            url: '/trucks',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/trucks/templates/trucks.html',
                    controller: 'TrucksController',
                    controllerAs: 'trucks'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER','OWNER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.trucks.loads', { // Loads by truck page route
            url: '/truck_loads/:id',
            cache: false,
            params: {
                id: null
            },
            views: {
                'container@private': {
                    templateUrl: 'app/trucks/templates/truck_loads.html',
                    controller: 'TrucksLoadsController',
                    controllerAs: 'truckloads'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER','OWNER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.trucks.add', { // Truck creation page route
            url: '/add',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/trucks/templates/add.html',
                    controller: 'TrucksAddController',
                    controllerAs: 'trucksadd'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER','OWNER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.trucks.edit', { // Truck edition page route
            url: '/edit',
            cache: false,
            params: {
                id: null
            },
            views: {
                'container@private': {
                    templateUrl: 'app/trucks/templates/edit.html',
                    controller: 'TrucksEditController',
                    controllerAs: 'trucksedit'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER','OWNER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.drivers', { // Driver page route
            url: '/drivers',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/drivers/templates/drivers.html',
                    controller: 'DriversController',
                    controllerAs: 'drivers'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER','OWNER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.drivers.add', { // Driver creation page route
            url: '/add',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/drivers/templates/add.html',
                    controller: 'DriversAddController',
                    controllerAs: 'driversadd'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.drivers.edit', { // Drivers edition page route
            url: '/edit',
            cache: false,
            params: {
                id: null
            },
            views: {
                'container@private': {
                    templateUrl: 'app/drivers/templates/edit.html',
                    controller: 'DriversEditController',
                    controllerAs: 'driversedit'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER','OWNER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.fast_pay', { // Fast pay route
            url: '/fast_pay',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/fastpay/templates/fast-pay.html',
                    controller: 'FastPayController',
                    controllerAs: 'fastpay'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER','OWNER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.interest_points', { // Interesting points page route
            url: '/points-of-interest',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/interestpoint/templates/interest-points.html',
                    controller: 'InterestPointsController',
                    controllerAs: 'interestpoints'
                }
            },
            data: {
              permissions: {
                only: ['CARRIER', 'DRIVER', 'OWNER'],
                redirectTo: {
                    state: 'private.home'
                }
              }
            }
        })
        .state('private.help', { // Help page route
            url: '/help_about',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/main/templates/help.html',
                    controller: 'HelpController',
                    controllerAs: 'help'
                }
            }
        })
        .state('private.my_profile', { // Profile page route
            url: '/profile',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/profile/templates/profile.html',
                    controller: 'ProfileController',
                    controllerAs: 'profile'
                }
            }
        })
        .state('private.notifications', { // Notification page route
            url: '/notifications',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/main/templates/notifications-page.html',
                    controller: 'NotificationsPageController',
                    controllerAs: 'notificationpage'
                }
            }
        })
        .state('private.invite_join', { // Invite to join page route
            url: '/invite_to_join',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/main/templates/invite-join-page.html',
                    controller: 'InviteJoinPageController',
                    controllerAs: 'invitejoinpage'
                }
            }
        })
        .state('private.notification_settings', { // Notification settings page route
            url: '/notification_settings',
            cache: false,
            views: {
                'container@private': {
                    templateUrl: 'app/main/templates/notification-settings-page.html',
                    controller: 'NotificationSettingsPageController',
                    controllerAs: 'notificationsettingspage'
                }
            }
        });

    /**
     * Skip if logged in
     * this function verifies if the user is not logged and it let user continue 
     */
    function skipIfLoggedIn($q, $location, Auth)
    {
        var deferred = $q.defer();
        if (Auth.isAuthenticated()) {
            $location.path('/home');
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    /**
     * Login required
     * this function verifies if the user is logged and it let user continue 
     */
    function loginRequired($q, $location, Auth)
    {
        var deferred = $q.defer();
        if (Auth.isAuthenticated()) {
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }

    /*function viewShipperProfile($q, $location, Auth)
    {
        var deferred = $q.defer();
        var profile = Auth.getUserProfile();
        if (profile == 'GENERADOR_CARGA') {
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }

    function viewCarrierProfile($q, $location, Auth)
    {
        var deferred = $q.defer();
        var profile = Auth.getUserProfile();
        if (profile == 'CARRIER') {
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }*/
  }

})();
