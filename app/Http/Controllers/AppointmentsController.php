<?php

namespace App\Http\Controllers;

use DB;
use App\User;
use Auth;
use Hash;

use Illuminate\Http\Request;

use App\Http\Requests;

class AppointmentsController extends Controller
{
    public function index() {
    	
	}
	
	public function getAdvisors() {
		$advisors = DB::select("select users.id, users.name, sum(appointment.open) as open, 										   sum(appointment.total) as total
		 						from users 
							    inner join role_user on users.id = role_user.user_id 
							    inner join roles on role_user.role_id = roles.id 
							    left join (
							    				select advisor_id, count(advisor_id) as open, 0 as total  
							    				from appointment 
							    				inner join appointment_status on appointment.status = appointment_status.id 
							    				where appointment_status.name not like 'Closed' 
							    				group by appointment.advisor_id
							    				union 
							    				select advisor_id, 0 as open, count(advisor_id) as total  
							    				from appointment 
							    				group by appointment.advisor_id
							    		  ) as appointment on users.id = appointment.advisor_id 
							    where roles.slug = 'admin.user' 
							    group by users.id");
								
		return $advisors;
	}
	
	public function getUserRole() {
		$user = Auth::user();
		
		$role = $user
		        ->roles()
		        ->select('slug')
		        ->first();
		        
		return $role->slug;
	}
	
	public function getAdvisorInfo(Request $request) {
		$advisor = DB::table('users')
						->where('users.id', $request->advisorId)
						->first();
		
		return response()->success($advisor);
	}
	
	public function addAdvisor(Request $request) {
		$role = DB::table('roles')
						->where('slug', 'admin.user')
						->first();
						
		$id = DB::table('users')
		    ->insertGetId(array('name' => $request->fullname, 'email' => $request->email, 'phone_number' => $request->phonenumber, 'password' => Hash::make($request->password), 'email_verified' => '1'));
		    
		DB::table('role_user')
		    ->insert(array('role_id' => $role->id, 'user_id' => $id));    
		            
		return response()->success(compact('id'));
	}
	
	public function getAppointments() {
		$user = Auth::user();
		
		$role = $user
                ->roles()
                ->select('slug')
                ->first();
                
		if ($role->slug == 'admin.super') {
			$appointments = DB::table('appointment')
							->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
							->join('users as users_a', 'appointment.customer_id', '=', 'users_a.id')
							->leftjoin('users as users_b', 'appointment.advisor_id', '=', 'users_b.id')
							->select('appointment.id', 'users_a.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id', 'users_b.name as advisor')
							->orderBy('appointment.id', 'asc')
							->get();
		}
		else {
			$appointments = DB::table('appointment')
							->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
							->join('users', 'appointment.customer_id', '=', 'users.id')	
							->where('advisor_id', $user->id)
							->select('appointment.id', 'users.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id')
							->orderBy('appointment.id', 'asc')
							->get();
		}
		
		return $appointments;
	}
	
	public function getAppointmentsByAdvisor(Request $request) {
		$appointments = DB::table('appointment')
							->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
							->join('users', 'appointment.customer_id', '=', 'users.id')	
							->where('advisor_id', $request->advisorId)
							->select('appointment.id', 'users.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id')
							->orderBy('appointment.id', 'asc')
							->get();
		
		
		return $appointments;
	}
	
	
	public function getAppointmentInfo(Request $request) {
		$user = Auth::user();
		
		$appointment = DB::table('appointment')
						->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
						->leftjoin('users as users_a', 'appointment.advisor_id', '=', 'users_a.id')	
						->join('users as users_c', 'appointment.customer_id', '=', 'users_c.id')	
						->where('appointment.id', $request->appointmentId)
						->select('appointment.id', 'users_a.name as advisor', 'users_c.name as customer', 'users_c.email', 'users_c.phone_number', 'appointment.book_time', 'appointment.accept_time', 'appointment_status.name as status', 'appointment.report_id', 'appointment.completion_time', 'appointment.completion_description')
						->first();
		
		return response()->success($appointment);
	}
	
	public function getAppointmentServices(Request $request) {
		$appointment_services = DB::table('appointment_service')
									->join('sub_service', 'appointment_service.sub_service_id', '=', 'sub_service.id')
									->join('main_service', 'sub_service.parent_id', '=', 'main_service.id')
									->where('appointment_service.appointment_id', $request->appointmentId)
									->select('main_service.title as main', 'sub_service.title as sub', 'sub_service.price')
									->orderBy('appointment_service.appointment_id', 'asc')
									->get();
		
		return $appointment_services;
	}
	
	public function updateAppointmentAdvisor(Request $request) {
		DB::table('appointment')
		            ->where('id', $request->appointmentId)
		            ->update(array('advisor_id' => $request->advisorId));
		            
		return response()->success(compact('id'));
	}
	
	public function reportAppointmentInfo(Request $request) {
		$status = DB::table('appointment_status')
						->where('name', 'Closed')
						->first();
						
		DB::table('appointment')
		            ->where('id', $request->appointmentId)
		            ->update(array('report_id' => $request->appointmentId, 'status' => $status->id, 'completion_time' => $request->completionTime, 'completion_description' => $request->completionDescription));
		            
		return response()->success(compact('id'));
	}
}
