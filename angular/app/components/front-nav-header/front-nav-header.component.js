class FrontNavHeaderController {
  constructor ($rootScope, ContextService) {
    'ngInject'

    let navHeader = this

  }

  $onInit () {
  	document.getElementById('mobile_menu').style.display = 'none';
  	document.getElementById('toggle_menu_bg').style.display = 'none';
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
}

export const FrontNavHeaderComponent = {
  templateUrl: './views/app/components/front-nav-header/front-nav-header.component.html',
  controller: FrontNavHeaderController,
  controllerAs: 'vm',
  bindings: {}
}
