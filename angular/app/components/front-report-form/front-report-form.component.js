class FrontReportFormController {
  constructor ($scope, $state, $stateParams, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
        
    this.reportId = $stateParams.reportId
    let reportId = this.reportId
    
    this.API.all('appointments').get('get_report', {reportId}).then((response) => {
      this.report =  response.plain()[0];
      
      for( var i in this.report.service ){
        if(this.report.service[i].status==1){
          this.report.service[i].class='poor'
        }else if(this.report.service[i].status==2){
          this.report.service[i].class='fair'
        }else{
          this.report.service[i].class='good'
        }
      }

      var appointmentId = this.report.app_id
      this.API.all('appointments').get('get_accept_by_appId', {appointmentId}).then((response) => {
        this.accept = response.plain()[0];
      })
    })

    this.$scope = $scope
    this.$state = $state
  }
	
  $onInit () {}

  repair(isValid) {
    if(isValid){
      let $state = this.$state

      var reportId = this.reportId
      this.API.all('appointments').get('update_report', {reportId}).then((response) => {
        $state.reload()
      })
    }
  }
}

export const FrontReportFormComponent = {
  templateUrl: './views/app/components/front-report-form/front-report-form.component.html',
  controller: FrontReportFormController,
  controllerAs: 'vm',
  bindings: {}
}