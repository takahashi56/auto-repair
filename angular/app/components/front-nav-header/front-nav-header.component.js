class FrontNavHeaderController {
  constructor ($rootScope, ContextService, $location, $state, $scope, $anchorScroll) {
    'ngInject'

    let navHeader = this
    this.$location = $location
    this.$state = $state
    this.$anchorScroll = $anchorScroll
    this.$rootScope = $rootScope
  }

  $onInit () {
  	document.getElementById('mobile_menu').style.display = 'none';
  	document.getElementById('toggle_menu_bg').style.display = 'none';

   // $('#to-why-us').click();
  }

  toggleMenu () {
  	if (document.getElementById('mobile_menu').style.display == '' || document.getElementById('mobile_menu').style.display == 'none')
    {	
    	document.getElementById('mobile_menu').style.display = 'block';
    	document.getElementById('toggle_menu_bg').style.display = 'block';
    } else {
    	document.getElementById('mobile_menu').style.display = 'none';
    	document.getElementById('toggle_menu_bg').style.display = 'none';
    }
  }

  toSection (section) {
    if(this.$location.hash() !== section){
      if (this.$state.current.name == 'front.home'){
        this.$location.hash(section)
      }else{
        //this.$state.go('front.home');
        let url = this.$location.absUrl();
        let temp = url.split('/');
        let tag = temp[temp.length-1];
        
        url = url.replace(tag,'#'+section)
        window.location.href = url
      }
    }else{
      this.$anchorScroll()
    }
  }
}

export const FrontNavHeaderComponent = {
  templateUrl: './views/app/components/front-nav-header/front-nav-header.component.html',
  controller: FrontNavHeaderController,
  controllerAs: 'vm',
  bindings: {}
}
