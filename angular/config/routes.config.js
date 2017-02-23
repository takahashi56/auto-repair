export function RoutesConfig ($stateProvider, $urlRouterProvider) {
  'ngInject'

  var getView = (viewName) => {
    return `./views/app/pages/${viewName}/${viewName}.page.html`
  }

  var getLayout = (layout) => {
    return `./views/app/pages/layout/${layout}.page.html`
  }

  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('app', {
      abstract: true,
      views: {
        'layout': {
          templateUrl: getLayout('layout')
        },
        'header@app': {
          templateUrl: getView('header')
        },
        'footer@app': {
          templateUrl: getView('footer')
        },
        main: {}
      },
      data: {
        bodyClass: 'hold-transition skin-blue sidebar-mini'
      }
    })
    .state('app.landing', {
      url: '/',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-appointment-lists></car-appointment-lists>'
        }
      }
    })
    .state('app.tablessimple', {
      url: '/tables-simple',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<tables-simple></tables-simple>'
        }
      }
    })
    .state('app.uiicons', {
      url: '/ui-icons',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<ui-icons></ui-icons>'
        }
      }
    })
    .state('app.uimodal', {
      url: '/ui-modal',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<ui-modal></ui-modal>'
        }
      }
    })
    .state('app.uitimeline', {
      url: '/ui-timeline',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<ui-timeline></ui-timeline>'
        }
      }
    })
    .state('app.uibuttons', {
      url: '/ui-buttons',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<ui-buttons></ui-buttons>'
        }
      }
    })
    .state('app.uigeneral', {
      url: '/ui-general',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<ui-general></ui-general>'
        }
      }
    })
    .state('app.formsgeneral', {
      url: '/forms-general',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<forms-general></forms-general>'
        }
      }
    })
    .state('app.chartjs', {
      url: '/charts-chartjs',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<charts-chartjs></charts-chartjs>'
        }
      }
    })
    .state('app.comingsoon', {
      url: '/comingsoon',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<coming-soon></coming-soon>'
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-profile></user-profile>'
        }
      },
      params: {
        alerts: null
      }
    })
    .state('app.carcustomerlists', {
      url: '/car-customer-lists',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-customer-lists></car-customer-lists>'
        }
      }
    })
    .state('app.carcustomerappointments', {
      url: '/car-customer-appointments/:customerId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-customer-appointments></car-customer-appointments>'
        }
      }
    })
    .state('app.caradvisorlists', {
      url: '/car-advisor-lists',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-advisor-lists></car-advisor-lists>'
        }
      }
    })
    .state('app.caradvisorappointments', {
      url: '/car-advisor-appointments/:advisorId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-advisor-appointments></car-advisor-appointments>'
        }
      }
    })
    .state('app.carappointmentlists', {
      url: '/car-appointment-lists',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-appointment-lists></car-appointment-lists>'
        }
      }
    })
    .state('app.carappointmentdetail', {
      url: '/car-appointment-detail/:appointmentId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-appointment-detail></car-appointment-detail>'
        }
      }
    })
    .state('app.carappointmentreport', {
      url: '/car-appointment-report/:appointmentId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-appointment-report></car-appointment-report>'
        }
      }
    })
    .state('app.carservicelists', {
      url: '/car-service-lists',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-service-lists></car-service-lists>'
        }
      }
    })
    .state('app.carservicemainadd', {
      url: '/car-service-main-add',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-service-main-add></car-service-main-add>'
        }
      }
    })
    .state('app.carservicemainedit', {
      url: '/car-service-main-edit/:serviceId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-service-main-edit></car-service-main-edit>'
        }
      }
    })
    .state('app.carservicesubadd', {
      url: '/car-service-sub-add/:serviceId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-service-sub-add></car-service-sub-add>'
        }
      }
    })
    .state('app.carservicesubedit', {
      url: '/car-service-sub-edit/:serviceId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<car-service-sub-edit></car-service-sub-edit>'
        }
      }
    })
    .state('app.userlist', {
      url: '/user-lists',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-lists></user-lists>'
        }
      }
    })
    .state('app.useredit', {
      url: '/user-edit/:userId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-edit></user-edit>'
        }
      },
      params: {
        alerts: null,
        userId: null
      }
    })
    .state('app.userroles', {
      url: '/user-roles',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-roles></user-roles>'
        }
      }
    })
    .state('app.userpermissions', {
      url: '/user-permissions',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-permissions></user-permissions>'
        }
      }
    })
    .state('app.userpermissionsadd', {
      url: '/user-permissions-add',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-permissions-add></user-permissions-add>'
        }
      },
      params: {
        alerts: null
      }
    })
    .state('app.userpermissionsedit', {
      url: '/user-permissions-edit/:permissionId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-permissions-edit></user-permissions-edit>'
        }
      },
      params: {
        alerts: null,
        permissionId: null
      }
    })
    .state('app.userrolesadd', {
      url: '/user-roles-add',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-roles-add></user-roles-add>'
        }
      },
      params: {
        alerts: null
      }
    })
    .state('app.userrolesedit', {
      url: '/user-roles-edit/:roleId',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<user-roles-edit></user-roles-edit>'
        }
      },
      params: {
        alerts: null,
        roleId: null
      }
    })
    .state('app.widgets', {
      url: '/widgets',
      data: {
        auth: true
      },
      views: {
        'main@app': {
          template: '<widgets></widgets>'
        }
      }
    })
    .state('login', {
      url: '/login',
      views: {
        'layout': {
          templateUrl: getView('login')
        },
        'header@app': {},
        'footer@app': {}
      },
      data: {
        bodyClass: 'hold-transition login-page'
      },
      params: {
        registerSuccess: null,
        successMsg: null
      }
    })
    .state('loginloader', {
      url: '/login-loader',
      views: {
        'layout': {
          templateUrl: getView('login-loader')
        },
        'header@app': {},
        'footer@app': {}
      },
      data: {
        bodyClass: 'hold-transition login-page'
      }
    })
    .state('register', {
      url: '/register',
      views: {
        'layout': {
          templateUrl: getView('register')
        },
        'header@app': {},
        'footer@app': {}
      },
      data: {
        bodyClass: 'hold-transition register-page'
      }
    })
    .state('userverification', {
      url: '/userverification/:status',
      views: {
        'layout': {
          templateUrl: getView('user-verification')
        }
      },
      data: {
        bodyClass: 'hold-transition login-page'
      },
      params: {
        status: null
      }
    })
    .state('forgot_password', {
      url: '/forgot-password',
      views: {
        'layout': {
          templateUrl: getView('forgot-password')
        },
        'header@app': {},
        'footer@app': {}
      },
      data: {
        bodyClass: 'hold-transition login-page'
      }
    })
    .state('reset_password', {
      url: '/reset-password/:email/:token',
      views: {
        'layout': {
          templateUrl: getView('reset-password')
        },
        'header@app': {},
        'footer@app': {}
      },
      data: {
        bodyClass: 'hold-transition login-page'
      }
    })
    .state('app.logout', {
      url: '/logout',
      views: {
        'main@app': {
          controller: function ($rootScope, $scope, $auth, $state, AclService) {
            $auth.logout().then(function () {
              delete $rootScope.me
              AclService.flushRoles()
              AclService.setAbilities({})
              $state.go('login')
            })
          }
        }
      }
    })
}
