class AdminReportFormController {
  constructor (AclService, $rootScope, $location, $scope, $state, $stateParams, $compile, DTOptionsBuilder, DTColumnBuilder, API, $uibModal) {
    'ngInject'
    this.API = API
    this.$location = $location
    this.$scope = $scope
    this.$state = $state
    this.$rootScope = $rootScope

    this.$uibModal = $uibModal

    this.can = AclService.can

    this.reportId = $stateParams.reportId
    let reportId = this.reportId

    this.selected_service = []
    this.$rootScope.custom_service = [] // Just For Saving Custom Service

    this.total = 0

    this.API.all('appointments').get('get_report', {reportId}).then((response) => {
      this.report =  response.plain()[0];
      
      this.score = this.report.score
      this.report_aspect = this.report.aspect

      for (var i in this.report.aspect ){
        for ( var j in this.report.aspect[i].detail){
          for ( var k in this.report.aspect[i].detail[j].sub){
            if(this.report.aspect[i].detail[j].sub[k].note=='')
              this.report.aspect[i].detail[j].sub[k].note='OK'
          }
        }
      }

      this.rotate = 272 * this.report.score / 100

      for( var i in this.report.service ){
        this.report.service[i].selected = 1
        if(this.report.service[i].status==1){
          this.report.service[i].class1='poor'
          this.report.service[i].class2=''
          this.report.service[i].class3=''
        }else if(this.report.service[i].status==2){
          this.report.service[i].class1=''
          this.report.service[i].class2='fair'
          this.report.service[i].class3=''
        }else{
          this.report.service[i].class1=''
          this.report.service[i].class2=''
          this.report.service[i].class3='good'
        }

        if(this.report.service[i].service_type == 'custom')
          this.$rootScope.custom_service.push(this.report.service[i])    
      }

      this.selected_service = this.report.service
      this.total = this.report.total
      
      this.appointmentId = this.report.app_id
      var appointmentId = this.appointmentId

      this.API.all('appointments').get('get_accept_by_appId', {appointmentId}).then((response) => {
        this.accept = response.plain()[0];
      })
    })

    this.services = []

    this.API.all('services').get('alloptionservices').then((response) => {
      this.option_service = response.plain().option_services;
      for( var i in this.option_service){
        this.option_service[i].service_type='option'
        this.option_service[i].class3='good'
        this.option_service[i].selected=0
        this.services.push(this.option_service[i])
      }
    })

    this.API.all('services').get('allsubservices').then((response) => {
      this.sub_service = response.plain().sub_services;
      for( var i in this.sub_service){
        this.sub_service[i].service_type='sub'
        this.sub_service[i].class3='good'
        this.sub_service[i].selected=0
        this.services.push(this.sub_service[i])
      }
    })
  }
	
  modalcontroller (API, $scope, $rootScope, $uibModalInstance) {
      'ngInject'
      this.API = API
      this.$scope = $scope
      this.$rootScope = $rootScope
      
      this.services = this.$rootScope.services
      this.selected_service = []

      this.customTitle = ''
      this.customDescription = ''
      this.customPrice = ''

      this.onSelectService = (service) => {
        service.selected = service.selected == 1 ? 0 : 1;
      }
      this.ok = () => {
        for(var i in this.services){
          if(this.services[i].selected==1)
            this.selected_service.push(this.services[i])
        }

        if(this.customTitle != '' && this.customDescription != '' && this.customPrice != ''){
          var obj = new Object
          obj.id = new Date().getUTCMilliseconds()
          obj.title = this.customTitle
          obj.description = this.customDescription
          obj.price = parseFloat(this.customPrice)
          
          obj.hasPrice = this.hasPrice
          obj.selected = 1
          obj.class3= 'good'
          obj.service_type = 'custom'

          if(isNaN(this.customPrice) || !obj.hasPrice)
            obj.price = 0

          this.$rootScope.custom_service.push(obj)
        }

        if(this.selected_service.length == 0){
          this.selected_service = this.$rootScope.custom_service
        }
        else
          this.selected_service = this.selected_service.concat(this.$rootScope.custom_service)

        $uibModalInstance.close(this.selected_service)
      }
      this.cancel = () => {
        $uibModalInstance.dismiss('cancel')
      }
  }

  $onInit () {}

  showModal() {
    let $uibModal = this.$uibModal
    let $scope = this.$scope
    
    for(var i in this.services){
      var flag=0;
      for(var j in this.selected_service){
        if(this.services[i].id==this.selected_service[j].id && this.services[i].service_type==this.selected_service[j].service_type){
          flag=1;
          this.services[i].status = this.selected_service[j].status        
          this.services[i].class1 = this.selected_service[j].class1
          this.services[i].class2 = this.selected_service[j].class2
          this.services[i].class3 = this.selected_service[j].class3
        }
      }

      this.services[i].selected=flag
    }

    this.$rootScope.services = this.services

    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      templateUrl: 'modalContent.html',
      controller: this.modalcontroller,
      controllerAs: 'mvm'
    })

    modalInstance.result.then((data) => {
      this.selected_service = data

      this.total = 0
      for(var i in data)
        this.total += data[i].price
    })
  }

  onChangePrice (service) {
    if(isNaN(service.newPrice))
      return

    var diff = service.newPrice - service.price
    service.price += diff

    this.total += diff
  }

  onRemoveService (service) {
    if(!this.can('manage.users'))
      return;

    service.selected = service.selected == 1 ? 0 : 1;

    var temp=[]
    for(var i in this.selected_service){
      if(this.selected_service[i].id==service.id && this.selected_service[i].service_type==service.service_type){
        //Except
      }else{
        temp.push(this.selected_service[i])
      }
    }

    if(service.service_type == 'custom'){
      var temp1 = [];
    
      for(var i in this.$rootScope.custom_service){
        if(this.$rootScope.custom_service[i].id==service.id && this.$rootScope.custom_service[i].service_type==service.service_type){
          //Except
        }else{
          temp1.push(this.$rootScope.custom_service[i])
        }
      }
    
      this.$rootScope.custom_service = temp1
    }

    this.selected_service = temp
    this.total -= service.price
  }

  onSelectStatus (service, status) {
    if(!this.can('manage.users'))
      return;

    if(status==1){
      service.class1 ='poor';
      service.class2 ='';
      service.class3 ='';
    }else if(status==2){
      service.class1 ='';
      service.class2 ='fair';
      service.class3 ='';
    }else{
      service.class1 ='';
      service.class2 ='';
      service.class3 ='good';
    }
    service.status = status
  }

  reportFunc(isValid) {
    if(isValid){
      var url = this.$location.absUrl();
      url = url.replace('admin/report-form/'+this.reportId,'report-form/'+this.reportId);
      
      var urgent=0
      var required=0
      var recommended=0

      for( var i in this.selected_service ){
        var obj = this.selected_service[i]

        if(obj.status==1)
          urgent++
        else if(obj.status==2)
          required++
        else
          recommended++
      }

      let data = {
        url: url,
        app_id: this.appointmentId,
        report_id: this.reportId,
        score: this.score,
        service: this.selected_service,
        aspect: this.report_aspect,
        urgent: urgent,
        required: required,
        recommended: recommended,
        total: this.total
      }

      let $state = this.$state

      this.API.all('appointments/update_report_mechanic').post(data).then((res) => {
        $state.go('special.reportform', {reportId:this.reportId})
      }, (res) => {
        $state.reload()
      })
    }
  }
}

export const AdminReportFormComponent = {
  templateUrl: './views/app/components/report-form-mechanic/report-form-mechanic.component.html',
  controller: AdminReportFormController,
  controllerAs: 'vm',
  bindings: {}
}