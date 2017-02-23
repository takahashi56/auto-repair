class CarCustomerAppointmentsController {
  constructor ($scope, $state, API, $stateParams) {
    'ngInject'
    this.API = API
    this.$state = $state
	
	this.customerId = $stateParams.customerId
	
	let customerId = this.customerId
	
	this.API.all('appointments').get('customer_info', {customerId}).then((response) => {
		this.customer = API.copy(response)
	})
	
	this.API.all('appointments').get('all_appointments_by_customer', {customerId}).then((response) => {
		this.appointments =  response.plain();
	})
  }
		
  $onInit () {}
}

export const CarCustomerAppointmentsComponent = {
  templateUrl: './views/app/components/car-customer-appointments/car-customer-appointments.component.html',
  controller: CarCustomerAppointmentsController,
  controllerAs: 'vm',
  bindings: {}
}
