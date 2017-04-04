class FrontHomeController {
  constructor ($rootScope, $scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
	  this.$rootScope = $rootScope

    this.$rootScope.whatCar = {'make': '', 'year': 2017, 'model': '', 'trim': ''};
    this.$rootScope.services = [];
    this.$rootScope.optionServices = [];
    this.$rootScope.optionAllServices = [];
    this.$rootScope.appointmentDate = "";
    this.$rootScope.appointmentTimes = [];

    this.API.all('services').get('availablemainservices').then((response) => {
      this.$rootScope.main_services =  response.plain().main_services;
      this.main_services = this.$rootScope.main_services
    })

    this.API.all('services').get('allfreeservices').then((response) => {
      this.$rootScope.freeServices =  response.plain().option_services;
      if (this.$rootScope.freeServices == undefined)
        this.$rootScope.freeServices = [];
    })

    this.API.all('services').get('onlyoptionservices').then((response) => {
      this.$rootScope.optionAllServices =  response.plain().option_services;
      
      if (this.$rootScope.optionAllServices == undefined)
        this.$rootScope.optionAllServices = [];
    })
  }
	
  $onInit () {
    document.getElementById('mobile_menu').style.display = 'none';
  }
}

export const FrontHomeComponent = {
  templateUrl: './views/app/components/front-home/front-home.component.html',
  controller: FrontHomeController,
  controllerAs: 'vm',
  bindings: {}
}
