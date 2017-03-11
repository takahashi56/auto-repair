class FrontStep5Controller {
  constructor ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
    this.optionalServices = [{
        title: 'Pick and Drop',
        desc: 'Some descriptions are here',
        selected: 1,
        price: 100
      }, {
        title: 'Refurbishment',
        desc: 'Some descriptions are here',
        selected: 0,
        price: 100
      }, {
        title: '100 Point Inspection Report',
        desc: 'Some descriptions are here',
        selected: 0,
        price: 100
      }, {
        title: 'Window Tinting',
        desc: 'Some descriptions are here',
        selected: 0,
        price: 100
      }, {
        title: 'Leather Refining',
        desc: 'Some descriptions are here',
        selected: 0,
        price: 100
      }, {
        title: 'Polish',
        desc: 'Some descriptions are here',
        selected: 0,
        price: 100
      }]
  }
	
  $onInit () {
    document.getElementById('mobile_menu').style.display = 'none';
    document.getElementById('toggle_menu_bg').style.display = 'none';
  }

  onSelectService (service) {
    service.selected = service.selected == 1 ? 0 : 1;
  }
}

export const FrontStep5Component = {
  templateUrl: './views/app/components/front-step5/front-step5.component.html',
  controller: FrontStep5Controller,
  controllerAs: 'vm',
  bindings: {}
}
