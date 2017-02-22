class CarAppointmentReportController {
  constructor (API, $state, $stateParams, $scope, $uibModal) {
    'ngInject'
    this.API = API
    this.$state = $state
	this.$scope = $scope
	this.$uibModal = $uibModal
	
	this.appointmentId = $stateParams.appointmentId
	 
	let appointmentId = this.appointmentId
	 
	this.API.all('appointments').get('appointment_info', {appointmentId}).then((response) => {
		this.appointment = API.copy(response)
	})
	 
	this.API.all('appointments').get('appointment_services', {appointmentId}).then((response) => {
		this.services =  response.plain();
	})
  }
 
  modalcontroller ($scope, $uibModalInstance) {
	  'ngInject'
	  this.description = ""
	  
	  this.ok = () => {
	    $uibModalInstance.close(this.description)
	  }
	
	  this.cancel = () => {
	    $uibModalInstance.dismiss('cancel')
	  }
 }
    	
  getTotal () {
  		var total = 0;
  	
  	    for(var i = 0; i < this.services.length; i++){
  	        var service = this.services[i];
  	        
  	        total += service.price;
  	    }
  	    
  	    return total;
  }
  	
  onCreateReport () {
	let $uibModal = this.$uibModal
    let $scope = this.$scope
    
    var modalInstance = $uibModal.open({
      animation: this.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: this.modalcontroller,
      controllerAs: 'mvm'
    })

    modalInstance.result.then((description) => {
      console.log(description);
      
      let data = {
    		appointmentId: this.appointmentId,
     		completionTime: new Date(),
     		completionDescription: description
      }
      
      let $state = this.$state
  
      this.API.all('appointments/appointment_report').post(data).then(() => {
        this.$state.go('app.carappointmentlists')
      }, (res) => {
        
      })
    }, () => {
      console.log('Modal dismissed at: ' + new Date())
    })
  }
  
  $onInit () {}
}

export const CarAppointmentReportComponent = {
  templateUrl: './views/app/components/car-appointment-report/car-appointment-report.component.html',
  controller: CarAppointmentReportController,
  controllerAs: 'vm',
  bindings: {}
}
