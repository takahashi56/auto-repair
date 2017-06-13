class CarAppointmentAcceptController {
  constructor ($scope, $state, $location, $http, $stateParams, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
    this.$location = $location
    this.$http = $http
    this.inspection = ""
    this.selected_inspection = []
    this.formSubmitted = false
    
    this.appointmentId = $stateParams.appointmentId
    let appointmentId = this.appointmentId
    
    this.API.all('appointments').get('appointment_inspection', {appointmentId}).then((response) => {
      this.inspection =  response.plain();

      for (var i in this.inspection){
        this.selected_inspection[i] = this.inspection[i].id
      }
    })

    this.API.all('appointments').get('appointment_times_raw', {appointmentId}).then((response) => {
      this.appointment_times =  response.plain();

      this.appointment_times.data[0].appointment_time = this.makeTime(this.appointment_times.data[0].appointment_time);
      var temp = this.appointment_times.data[0].appointment_time.split(' ');
      
      this.date = temp[0]
      this.time = temp[1]
        
    })

    this.API.all('appointments').get('appointment_info', {appointmentId}).then((response) => {
      this.appointment =  response.plain().data;
      
      if(this.appointment){
        var temp = this.appointment.book_time.split(' ');
        this.appointment.book_time1 = temp[0]
        this.appointment.book_time2 = temp[1]
        
        this.jobno = this.appointmentId
        this.customer = this.appointment.customer
        this.advisor = this.appointment.advisor
        this.telephone = this.appointment.phone_number
        this.email = this.appointment.email
        this.method = this.appointment.method
        this.secondaryreq = ''
        
        if(this.method == 'advanced'){
          this.model = this.appointment.make+' '+this.appointment.model+' '+this.appointment.year
          this.plate = this.appointment.trim
        }else{
          this.model = ''
          this.plate = ''
        }
      }
    })

    this.API.all('services').get('availablemainservices').then((response) => {
      this.main_services =  response.plain().main_services
    })

    this.API.all('services').get('allsubservices').then((response) => {
      this.all_sub_services =  response.plain().sub_services

      for(var i in this.all_sub_services)
        this.all_sub_services[i].selected = 0
    })

    this.API.all('services').get('alloptionservices').then((response) => {
      this.optional_services =  response.plain().option_services;
      
      for(var i in this.optional_services){
        if(this.optional_services[i].type == '2'){
          this.optional_services[i].selected = 1
        }else{
          this.optional_services[i].selected = 0
        }
      }
    })

    $scope.files = []
    $scope.fileNameChanged = function(element, index){
      let files = element.files

      if(files.length>0){
        var id='image'+index;
        var formData = new FormData();

        formData.append("file", files[0]);
        
        $http.post('/add_image', formData, {
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
        }).success(function(data) {
          if(data==''){
            $('#'+id).attr('src','img/assets/upload'+(index+1)+'.jpg');
          }else{
            $('#'+id).attr('src',data);
            $scope.files[index] = data
          }
        })
      }
    }

    this.file = $scope.files
    this.$scope = $scope
  }
	
  makeTime(time){
    var temp = time.split(' ');
    var temp1 = temp[0].split('-');

    var new_time = temp1[2]+'-'+temp1[1]+'-'+temp1[0]+' '+temp[1];
    return new_time;
  }

  $onInit () {}

  toggleSelection(id) {
    let index = this.selected_inspection.indexOf(id)

    if(index > -1){
      this.selected_inspection[index]=-1
    }else{
      this.selected_inspection.push(id)
    }
  }

  onSelectMainService(serviceId) {
    this.sub_services = []

    for(var i in this.all_sub_services){
      if(this.all_sub_services[i].parent_id == serviceId){
        this.sub_services.push(this.all_sub_services[i])  
      }
    }
  }

  onSelectSubService(service) {
    var serviceId = service.id
    
    service.selected = 1 - service.selected

    for(var i in this.all_sub_services){
      if(this.all_sub_services[i].id == serviceId)
        this.all_sub_services[i].selected = service.selected
    }
  }

  onSelectOptionalService(service) {
    var serviceId = service.id
    
    service.selected = 1 - service.selected
  }

  accept(isValid) {
    let ins = this.selected_inspection.join(',')
    let file = this.file.join(',')
    let $state = this.$state
    let $scope = this.$scope

    if($scope.sign1().isEmpty || $scope.sign2().isEmpty){
      alert("You have to sign to submit.");
      return;
    }

    var sign1 = $scope.sign1().dataUrl;
    var sign2 = $scope.sign2().dataUrl;

    if(sign1==undefined || sign2==undefined){
      alert("You have to sign to submit.");
      return;
    }

    /* Make Time To Original */
    let date = this.date;
    let temp = date.split('-');
    date = temp[2]+'-'+temp[1]+'-'+temp[0];
    /* Make Time To Original End */

    if(isValid){
      var url = this.$location.absUrl();
      var app_url = url;

      url = url.replace('admin/car-appointment-accept/'+this.appointmentId,'accept-form/');
      app_url = app_url.replace('car-appointment-accept', 'car-appointment-detail');

      let data = {
        url: url,
        app_url: app_url,
        app_id: this.appointmentId,
        jobno: this.jobno,
        date: date,
        time: this.time,
        customer: this.customer,
        vin: this.vin,
        advisor: this.advisor,
        telephone: this.telephone,
        model: this.model,
        km: this.km,
        email: this.email,
        plate: this.plate,
        fuel: this.fuel,
        primaryreq: this.primaryreq,
        secondaryreq: this.secondaryreq,
        inspection: ins,
        file: file,
        sign1: sign1,
        sign2: sign2,
        method: this.method
      }
      
      if(this.method == 'instant'){
        var sub_services = []
        var optional_services = []

        for(var i in this.all_sub_services){
          if(this.all_sub_services[i].selected == 1)
            sub_services.push(this.all_sub_services[i].id)
        } 

        for(var i in this.optional_services){
          if(this.optional_services[i].selected == 1)
            optional_services.push(this.optional_services[i].id)  
        }

        data.sub_services = sub_services
        data.optional_services = optional_services 

        if(sub_services.length == 0 || optional_services.length == 0)
          return    
      }

      this.API.all('appointments/add_accept').post(data).then((res) => {
        $state.go('special.acceptform', {formId:res})
      }, (res) => {
        $state.reload()
      })
    }else{
      this.formSubmitted = true
    }
  }
}

export const CarAppointmentAcceptComponent = {
  templateUrl: './views/app/components/car-appointment-accept/car-appointment-accept.component.html',
  controller: CarAppointmentAcceptController,
  controllerAs: 'vm',
  bindings: {}
}