class CarAppointmentReportController {
  constructor (API, $location, $state, $stateParams, $scope) {
    'ngInject'
  
    this.API = API
    this.$state = $state
  	this.$scope = $scope
  	this.$location = $location

  	this.appointmentId = $stateParams.appointmentId
  	this.total = 0
    this.selected_service = []

  	let appointmentId = this.appointmentId
  	 
  	this.API.all('appointments').get('get_accept_by_appId', {appointmentId}).then((response) => {
  		this.accept = response.plain()[0];
  	})

    this.API.all('appointments').get('get_report_aspect').then((response) => {
      this.report_aspect = response.plain();
      for( var i in this.report_aspect){
        var temp = this.report_aspect[i].sub.split(',')
        
        this.report_aspect[i].sub=[]
        this.report_aspect[i].status = 1

        for( var j in temp){
          var obj=new Object
          obj.title=temp[j]
          obj.status=1
          obj.note=''

          this.report_aspect[i].sub.push(obj)
        }
      }
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
 
  $onInit () {}

  onSelectService (service) {
    service.selected = service.selected == 1 ? 0 : 1;

    if (service.selected == 1) { // added
      this.total+=service.price
    } else { // removed
      this.total-=service.price
    }
  }

  onSelectStatus (service, status) {
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

  report(isValid) {
    if(isValid){
      var url = this.$location.absUrl();
      url = url.replace('admin/car-appointment-report/'+this.appointmentId,'report-form/');
      
      var urgent=0
      var required=0
      var recommended=0

      for( var i in this.services ){
        if(this.services[i].selected == 1){
          var obj=new Object
          obj.id=this.services[i].id
          obj.title=this.services[i].title
          obj.description=this.services[i].description
          obj.service_type=this.services[i].service_type
          obj.status=this.services[i].status
          obj.price=this.services[i].price

          if(obj.status==1)
            urgent++
          else if(obj.status==2)
            required++
          else
            recommended++

          this.selected_service.push(obj)
        }
      }

      this.aspect = []
      for( var i in this.report_aspect){
        var obj = new Object
        obj.id=this.report_aspect[i].id
        obj.title=this.report_aspect[i].title
        obj.status=this.report_aspect[i].status
        obj.sub=this.report_aspect[i].sub

        this.aspect.push(obj)
      }

      let data = {
        url: url,
        app_id: this.appointmentId,
        score: this.score,
        service: this.selected_service,
        aspect: this.aspect,
        urgent: urgent,
        required: required,
        recommended: recommended,
        total: this.total,
        email: this.accept.email
      }

      let $state = this.$state

      this.API.all('appointments/add_report').post(data).then((res) => {
        $state.go('special.reportform', {reportId:res})
      }, (res) => {
        $state.reload()
      })  
    }
  }
}

export const CarAppointmentReportComponent = {
  templateUrl: './views/app/components/car-appointment-report/car-appointment-report.component.html',
  controller: CarAppointmentReportController,
  controllerAs: 'vm',
  bindings: {}
}
