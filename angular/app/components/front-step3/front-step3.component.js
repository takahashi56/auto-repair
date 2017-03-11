class FrontStep3Controller {
  constructor ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
	 this.timesheets = [{title: "7 AM", selected: 1}, {title: "7:30 AM", selected: 0}, {title: "8 AM", selected: 0}, {title: "8:30 AM", selected: 0}, {title: "9 AM", selected: 0}, {title: "9:30 AM", selected: 0}, {title: "10 AM", selected: 0}, {title: "10:30 AM", selected: 0}, {title: "11 AM", selected: 0}, {title: "11:30 AM", selected: 0}, {title: "12 PM", selected: 1}, {title: "12:30 PM", selected: 0}, {title: "1 PM", selected: 0}, {title: "1:30 PM", selected: 0}, {title: "2 PM", selected: 1}, {title: "2:30 PM", selected: 0}, {title: "3 PM", selected: 0}, {title: "3:30 PM", selected: 0}, {title: "4 PM", selected: 0}, {title: "4:30 PM", selected: 0}, {title: "5 PM", selected: 0}, {title: "5:30 PM", selected: 0}, {title: "6 PM", selected: 0}, {title: "6:30 PM", selected: 0}, {title: "7 PM", selected: 0}, {title: "7:30 PM", selected: 0}, {title: "8 PM", selected: 0}];

  }
	
  $onInit () {
    document.getElementById('mobile_menu').style.display = 'none';
    document.getElementById('toggle_menu_bg').style.display = 'none';
  }

  onSelectTimeSheet (timesheet) {
    timesheet.selected = timesheet.selected == 1 ? 0 : 1;
  }
}

export const FrontStep3Component = {
  templateUrl: './views/app/components/front-step3/front-step3.component.html',
  controller: FrontStep3Controller,
  controllerAs: 'vm',
  bindings: {}
}
