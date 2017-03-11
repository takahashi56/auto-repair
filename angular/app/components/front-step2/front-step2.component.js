class FrontStep2Controller {
  constructor ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
	
  }
	
  $onInit () {
    document.getElementById('mobile_menu').style.display = 'none';
    document.getElementById('toggle_menu_bg').style.display = 'none';
  }
}

export const FrontStep2Component = {
  templateUrl: './views/app/components/front-step2/front-step2.component.html',
  controller: FrontStep2Controller,
  controllerAs: 'vm',
  bindings: {}
}
