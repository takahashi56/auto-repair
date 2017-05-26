class FrontBookingController {
  constructor ($rootScope, $location, $scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
	  this.$rootScope = $rootScope
    this.$location = $location

    this.$rootScope.whatCar = {'make': '', 'year': 2017, 'model': '', 'trim': ''};
  }
	
  $onInit () {
    document.getElementById('mobile_menu').style.display = 'none';
  }

  instantAction () {
    this.$rootScope.method = 'instant'
    this.$state.go('front.step3')
  }

  advancedAction () {
    this.$rootScope.method = 'advanced'
    this.$state.go('front.whatcar')
  }
}

export const FrontBookingComponent = {
  templateUrl: './views/app/components/front-booking/front-booking.component.html',
  controller: FrontBookingController,
  controllerAs: 'vm',
  bindings: {}
}
