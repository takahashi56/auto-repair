class FrontStep5Controller {
  constructor ($rootScope, $scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
    'ngInject'
    this.API = API
    this.$state = $state
    this.$rootScope = $rootScope

    this.car = this.$rootScope.whatCar

    this.phonenumber = "";
    this.email = "";
    this.name = "";
    this.anything = "";
    this.contactMethod = 0;

    this.isPhone = true;
    this.isEmail = true;
    this.isName = true;
  }
	
  $onInit () {
    if (this.$rootScope.whatCar == undefined) {
      this.$state.go('front.home');
      return;
    }

    this.freeServices = this.$rootScope.freeServices;

    if (this.freeServices == undefined)
      this.freeServices = [];

    if (this.$rootScope.optionServices == undefined)
      this.$rootScope.optionServices = [];

    this.optionServices = this.$rootScope.optionServices;

    this.price = 0;
    for (let j = 0; j < this.$rootScope.services.length; j++) {
      this.price += this.$rootScope.services[j].price;        
    }

    for (let i = 0; i < this.$rootScope.optionServices.length; i++) {
      this.price += this.$rootScope.optionServices[i].price;
    }

    this.totalPrice = this.price;

    this.services = this.$rootScope.services;

    document.getElementById('mobile_menu').style.display = 'none';
    document.getElementById('toggle_menu_bg').style.display = 'none';
  }

  toggleSubService(service) {
    for (let i = 0; i < this.$rootScope.services.length; i++) {
      if (this.$rootScope.services[i].id == service.id) {
        this.price -= this.$rootScope.services[i].price;
        //this.$rootScope.services[i].added = 0;
        this.$rootScope.services.splice(i, 1);
        break;
      }
    }
    
    this.services = this.$rootScope.services;

    this.totalPrice = this.price; 
  }

  toggleOptionService(service) {
    for (let i = 0; i < this.$rootScope.optionServices.length; i++) {
      if (this.$rootScope.optionServices[i].id == service.id) {
        this.price -= this.$rootScope.optionServices[i].price;
        this.$rootScope.optionServices.splice(i, 1);
      }
    }

    this.totalPrice = this.price;
    this.optionServices = this.$rootScope.optionServices;
  }

  onConfirm() {
    this.contactMethod = document.getElementById('contactMethod').value;

    if (this.totalPrice == 0) {
      swal({
        title: 'Alert',
        text: 'Please select one service at least!',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'OK',
        closeOnConfirm: true,
        showLoaderOnConfirm: true,
        html: false
      }, function () {
      })

      return;
    }
    
    if (this.$rootScope.appointmentTimes.length == 0) {
      swal({
        title: 'Alert',
        text: 'Please select one appointment time at least!',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'OK',
        closeOnConfirm: true,
        showLoaderOnConfirm: true,
        html: false
      }, function () {
      })

      return;
    }

    if (this.phonenumber == "") 
      this.isPhone = false;
    else
      this.isPhone = true;

    if (this.email == "")
      this.isEmail = false;
    else
      this.isEmail = true;

    if (this.name == "")
      this.isName = false;
    else
      this.isName = true;

    if (this.isPhone == false || this.isEmail == false || this.isName == false) {
      return;
    }

    let services = [];
    for (let i = 0; i < this.$rootScope.services.length; i++) {
      services[services.length] = this.$rootScope.services[i].id;
    }

    let optionService = [];
    for (let i = 0; i < this.$rootScope.optionServices.length; i++) {
      optionService[optionService.length] = this.$rootScope.optionServices[i].id;
    }

    let data = {
      make: this.$rootScope.whatCar.make,
      year: this.$rootScope.whatCar.year,
      model: this.$rootScope.whatCar.model,
      trim: this.$rootScope.whatCar.trim,
      phone: this.phonenumber,
      name: this.name,
      email: this.email,
      comment: this.anything, 
      contact_method: this.contactMethod,
      date: this.$rootScope.appointmentDate,
      times: this.$rootScope.appointmentTimes,
      service: services,
      option_services: optionService
    }

    console.log(data);

    this.API.all('appointment/new').post(data).then(() => {
      let $state = this.$state

      swal({
        title: 'New Appointment',
        text: 'Your appointment has been sent.',
        type: 'success',
        confirmButtonText: 'OK',
        closeOnConfirm: true
      }, function () {
        $state.go('front.home');
      })
    }, (res) => {
      // error
      swal({
        title: 'New Appointment',
        text: 'Something wrong!',
        type: 'error',
        confirmButtonText: 'OK',
        closeOnConfirm: true
      }, function () {
        
      })
    })
  }

  changeInput(index) {
    if (index == 0)
      this.isPhone = true;
    else if (index == 1)
      this.isEmail = true;
    else if (index == 2)
      this.isName = true;
  }
}

export const FrontStep5Component = {
  templateUrl: './views/app/components/front-step5/front-step5.component.html',
  controller: FrontStep5Controller,
  controllerAs: 'vm',
  bindings: {}
}