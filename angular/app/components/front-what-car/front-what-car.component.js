class FrontWhatCarController {
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

export const FrontWhatCarComponent = {
  templateUrl: './views/app/components/front-what-car/front-what-car.component.html',
  controller: FrontWhatCarController,
  controllerAs: 'vm',
  bindings: {}
}
