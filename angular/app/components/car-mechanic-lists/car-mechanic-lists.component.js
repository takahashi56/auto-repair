class CarMechanicListsController {
  constructor ($scope, $state, API, $uibModal) {
    'ngInject'
    this.API = API
    this.$state = $state
	
	this.$scope = $scope
	this.$uibModal = $uibModal
	
	this.API.all('appointments').get('all_mechanics').then((response) => {
		this.mechanics =  response.plain();

    if(this.mechanics){
      for(var i in this.mechanics){
        this.mechanics[i].closed = this.mechanics[i].total - this.mechanics[i].open;
        if(this.mechanics[i].closed == '0' || this.mechanics[i].closed == 0)
          this.mechanics[i].closed = '';
      }
    }
	})
  }
	
  
  modalcontroller ($scope, $uibModalInstance) {
  	  'ngInject'
  	  this.fullname = ""
  	  this.email = ""
  	  this.phonenumber = ""
  	  this.password = ""
  	  this.confirm_password = ""
  	      
  	  this.ok = () => {
  	  	if (this.fullname == "")
  	  	{
  	  		swal({
  	  			    title: 'Full Name is required!',
  	  			    type: 'warning',
  	  			    confirmButtonText: 'OK',
  	  			    closeOnConfirm: true
  	  			  })
  	  			  
  	  		return;
  	  	}
  	  	
  	  	if (this.email == "")
  		{
  			swal({
  				    title: 'Email Address is required!',
  				    type: 'warning',
  				    confirmButtonText: 'OK',
  				    closeOnConfirm: true
  				  })
  				  
  			return;
  		}
  		
  		if (this.phonenumber == "")
		{
			swal({
				    title: 'Phone Number is required!',
				    type: 'warning',
				    confirmButtonText: 'OK',
				    closeOnConfirm: true
				  })
				  
			return;
		}
  		
  		
  		if (this.password == "" || this.password != this.confirm_password)
		{
			swal({
				    title: 'Password is incorrect!',
				    type: 'warning',
				    confirmButtonText: 'OK',
				    closeOnConfirm: true
				  })
				  
			return;
		}
  	  	
  	  	
  	  	let data = {
  			fullname: this.fullname,
  	 		email: this.email,
  	 		phonenumber: this.phonenumber,
  	 		password: this.password
  	  	}
	  	  
  	    $uibModalInstance.close(data)
  	  }
  	
  	  this.cancel = () => {
  	    $uibModalInstance.dismiss('cancel')
  	  }
  }
  
  onCreateMechanic () {
  	  let $uibModal = this.$uibModal
  	  let $scope = this.$scope
  	  
  	  var modalInstance = $uibModal.open({
  	    animation: this.animationsEnabled,
  	    templateUrl: 'myModalContent.html',
  	    controller: this.modalcontroller,
  	    controllerAs: 'mvm'
  	  })
  	
  	  modalInstance.result.then((data) => {
  	    console.log(data);
  	      	    
  	    let $state = this.$state
  	
  	    this.API.all('appointments/add_mechanic').post(data).then(() => {
  	      $state.reload()
  	      console.log("aaa")
  	    }, (res) => {
  	    	$state.reload()
  	    	console.log("bbb") 
  	    })
  	  }, () => {
  	    console.log('Modal dismissed at: ' + new Date())
  	  })
  }
  	
  $onInit () {}
}

export const CarMechanicListsComponent = {
  templateUrl: './views/app/components/car-mechanic-lists/car-mechanic-lists.component.html',
  controller: CarMechanicListsController,
  controllerAs: 'vm',
  bindings: {}
}
