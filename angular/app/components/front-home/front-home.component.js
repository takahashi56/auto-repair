class FrontHomeController {
  constructor ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
	   
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
