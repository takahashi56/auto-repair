import { TablesSimpleComponent } from './app/components/tables-simple/tables-simple.component'
import { UiModalComponent } from './app/components/ui-modal/ui-modal.component'
import { UiTimelineComponent } from './app/components/ui-timeline/ui-timeline.component'
import { UiButtonsComponent } from './app/components/ui-buttons/ui-buttons.component'
import { UiIconsComponent } from './app/components/ui-icons/ui-icons.component'
import { UiGeneralComponent } from './app/components/ui-general/ui-general.component'
import { FormsGeneralComponent } from './app/components/forms-general/forms-general.component'
import { ChartsChartjsComponent } from './app/components/charts-chartjs/charts-chartjs.component'
import { WidgetsComponent } from './app/components/widgets/widgets.component'
import { UserProfileComponent } from './app/components/user-profile/user-profile.component'
import { UserVerificationComponent } from './app/components/user-verification/user-verification.component'
import { ComingSoonComponent } from './app/components/coming-soon/coming-soon.component'
import { UserEditComponent } from './app/components/user-edit/user-edit.component'
import { UserPermissionsEditComponent } from './app/components/user-permissions-edit/user-permissions-edit.component'
import { UserPermissionsAddComponent } from './app/components/user-permissions-add/user-permissions-add.component'
import { UserPermissionsComponent } from './app/components/user-permissions/user-permissions.component'
import { UserRolesEditComponent } from './app/components/user-roles-edit/user-roles-edit.component'
import { UserRolesAddComponent } from './app/components/user-roles-add/user-roles-add.component'
import { UserRolesComponent } from './app/components/user-roles/user-roles.component'
import { UserListsComponent } from './app/components/user-lists/user-lists.component'
import { DashboardComponent } from './app/components/dashboard/dashboard.component'
import { NavSidebarComponent } from './app/components/nav-sidebar/nav-sidebar.component'
import { NavHeaderComponent } from './app/components/nav-header/nav-header.component'
import { LoginLoaderComponent } from './app/components/login-loader/login-loader.component'
import { ResetPasswordComponent } from './app/components/reset-password/reset-password.component'
import { ForgotPasswordComponent } from './app/components/forgot-password/forgot-password.component'
import { LoginFormComponent } from './app/components/login-form/login-form.component'
import { RegisterFormComponent } from './app/components/register-form/register-form.component'
import { CarAppointmentListsComponent } from './app/components/car-appointment-lists/car-appointment-lists.component'
import { CarAppointmentDetailComponent } from './app/components/car-appointment-detail/car-appointment-detail.component'
import { CarAppointmentReportComponent } from './app/components/car-appointment-report/car-appointment-report.component'
import { CarServiceListsComponent } from './app/components/car-service-lists/car-service-lists.component'
import { CarServiceMainAddComponent } from './app/components/car-service-main-add/car-service-main-add.component'
import { CarServiceMainEditComponent } from './app/components/car-service-main-edit/car-service-main-edit.component'
import { CarServiceSubAddComponent } from './app/components/car-service-sub-add/car-service-sub-add.component'
import { CarServiceSubEditComponent } from './app/components/car-service-sub-edit/car-service-sub-edit.component'
import { CarAdvisorListsComponent } from './app/components/car-advisor-lists/car-advisor-lists.component'
import { CarAdvisorAppointmentsComponent } from './app/components/car-advisor-appointments/car-advisor-appointments.component'
import { CarCustomerListsComponent } from './app/components/car-customer-lists/car-customer-lists.component'
import { CarCustomerAppointmentsComponent } from './app/components/car-customer-appointments/car-customer-appointments.component'

angular.module('app.components')
  .component('tablesSimple', TablesSimpleComponent)
  .component('carAppointmentLists', CarAppointmentListsComponent)
  .component('carAppointmentDetail', CarAppointmentDetailComponent)
  .component('carAppointmentReport', CarAppointmentReportComponent)
  .component('carServiceLists', CarServiceListsComponent)
  .component('carServiceMainAdd', CarServiceMainAddComponent)
  .component('carServiceMainEdit', CarServiceMainEditComponent)
  .component('carServiceSubAdd', CarServiceSubAddComponent)
  .component('carServiceSubEdit', CarServiceSubEditComponent)
  .component('carAdvisorLists', CarAdvisorListsComponent)
  .component('carAdvisorAppointments', CarAdvisorAppointmentsComponent)
  .component('carCustomerLists', CarCustomerListsComponent)
  .component('carCustomerAppointments', CarCustomerAppointmentsComponent)
  .component('uiModal', UiModalComponent)
  .component('uiTimeline', UiTimelineComponent)
  .component('uiButtons', UiButtonsComponent)
  .component('uiIcons', UiIconsComponent)
  .component('uiGeneral', UiGeneralComponent)
  .component('formsGeneral', FormsGeneralComponent)
  .component('chartsChartjs', ChartsChartjsComponent)
  .component('widgets', WidgetsComponent)
  .component('userProfile', UserProfileComponent)
  .component('userVerification', UserVerificationComponent)
  .component('comingSoon', ComingSoonComponent)
  .component('userEdit', UserEditComponent)
  .component('userPermissionsEdit', UserPermissionsEditComponent)
  .component('userPermissionsAdd', UserPermissionsAddComponent)
  .component('userPermissions', UserPermissionsComponent)
  .component('userRolesEdit', UserRolesEditComponent)
  .component('userRolesAdd', UserRolesAddComponent)
  .component('userRoles', UserRolesComponent)
  .component('userLists', UserListsComponent)
  .component('dashboard', DashboardComponent)
  .component('navSidebar', NavSidebarComponent)
  .component('navHeader', NavHeaderComponent)
  .component('loginLoader', LoginLoaderComponent)
  .component('resetPassword', ResetPasswordComponent)
  .component('forgotPassword', ForgotPasswordComponent)
  .component('loginForm', LoginFormComponent)
  .component('registerForm', RegisterFormComponent)
