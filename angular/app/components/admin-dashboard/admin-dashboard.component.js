class AdminDashboardController {
  constructor (AclService, $scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
  	  	
    this.can = AclService.can

    if(!this.can('manage.permissions'))
      $state.go('app.carappointmentlists')

    this.API.all('appointments').get('appointment_dashboard').then((response) => {
  		this.appointment_dashboard =  response.plain()

      this.appointment_closed = this.appointment_dashboard[0].closed
      this.appointment_total = this.appointment_dashboard[1].total
  	})

    this.API.all('appointments').get('totalcost_dashboard').then((response) => {
      this.totalcost_dashboard = response.plain()
    })

    this.API.all('appointments').get('report_dashboard').then((response) => {
      this.report_dashboard = response
    })

    this.API.all('appointments').get('sub_service_dashboard').then((response) => {
      this.sub_service_dashboard = response
    })

    this.API.all('appointments').get('invoice_dashboard').then((response) => {
      this.invoice_dashboard = response
    })
  }
	
  $onInit () {}
}

export const AdminDashboardComponent = {
  templateUrl: './views/app/components/admin-dashboard/admin-dashboard.component.html',
  controller: AdminDashboardController,
  controllerAs: 'vm',
  bindings: {}
}