class FrontReportFormController {
  constructor ($scope, $state, $location, $stateParams, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
        
    //this.reportId = $stateParams.reportId
    this.reportSlug = $stateParams.reportSlug
    this.reportId = this.reportSlug.replace('digitalreport','')

    let reportId = this.reportId

    this.agreed_service = []
    this.total = 0

    this.API.all('appointments').get('get_report', {reportId}).then((response) => {
      this.report =  response.plain()[0];
      
      this.report.time = this.makeTime(this.report.time);

      for (var i in this.report.aspect ){
        for ( var j in this.report.aspect[i].detail){
          for ( var k in this.report.aspect[i].detail[j].sub){
            if(this.report.aspect[i].detail[j].sub[k].note=='')
              this.report.aspect[i].detail[j].sub[k].note='OK'
          }
        }
      }

      this.rotate = 272 * this.report.score / 100

      if(this.report.status == 1){
        this.report.service = this.report.agreed_service
        
        if(this.report.agreed_urgent != 0 && this.report.agreed_required != 0 && this.report.agreed_recommended != 0){
          this.report.urgent = this.report.agreed_urgent
          this.report.required = this.report.agreed_required
          this.report.recommended = this.report.agreed_recommended
        }
      }

      for( var i in this.report.service ){
        this.report.service[i].selected = 0
        if(this.report.service[i].status==1){
          this.report.service[i].class='poor'
        }else if(this.report.service[i].status==2){
          this.report.service[i].class='fair'
        }else{
          this.report.service[i].class='good'
        }
      }

      this.total = this.report.agreed_total
      
      var appointmentId = this.report.app_id
      this.API.all('appointments').get('get_accept_by_appId', {appointmentId}).then((response) => {
        this.accept = response.plain()[0];
      })
    })

    this.$scope = $scope
    this.$state = $state
    this.$location = $location
  }
	
  makeTime(time){
    var temp = time.split(' ');
    var temp1 = temp[0].split('-');

    var new_time = temp1[2]+'-'+temp1[1]+'-'+temp1[0]+' '+temp[1];
    return new_time;
  }
  
  $onInit () {}

  onSelectService (service) {
    service.selected = 1 - service.selected

    if(service.selected==1)
      this.total += service.price
    else
      this.total -= service.price
  }

  repair(isValid) {
    if(isValid){
      let $state = this.$state

      let url = this.$location.absUrl();
      
      let urgent = 0
      let required = 0
      let recommended = 0

      for( var i in this.report.service ){
        if(this.report.service[i].selected==1){
          this.agreed_service.push(this.report.service[i])
          if(this.report.service[i].status == 1)
            urgent++
          else if(this.report.service[i].status == 2)
            required++
          else
            recommended++
        }
      }

      if(this.agreed_service.length>0){
        var reportId = this.reportId
        var agreed_service = this.agreed_service
        var agreed_total = this.total
        
        let data = {
          agreed_total: agreed_total,
          reportId: reportId,
          appointmentId: this.report.app_id,
          agreed_service: agreed_service,
          urgent: urgent,
          required: required,
          recommended: recommended,
          url: url
        }

        this.API.all('appointments/update_report').post(data).then((res) => {
          swal({
            title: 'Thank You!',
            text: 'Your service advisor will get in touch with you to confirm details.',
            type: 'success',
            confirmButtonText: 'OK',
            closeOnConfirm: true
          }, function () {
            $state.reload();
          })
        }, (res) => {
          swal({
            title: 'Thank You!',
            text: 'Your service advisor will get in touch with you to confirm details.',
            type: 'success',
            confirmButtonText: 'OK',
            closeOnConfirm: true
          }, function () {
            $state.reload();
          })
        })  
      }
    }
  }
}

export const FrontReportFormComponent = {
  templateUrl: './views/app/components/front-report-form/front-report-form.component.html',
  controller: FrontReportFormController,
  controllerAs: 'vm',
  bindings: {}
}