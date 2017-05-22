class CarMechanicAppointmentsController {
  constructor ($scope, $state, API, $stateParams) {
    'ngInject'
    this.API = API
    this.$state = $state
	
	this.mechanicId = $stateParams.mechanicId
	
	let mechanicId = this.mechanicId
	
	this.API.all('appointments').get('mechanic_info', {mechanicId}).then((response) => {
		this.mechanic = API.copy(response)
	})
	
	this.API.all('appointments').get('all_appointments_by_mechanic', {mechanicId}).then((response) => {
		this.appointments =  response.plain();
	})
  }
		
  $onInit () {}
}

export const CarMechanicAppointmentsComponent = {
  templateUrl: './views/app/components/car-mechanic-appointments/car-mechanic-appointments.component.html',
  controller: CarMechanicAppointmentsController,
  controllerAs: 'vm',
  bindings: {}
}
