class CarAppointmentListsController {
  constructor ($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
  	this.serviceId = 0
  	this.serviceName = ""
  	
  	this.API.all('appointments').get('all_appointments').then((response) => {
  		this.appointments =  response.plain();
  	})
  }
	
  onRow (appointmentId) {
  	
  }
  
  delete (serviceId) {
    let API = this.API
    let $state = this.$state
	
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: false
    }, function () {
    	let data = {
	      id: serviceId
	    }
	    
	    API.all('services/delete_main_service').post(data).then(() => {
	      let alert = { type: 'success', 'title': 'Success!', msg: 'Main Service has been added.' }
	      
	      swal({
	        title: 'Deleted!',
	        text: 'Service Item has been deleted.',
	        type: 'success',
	        confirmButtonText: 'OK',
	        closeOnConfirm: true
	      }, function () {
	        $state.reload()
	      })
	    })
    })
  }
  
  subdelete (serviceId) {
    let API = this.API
    let $state = this.$state
  	
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
      html: false
    }, function () {
    	let data = {
  	      id: serviceId
  	    }
  	    
  	    API.all('services/delete_sub_service').post(data).then(() => {
  	      let alert = { type: 'success', 'title': 'Success!', msg: 'Main Service has been added.' }
  	      
  	      swal({
  	        title: 'Deleted!',
  	        text: 'Service Item has been deleted.',
  	        type: 'success',
  	        confirmButtonText: 'OK',
  	        closeOnConfirm: true
  	      }, function () {
  	        $state.reload()
  	      })
  	    })
    })
  }

  $onInit () {}
}

export const CarAppointmentListsComponent = {
  templateUrl: './views/app/components/car-appointment-lists/car-appointment-lists.component.html',
  controller: CarAppointmentListsController,
  controllerAs: 'vm',
  bindings: {}
}
