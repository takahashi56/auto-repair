class FrontStep1Controller {
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

export const FrontStep1Component = {
  templateUrl: './views/app/components/front-step1/front-step1.component.html',
  controller: FrontStep1Controller,
  controllerAs: 'vm',
  bindings: {}
}
