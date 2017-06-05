class AdminDashboardController {
  constructor (AclService, $scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
  	  	
    this.can = AclService.can

    if(!this.can('manage.permissions')){
      $state.go('app.carappointmentlists')
      return
    }

    this.date = new Date()
    this.selectedYear = this.date.getYear() + 1900

    this.yearList = []
    for( var i = this.selectedYear; i<= this.selectedYear + 20; i++)
      this.yearList.push(i)

    this.monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    this.weekList = [1, 2, 3, 4, 5]

    this.year = 0
    this.month = 0
    this.week = 0

    this.filter()
  }
	
  $onInit () {}

  filter (priority) {
    if(priority == 2){
      if(this.year == 0)
        return

      if(this.month == 0)
        this.week = 0
    }else if(priority == 3){
      if(this.year == 0 || this.month == 0)
        return
    }else{
      if(this.year == 0)
        this.month = this.week = 0
    }

    let year = this.year
    let month = this.month
    let week = this.week

    this.API.all('appointments').get('appointment_dashboard', {year, month, week}).then((response) => {
      this.appointment_dashboard =  response.plain()

      this.appointment_closed = this.appointment_dashboard.closed
      this.appointment_total = this.appointment_dashboard.total
    })

    this.API.all('appointments').get('totalcost_dashboard', {year, month, week}).then((response) => {
      this.totalcost_dashboard = response.plain()
    })

    /*this.API.all('appointments').get('report_dashboard', {year, month, week}).then((response) => {
      this.report_dashboard = response
    })*/

    /*this.API.all('appointments').get('sub_service_dashboard', {year, month, week}).then((response) => {
      this.sub_service_dashboard = response
    })*/

    this.API.all('appointments').get('invoice_dashboard', {year, month, week}).then((response) => {
      this.invoice_dashboard = response
    })
  }
}

export const AdminDashboardComponent = {
  templateUrl: './views/app/components/admin-dashboard/admin-dashboard.component.html',
  controller: AdminDashboardController,
  controllerAs: 'vm',
  bindings: {}
}