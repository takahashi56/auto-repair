<?php
namespace App\Http\Controllers;

use DB;
use App\User;
use App\Car;
use App\Customer;
use App\Appointment;
use App\AppointmentService;
use App\AppointmentOptionService;
use App\AppointmentTime;
use Auth;
use Hash;
use Mail;
use Config;
use URL;
use Twilio;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class AppointmentsController extends Controller
{
    public function index() {
    	
	}
	
	public function getCustomers() {
		/*$customers = DB::select("select users.id, users.name, sum(appointment.open) as open, 										   sum(appointment.total) as total
		 						from users 
							    left join role_user on users.id = role_user.user_id 
							    left join roles on role_user.role_id = roles.id 
							    left join (
							    				select customer_id, count(customer_id) as open, 0 as total  
							    				from appointment 
							    				inner join appointment_status on appointment.status = appointment_status.id 
							    				where appointment_status.name not like 'Closed' 
							    				group by appointment.customer_id
							    				union 
							    				select customer_id, 0 as open, count(customer_id) as total  
							    				from appointment 
							    				group by appointment.customer_id
							    		  ) as appointment on users.id = appointment.customer_id 
							    where roles.slug = 'admin.customer'
							    group by users.id");*/

		$customers = DB::select("select customer.phone_number, customer.id, customer.name, sum(appointment.open) as open, 										   sum(appointment.total) as total
		 						from customer 
							    left join (
							    				select customer_id, count(customer_id) as open, 0 as total  
							    				from appointment 
							    				inner join appointment_status on appointment.status = appointment_status.id 
							    				where appointment_status.name not like 'Closed' 
							    				group by appointment.customer_id
							    				union 
							    				select customer_id, 0 as open, count(customer_id) as total  
							    				from appointment 
							    				group by appointment.customer_id
							    		  ) as appointment on customer.id = appointment.customer_id 
							    group by customer.id");
								
		return $customers;
	}
	
	public function getCustomerInfo(Request $request) {
		$customer = DB::table('customer')
						->where('customer.id', $request->customerId)
						->first();
		
		return response()->success($customer);
	}
	
	public function getAdvisors() {
		$advisors = DB::select("select users.auto_assign, users.id, users.name, sum(appointment.open) as open, 										   sum(appointment.total) as total
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

	public function getMechanics() {
		$mechanics = DB::select("select users.auto_assign, users.id, users.name, sum(appointment.open) as open, 										   sum(appointment.total) as total
		 						from users 
							    inner join role_user on users.id = role_user.user_id 
							    inner join roles on role_user.role_id = roles.id 
							    left join (
							    				select mechanic_id, count(mechanic_id) as open, 0 as total  
							    				from appointment 
							    				inner join appointment_status on appointment.status = appointment_status.id 
							    				where appointment_status.name not like 'Closed' 
							    				group by appointment.mechanic_id
							    				union 
							    				select mechanic_id, 0 as open, count(mechanic_id) as total  
							    				from appointment 
							    				group by appointment.mechanic_id
							    		  ) as appointment on users.id = appointment.mechanic_id 
							    where roles.slug = 'admin.mechanic' 
							    group by users.id");
								
		return $mechanics;
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

	public function getMechanicInfo(Request $request) {
		$mechanic = DB::table('users')
						->where('users.id', $request->mechanicId)
						->first();
		
		return response()->success($mechanic);
	}
	
	public function addImage(Request $request) {
		$file = $request->file('file');
		
		if ($file!=null) {
			$ext = $file->getClientOriginalExtension();
			$image_name = str_random(15).'.'.$ext;

			$destinationPath = 'uploads/accept';
	      	$file->move($destinationPath,$image_name);
			
			return $destinationPath.'/'.$image_name;
		}
		return '';
	}

	public function updateAppointmentInfo($appointmentId, $query=array()) {
		DB::table('appointment')
		            ->where('id', $appointmentId)
		            ->update($query);
		            
		return true;
	}

	public function addReport(Request $request) {
		$url = $request->url;

		date_default_timezone_set('Asia/Dubai');

		$id = DB::table('report')
		    ->insertGetId(array('app_id' => $request->app_id, 'score' => $request->score, 'urgent'=>$request->urgent, 'required'=>$request->required, 'recommended'=>$request->recommended, 'total'=>$request->total, 'service'=>serialize($request->service), 'aspect'=>serialize($request->aspect), 'time'=>date('Y-m-d H:i:s')));
		
		$info = self::getAppointmentInfoPublic($request->app_id);

		$sender = Config::get("mail.from");

		$url .= $id;

		$data = array(
			'subject'=>'Customer Car Report is Ready!',
			'sender'=>$sender,
			'emailTo'=>$info->advisor_email,
			'url'=>$url,
			'data'=>$info,
		);

		Mail::send('emails.mechanicreportform', $data, function ($m) use ($data){
        	extract($data);
            $m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Advisor')->subject($subject);
        });

        self::updateAppointmentInfo($request->app_id, array('status'=>5, 'report_id'=>$id));

        return $id;
	}

	public function updateAutoAssign(Request $request){
		$id = $request->id;
		$value = $request->value;

		DB::table('users')
		            ->where('id', $id)
		            ->update(array('auto_assign' => $value));

		return true;
	}

	public function updateReportMechanic(Request $request) {
		$url = $request->url;

		$info = self::getAppointmentInfoPublic($request->app_id);

		$sender = Config::get("mail.from");

		$data = array(
			'subject'=>'Your 100 Point Digital Car Report is Ready!',
			'sender'=>$sender,
			'emailTo'=>$info->email,
			'url'=>$url,
			'data'=>$info,
		);

		Mail::send('emails.reportform', $data, function ($m) use ($data){
        	extract($data);
            $m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Customer')->subject($subject);
        });

		date_default_timezone_set('Asia/Dubai');

        self::updateAppointmentInfo($request->app_id, array('status'=>6, 'completion_time'=>date('Y-m-d H:i:s')));

        DB::table('report')
		            ->where('id', $request->report_id)
		            ->update(array('service' => serialize($request->service), 'total' => $request->total, 'urgent' => $request->urgent, 'required' => $request->required, 'recommended' => $request->recommended, 'aspect'=>serialize($request->aspect), 'score' => $request->score));

        if($info->phone_number!=''){
        	$message='Dear '.$info->customer.', ';
			$message.='Your digital report is now ready for '.$info->make.' '.$info->model.' '.$info->year.', '.$info->trim.'. ';
			$message.='You can view details on '.$url.'. ';
			$message.='For approving recommended services, please select the services and confirm through start repair. Your service advisor will call you shortly to confirm the final costs and time required. ';
			$message.=' Regards, Gargash Autobody';

			try{
				Twilio::message($info->phone_number, $message);
	    	}catch(\Services_Twilio_RestException $e){
	    		
	    	}
	    }

		return $request->report_id;
	}

	public function updateReport(Request $request) {
		$appointment = self::getAppointmentInfoPublic($request->appointmentId);

		date_default_timezone_set('Asia/Dubai');

        self::updateAppointmentInfo($request->appointmentId, array('status'=>7, 'completion_time'=>date('Y-m-d H:i:s')));

		$advisor_email = $appointment->advisor_email;

		$sender = Config::get("mail.from");
		
		$data = array(
			'subject'=>'Customer has Approved Recommendations',
			'sender'=>$sender,
			'emailTo'=>$advisor_email,
			'id'=>$request->reportId,
			'data'=>$appointment,
			'url'=>$request->url
		);

		Mail::send('emails.report', $data, function ($m) use ($data){
        	extract($data);
            $m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Advisor')->subject($subject);
        });

		DB::table('report')
		            ->where('id', $request->reportId)
		            ->update(array('status' => 1, 'agreed_service' => serialize($request->agreed_service), 'agreed_total' => $request->agreed_total, 'agreed_urgent' => $request->urgent, 'agreed_required' => $request->required, 'agreed_recommended' => $request->recommended));
		
		return response()->success(compact('id'));
	}

	public function addAccept(Request $request) {
		$url = $request->url;

		$id = DB::table('accept')
		    ->insertGetId(array('app_id' => $request->app_id, 'jobno' => $request->jobno, 'date' => $request->date, 'time' => $request->time, 'customer' => $request->customer, 'vin' => $request->vin, 'advisor' => $request->advisor, 'telephone' => $request->telephone, 'model' => $request->model, 'km' => $request->km, 'email' => $request->email, 'plate' => $request->plate, 'fuel' => $request->fuel, 'primaryreq' => $request->primaryreq, 'secondaryreq' => $request->secondaryreq, 'inspection' => $request->inspection, 'file'=> $request->file, 'sign1'=>$request->sign1, 'sign2'=>$request->sign2));
		
		$info = self::getAppointmentInfoPublic($request->app_id);
		$app = $info;

		$mechanic_id = 0;

		if($info->mechanic_id == 0){
			/* Auto Assign */
			$mechanic_id = self::getAutoMan('admin.mechanic');
			/* Auto Assign End */
		}else{
			$mechanic_id = $info->mechanic_id;
		}

		date_default_timezone_set('Asia/Dubai');
		
		self::updateAppointmentInfo($request->app_id, array('status'=>3, 'accept_time'=>date('Y-m-d H:i:s'), 'form_id'=>$id, 'mechanic_id' => $mechanic_id));

		/* Do some actions if method is instant */
		if($request->method == 'instant'){
			$temp = explode(' ', $request->model);

			// adding car info
			$car = new Car;
			$car->make = $temp[0];
			$car->model = $temp[1];
			$car->year = $temp[2];
			$car->trim = $request->plate;
			$car->save();
			
			self::updateAppointmentInfo($request->app_id, array('car_id'=>$car->id));

			// adding appointmentservice
			for ($i = 0; $i < sizeof($request->sub_services); $i++) {
				$as = new AppointmentService;
				$as->appointment_id = $request->app_id;
				$as->sub_service_id = $request->sub_services[$i];
				$as->is_selected = 1;
				$as->save();
			}

			// adding appointmentoptionservice
			for ($i = 0; $i < sizeof($request->optional_services); $i++) {
				$aos = new AppointmentOptionService;
				$aos->appointment_id = $request->app_id;
				$aos->option_service_id = $request->optional_services[$i];
				$aos->is_selected = 1;
				$aos->save();
			}
		}else{ /* Do some actions if method is advanced */
			$temp = explode(' ', $request->model);

			DB::table('car')
		            ->where('id', $info->car_id)
		            ->update(array('make'=>$temp[0], 'model'=>$temp[1], 'year'=>$temp[2], 'trim'=>$request->plate));
		}
		/* Do some actions if method is advanced end */

		/* Update Customer */
		DB::table('customer')
		            ->where('id', $info->customer_id)
		            ->update(array('name'=>$request->customer, 'email'=>$request->email));
		/* Update Customer End */

		/* Sending email to mechanic if auto assigned */
		if($info->mechanic_id == 0 && $mechanic_id != 0){
			$info = self::getAdvisorInfoPublic($mechanic_id);

			$sender = Config::get("mail.from");

		    $message = 'New appointment( ID: '.$request->app_id.', Customer: '.$app->customer.', URL: '.$request->app_url.') has been assigned to you.';

		    $data = array(
				'subject'=>'Appointment Assigned',
				'sender'=>$sender,
				'emailTo'=>$info->email
			);

		    Mail::raw($message, function ($m) use ($data){
				extract($data);
				$m->from($sender, 'Gargash Autobody');
				$m->to($emailTo, 'Mechanic')->subject($subject);
			});
		}
		/* Sending email to mechanic if auto assigned end */

		$sender = Config::get("mail.from");
		$url .= $id;

		$info = self::getAppointmentInfoPublic($request->app_id);

		$data = array(
			'subject'=>'Your Car Has Checked In',
			'sender'=>$sender,
			'emailTo'=>$request->email,
			'url'=>$url,
			'data'=>$info
		);

		Mail::send('emails.accept', $data, function ($m) use ($data){
        	extract($data);
            $m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Customer')->subject($subject);
        });

		if($info->phone_number!=''){
			$message='Dear '.$info->customer.', Your car, '.$info->make.' '.$info->model.' '.$info->year.','.$info->trim.' has been checked in. You can view details of your car repair and maintenance on '.$url.'. Once your car is ready, we will send you a 100-point digital report, where you can view in detail the condition of the car and approve recommended services. Regards, Gargash Autobody';

	        try{
				Twilio::message($info->phone_number, $message);
			}catch(\Services_Twilio_RestException $e){
	    		
	    	}
	    }

	    return $id;
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

	public function addMechanic(Request $request) {
		$role = DB::table('roles')
						->where('slug', 'admin.mechanic')
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
							->join('customer', 'appointment.customer_id', '=', 'customer.id')
							->leftjoin('users as users_b', 'appointment.advisor_id', '=', 'users_b.id')
							->leftjoin('users as users_c', 'appointment.mechanic_id', '=', 'users_c.id')
							->select('appointment.method', 'appointment.id', 'customer.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id', 'users_b.name as advisor', 'users_c.name as mechanic', 'appointment.form_id')
							->orderBy('appointment.id', 'desc')
							->get();
		}
		elseif ($role->slug == 'admin.user') {
			$appointments = DB::table('appointment')
							->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
							->join('customer', 'appointment.customer_id', '=', 'customer.id')
							->leftjoin('users as users_b', 'appointment.advisor_id', '=', 'users_b.id')
							->leftjoin('users as users_c', 'appointment.mechanic_id', '=', 'users_c.id')	
							->where('appointment.advisor_id', $user->id)
							->select('appointment.method', 'appointment.id', 'customer.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id', 'users_b.name as advisor', 'users_c.name as mechanic', 'appointment.form_id')
							->orderBy('appointment.status', 'asc')
							->orderBy('appointment.id', 'desc')
							->get();
		}else {
			$appointments = DB::table('appointment')
							->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
							->join('customer', 'appointment.customer_id', '=', 'customer.id')
							->leftjoin('users as users_b', 'appointment.advisor_id', '=', 'users_b.id')
							->leftjoin('users as users_c', 'appointment.mechanic_id', '=', 'users_c.id')
							->where('appointment.mechanic_id', $user->id)
							->select('appointment.method', 'appointment.id', 'customer.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id', 'users_b.name as advisor', 'users_c.name as mechanic', 'appointment.form_id')
							->orderBy('appointment.status', 'asc')
							->orderBy('appointment.id', 'desc')
							->get();
		}
		
		return $appointments;
	}
	
	public function getAppointmentsByAdvisor(Request $request) {
		$appointments = DB::table('appointment')
							->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
							->join('customer', 'appointment.customer_id', '=', 'customer.id')	
							->where('advisor_id', $request->advisorId)
							->select('appointment.id', 'customer.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id')
							->orderBy('appointment.id', 'desc')
							->get();
		
		
		return $appointments;
	}

	public function getAppointmentsByMechanic(Request $request) {
		$appointments = DB::table('appointment')
							->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
							->join('customer', 'appointment.customer_id', '=', 'customer.id')	
							->where('mechanic_id', $request->mechanicId)
							->select('appointment.id', 'customer.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id')
							->orderBy('appointment.id', 'desc')
							->get();
		
		
		return $appointments;
	}
	
	public function getAppointmentsByCustomer(Request $request) {
		$appointments = DB::table('appointment')
							->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
							->join('customer', 'appointment.customer_id', '=', 'customer.id')	
							->where('customer_id', $request->customerId)
							->select('appointment.id', 'customer.name', 'appointment.book_time', 'appointment_status.name as status', 'appointment.report_id', 'appointment.form_id')
							->orderBy('appointment.id', 'desc')
							->get();
		
		
		return $appointments;
	}
	
	public function makeTerm($value){
		return $value<10?'0'.$value:$value;
	}

	public function getAppointmentDashboard(Request $request){
		
		$where='';
		
		if($request->year!=0){
			if($request->month!=0){
				$term = $request->year.'-'.self::makeTerm($request->month);

				if($request->week!=0){
					$start = 7 * ($request->week - 1) + 1;
					$end = 7 * $request->week;

					$startTerm = $term.'-'.self::makeTerm($start).' 00:00:00';
					$endTerm = $term.'-'.self::makeTerm($end).' 23:59:59';

					$where="created_at >= '$startTerm' and created_at <= '$endTerm'";
				}else{
					$where="created_at like '%".$term."%'";
				}	
			}else{
				$where="created_at like '%".$request->year."%'";
			}
		}

		$query1="select count(id) as closed from appointment where status > 3";
		$query2="select count(id) as total from appointment";

		if($where!=''){
			$query1.=' and '.$where;
			$query2.=' where '.$where;
		}

		$info1 = DB::select($query1);
		$info2 = DB::select($query2);

		$info['total'] = $info2[0]->total;
		$info['closed'] = $info1[0]->closed;

		return $info;
	}

	public function getTotalcostDashboard(Request $request){
		$where = '';
		if($request->year != 0){
			if($request->month != 0){
				$term = $request->year.'-'.self::makeTerm($request->month);
				if($request->week != 0){
					$start = 7 * ($request->week - 1) + 1;
					$end = 7 * $request->week;

					$startTerm = $term.'-'.self::makeTerm($start).' 00:00:00';
					$endTerm = $term.'-'.self::makeTerm($end).' 23:59:59';

					$where = "and c.created_at >= '$startTerm' and c.created_at <= '$endTerm'";
				}else{
					$where = "and c.created_at like '%".$term."%'";
				}
			}else{
				$where = "and c.created_at like '%".$request->year."%'";
			}
		}

		$query1 = 'select sum(a.price) as total from sub_service as a left join appointment_service as b on a.id = b.sub_service_id left join appointment as c on b.appointment_id = c.id where b.is_selected = 1 and c.id!=0 '.$where;
		$query2 = 'select sum(a.price) as total from option_service as a left join appointment_option_service as b on a.id = b.option_service_id left join appointment as c on b.appointment_id = c.id where b.is_selected = 1 and c.id!=0 '.$where;
		$query3 = "select sum(a.agreed_total) as total, count(a.id) as total_count from report as a left join appointment as c on a.app_id = c.id where a.status = 1 and c.id!=0 ".$where;

		$sub_service = DB::select($query1);

		$booking1 = $sub_service[0]->total;
	
		$option_service = DB::select($query2);

		$booking2 = $option_service[0]->total;
	
		$booking = $booking1 + $booking2;

		$report = DB::select($query3);

		$recommendation = $report[0]->total;

		$return['booking'] = $booking;
		$return['recommendation'] = $recommendation;
		$return['report_count'] = $report[0]->total_count;
		$return['sub_service_total'] = $booking1;

		return $return;
	}

	/*public function getReportDashboard(Request $request){
		$report = DB::select("select count(a.id) as total from report as a where a.status = 1");

		return $report[0]->total;
	}*/

	/*public function getSubServiceDashboard(Request $request){
		$sub_service = DB::select('select sum(a.price) as total from sub_service as a left join appointment_service as b on a.id = b.sub_service_id where b.is_selected = 1');

		return $sub_service[0]->total;
	}*/

	public function getInvoiceDashboard(Request $request){
		$where = '';

		if($request->year!=0){
			if($request->month!=0){
				$term = $request->year.'-'.self::makeTerm($request->month);

				if($request->week!=0){
					$start = 7 * ($request->week - 1) + 1;
					$end = 7 * $request->week;

					$startTerm = $term.'-'.self::makeTerm($start).' 00:00:00';
					$endTerm = $term.'-'.self::makeTerm($end).' 23:59:59';

					$where="where created_at >= '$startTerm' and created_at <= '$endTerm'";
				}else{
					$where="where created_at like '%".$term."%'";
				}	
			}else{
				$where="where created_at like '%".$request->year."%'";
			}
		}

		$query = "select sum(invoice) as total from appointment ".$where;
		
		$invoice = DB::select($query);

		return $invoice[0]->total;
	}

	public function getAppointmentInfo(Request $request) {
		$user = Auth::user();
		
		$appointment = DB::table('appointment')
						->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
						->leftjoin('users as users_a', 'appointment.advisor_id', '=', 'users_a.id')
						->leftjoin('users as users_b', 'appointment.mechanic_id', '=', 'users_b.id')	
						->leftjoin('car', 'appointment.car_id', '=', 'car.id')	
						->join('customer', 'appointment.customer_id', '=', 'customer.id')
						->where('appointment.id', $request->appointmentId)
						->select('appointment.method', 'appointment.comment', 'appointment.id', 'appointment.invoice', 'users_a.name as advisor', 'users_a.email as advisor_email', 'customer.name as customer', 'customer.email', 'customer.phone_number', 'appointment.book_time', 'appointment.accept_time', 'appointment_status.name as status', 'appointment.report_id', 'appointment.completion_time', 'appointment.completion_description', 'car.make as make', 'car.model as model', 'car.trim as trim', 'car.year as year', 'users_b.name as mechanic', 'appointment.advisor_id as advisor_id', 'appointment.mechanic_id', 'appointment.form_id')
						->first();
		
		return response()->success($appointment);
	}

	public function getAppointmentTimesRaw(Request $request) {
		$at = AppointmentTime::where(['appointment_id' => $request->appointmentId])->get();
		
		return response()->success($at);
	}

	public function getAppointmentTimes(Request $request) {
		$at = AppointmentTime::where(['appointment_id' => $request->appointmentId])->get();

		$res = "";
		for ($i = 0; $i < sizeof($at); $i++) {
			$date = Carbon::parse($at[$i]->appointment_time); //new DateTime($at[$i]->appointment_time);
			if ($i == 0) {
				$res = $date->format("F d, Y") . " ";
			}

			$res .= $date->format("h:i A");

			if ($i != sizeof($at) - 1)
				$res .= " / "; 
		}

		return $res;
	}
	
	public function getAppointmentInfoPublic($appointmentId){
		$appointment = DB::table('appointment')
						->join('appointment_status', 'appointment.status', '=', 'appointment_status.id')
						->leftjoin('users as users_a', 'appointment.advisor_id', '=', 'users_a.id')	
						->leftjoin('customer', 'appointment.customer_id', '=', 'customer.id')
						->leftjoin('car', 'appointment.car_id', '=', 'car.id')	
						->where('appointment.id', $appointmentId)
						->select('appointment.id', 'appointment.mechanic_id', 'users_a.name as advisor', 'users_a.email as advisor_email', 'customer.name as customer', 'customer.email', 'customer.phone_number', 'appointment.book_time', 'appointment.accept_time', 'appointment_status.name as status', 'appointment.report_id', 'appointment.completion_time', 'appointment.completion_description', 'car.make as make', 'car.model as model', 'car.trim as trim', 'car.year as year', 'car.id as car_id', 'customer.id as customer_id')
						->first();

		return $appointment;
	}

	public function getAdvisorInfoPublic($advisorId) {
		$advisor = DB::table('users')
						->where('users.id', $advisorId)
						->first();
		
		return $advisor;
	}

	public function getReportAspect(Request $request){
		$aspect = DB::select("select * from report_aspect order by id asc");
		
		for($i=0; $i<count($aspect); $i++){
			$aspect[$i]->sub=unserialize($aspect[$i]->sub);
		}
		return $aspect;
	}

	public function getAppointmentInspection(Request $request){
		$inspection = DB::select("select * from inspection order by id asc");
		return $inspection;
	}

	public function getReport(Request $request){
		$data = DB::select("select * from report where id=".$request->reportId);
		$data[0]->service = unserialize($data[0]->service);
		$data[0]->agreed_service = unserialize($data[0]->agreed_service);
		$data[0]->aspect = unserialize($data[0]->aspect);

		$temp = explode(' ', $data[0]->time);
		$temp[1] = date('h:i A', strtotime($temp[1]));
		$data[0]->time = $temp[0].' '.$temp[1];

		return $data;
	}

	public function getAccept(Request $request){
		$data = DB::select("select * from accept where id=".$request->formId);
		$data[0]->time = date('h:i A', strtotime($data[0]->time));

		return $data;
	}

	public function getAcceptByAppId(Request $request){
		$data = DB::select("select * from accept where app_id=".$request->appointmentId);
		return $data;
	}

	public function getAppointmentServices(Request $request) {
		$appointment_services = DB::table('appointment_service')
									->join('sub_service', 'appointment_service.sub_service_id', '=', 'sub_service.id')
									->join('main_service', 'sub_service.parent_id', '=', 'main_service.id')
									->where('appointment_service.appointment_id', $request->appointmentId)
									->select('main_service.title as main', 'sub_service.title as sub', 'sub_service.price', 'appointment_service.is_selected as selected')
									->orderBy('appointment_service.appointment_id', 'asc')
									->get();

		$option_services = DB::table("appointment_option_service")
								->join('option_service', 'option_service.id', '=', 'appointment_option_service.option_service_id')
								->where('appointment_option_service.appointment_id', $request->appointmentId)
								->select('option_service.title as main', 'option_service.title as sub', 'option_service.price', 'appointment_option_service.is_selected as selected')
								->get();

		$index = sizeof($appointment_services);
		for ($i = 0; $i < sizeof($option_services); $i++) {
			$option_services[$i]->main = "Optional Service";
			$appointment_services[$index] = $option_services[$i];
			$index++;
		}
		
		return $appointment_services;
	}
	
	public function updateAppointmentAdvisor(Request $request) {
		DB::table('appointment')
		            ->where('id', $request->appointmentId)
		            ->update(array('advisor_id' => $request->advisorId));
		
		/* Sending email to advisor */
		$app = self::getAppointmentInfoPublic($request->appointmentId);
		$info = self::getAdvisorInfoPublic($request->advisorId);
		
		$sender = Config::get("mail.from");

	    $message = 'New appointment( ID: '.$request->appointmentId.', Customer: '.$app->customer.', URL: '.$request->url.') has been assigned to you.';

	    $data = array(
			'subject'=>'Appointment Assigned',
			'sender'=>$sender,
			'emailTo'=>$info->email
		);

	    Mail::raw($message, function ($m) use ($data){
			extract($data);
			$m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Advisor')->subject($subject);
		});
		/* Sending email to advisor end */

		return response()->success(compact('id'));
	}

	public function updateAppointmentMechanic(Request $request) {
		DB::table('appointment')
		            ->where('id', $request->appointmentId)
		            ->update(array('mechanic_id' => $request->mechanicId, 'status'=>2));
		
		/* Sending email to mechanic */
		$app = self::getAppointmentInfoPublic($request->appointmentId);
		$info = self::getAdvisorInfoPublic($request->mechanicId);

		$sender = Config::get("mail.from");

	    $message = 'New appointment( ID: '.$request->appointmentId.', Customer: '.$app->customer.', URL: '.$request->url.') has been assigned to you.';

	    $data = array(
			'subject'=>'Appointment Assigned',
			'sender'=>$sender,
			'emailTo'=>$info->email
		);

	    Mail::raw($message, function ($m) use ($data){
			extract($data);
			$m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Mechanic')->subject($subject);
		});
		/* Sending email to mechanic end */

		return response()->success(compact('id'));
	}

	public function sendInvoice(Request $request) {
		date_default_timezone_set('Asia/Dubai');

        self::updateAppointmentInfo($request->appointmentId, array('status'=>4, 'completion_time'=>date('Y-m-d H:i:s'), 'invoice' => $request->price));

		$info = self::getAppointmentInfoPublic($request->appointmentId);

		if($info->phone_number!=''){
        	$message='Dear '.$info->customer.', ';
			$message.='Your car, '.$info->make.' '.$info->model.' '.$info->year.', '.$info->trim.', is now ready. ';
			$message.='Don’t forget to book your next appointment on www.autobody.ae. We hope to see you soon! ';
			$message.=' Regards, Gargash Autobody';

			try{
				Twilio::message($info->phone_number, $message);
	    	}catch(\Services_Twilio_RestException $e){
	    		
	    	}
	    }

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

	public function getAutoMan($role){
		$query="select count(a.advisor_id) as total, a.advisor_id as id from appointment as a left join users as b on a.advisor_id = b.id left join role_user as c on b.id=c.user_id left join roles as d on c.role_id=d.id where b.auto_assign=1 and d.slug='$role' order by total desc limit 1";

		if($role == 'admin.mechanic'){
			$query="select count(a.mechanic_id) as total, a.mechanic_id as id from appointment as a left join users as b on a.mechanic_id = b.id left join role_user as c on b.id=c.user_id left join roles as d on c.role_id=d.id where b.auto_assign=1 and d.slug='$role' order by total desc limit 1";
		}

		$user = DB::select($query);

		if($user!=null)
			return (int)($user[0]->id);

		$query = "select a.id from users as a left join role_users as b on b.user_id = a.id left join roles as c on c.id=b.role_id where a.auto_assign=1 and c.slug='$role' order by a.id asc limit 1";

		$user = DB::select($query);

		if($user!=null)
			return (int)($user[0]->id);

		return 0;
	}

	public function newAppointment(Request $request) {
		$car = new Car;
		if($request->method == 'advanced'){
			// adding car info
			$car->make = $request->make;
			$car->year = $request->year;
			$car->model = $request->model;
			$car->trim = $request->trim;
			$car->save();
		}

		// adding customer
		$customer = Customer::where(['phone_number' => $request->phone])->first();
		if ($customer == null)
			$customer = new Customer;
		
		$customer->name = $request->name;
		$customer->email = $request->email;
		$customer->phone_number = $request->phone;
		$customer->save();


		// adding Appointment
		$appointment = new Appointment;
		$appointment->customer_id = $customer->id;

		if($request->method == 'advanced')
			$appointment->car_id = $car->id;
		else
			$appointment->car_id = 0;

		/* Get advisor, mechanic for auto assign */
		$advisor_id = self::getAutoMan('admin.user');
		//$mechanic_id = self::getAutoMan('admin.mechanic');
		$mechanic_id = 0;
		/* Get advisor, mechanic for auto assign end */

		date_default_timezone_set('Asia/Dubai');
		$appointment->book_time = date("Y-m-d H:i:s");
		$appointment->comment = $request->comment;
		$appointment->status = 1;
		$appointment->contact_method = $request->contact_method;
		$appointment->report_id = 0;
		$appointment->form_id = 0;
		$appointment->advisor_id = $advisor_id;
		$appointment->mechanic_id = $mechanic_id;
		$appointment->method = $request->method;
		$appointment->save();

		if($request->method == 'advanced'){
			// adding appointmentservice
			for ($i = 0; $i < sizeof($request->service); $i++) {
				$as = new AppointmentService;
				$as->appointment_id = $appointment->id;
				$as->sub_service_id = $request->service[$i];
				$as->is_selected = $request->service_selected[$i];
				$as->save();
			}

			// adding appointmentoptionservice
			for ($i = 0; $i < sizeof($request->option_services); $i++) {
				$aos = new AppointmentOptionService;
				$aos->appointment_id = $appointment->id;
				$aos->option_service_id = $request->option_services[$i];
				$aos->is_selected = $request->option_service_selected[$i];
				$aos->save();
			}
		}

		// adding appointmenttime
		$date = strtotime($request->date);
		for ($i = 0; $i < sizeof($request->times); $i++) {
			$at = new AppointmentTime;
			$at->appointment_id = $appointment->id;
			$at->appointment_date = date("Y-m-d", $date);
			$dt = strtotime($request->date . " " . $request->times[$i]);
			$at->appointment_time = date("Y-m-d H:i:s", $dt);
			$at->save();
		}

		$sender = Config::get("mail.from");
		
		$data = array(
			'subject'=>'Appointment Booked',
			'sender'=>$sender,
			'emailTo'=>$request->email,
			'data'=>$request
		);

		Mail::send('emails.book', $data, function ($m) use ($data){
        	extract($data);
            $m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Customer')->subject($subject);
        });

		/* Sending email to admin */
	    $message = 'New appointment for has booked.';

	    $data = array(
			'subject'=>'Appointment Booked',
			'sender'=>$sender,
			'emailTo'=>'amir@autobody.ae'
		);

	    Mail::raw($message, function ($m) use ($data){
			extract($data);
			$m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Admin')->subject($subject);
		}); 
		/* Sending email to admin end */

		if($advisor_id != 0){
			// Sending email to advisor 
			$info = self::getAdvisorInfoPublic($advisor_id);

			$sender = Config::get("mail.from");

		    //$message = 'New appointment has been assigned to you.';
		    $message = 'New appointment( ID: '.$appointment->id.', Customer: '.$customer->name.', URL: '.$request->url.$appointment->id.') has been assigned to you.';

		    $data = array(
				'subject'=>'Appointment Assigned',
				'sender'=>$sender,
				'emailTo'=>$info->email
			);

		    Mail::raw($message, function ($m) use ($data){
				extract($data);
				$m->from($sender, 'Gargash Autobody');
				$m->to($emailTo, 'Advisor')->subject($subject);
			});
			// Sending email to advisor end 
		}

		if($request->phone!=''){
			$message='Dear '.$request->name.', Thank you for booking an appointment with Gargash Autobody on '.date('d-m-y', strtotime($request->date)).' at '.date('H:i A', strtotime($request->times[0])).'. We look forward to welcoming you to a new automotive experience! Regards, Gargash Autobody';

	        try{
	        	Twilio::message($request->phone, $message);
	    	}catch (\Services_Twilio_RestException $e) {
	    		
	    	}
	    }
	}

	public function contact(Request $request) {
		$sender = Config::get("mail.from");

		$data = array(
			'subject'=>'Autobody - Call Me Now Action!',
			'sender'=>$sender,
			'emailTo'=>'osman@blueorange.co',
			'data'=>$request
		);

		Mail::send('emails.contact', $data, function ($m) use ($data){
        	extract($data);
            $m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Administrator')->subject($subject);
        });
	}

	public function cron(Request $request){
		date_default_timezone_set('Asia/Dubai');
		$time = strtotime(date("Y-m-d H:i:s"));

		$appointments = DB::select("select a.id as id, a.method as method, b.appointment_time as appointment_time from appointment as a left join appointment_time as b on a.id=b.appointment_id where a.is_notified = 0");
		
		foreach($appointments as $app){
			$temp = strtotime($app->appointment_time) - 24*60*60;

			if($time >= $temp && $time <= strtotime($app->appointment_time)){
				$info = self::getAppointmentInfoPublic($app->id);

				self::updateAppointmentInfo($app->id, array('is_notified'=>1));

				if($info->phone_number!=''){
		        	$message='Dear '.$info->customer.', ';
		        	
		        	if($app->method == 'advanced'){
						$message.='Your appointment for '.$info->make.' '.$info->model.' '.$info->year.', '.$info->trim.', is scheduled for tomorrow at '.date('H:i A', strtotime($app->appointment_time)).'. ';
					}else{
						$message.='Your appointment is scheduled for tomorrow at '.date('H:i A', strtotime($app->appointment_time)).'. ';
					}

					$message.='You can view our location, https://goo.gl/maps/6Jo42YEQz1q, or alternatively we will get in touch to arrange a pick up. ';
					$message.=' Regards, Gargash Autobody';

					try{
						Twilio::message($info->phone_number, $message);
			    	}catch (\Services_Twilio_RestException $e){
	    		
	    			}
			    }
			}
		}

		/*$sender = Config::get("mail.from");

	    $message = 'Cron is running.';

	    $data = array(
			'subject'=>'Autobody Cron',
			'sender'=>$sender,
			'emailTo'=>'mickeylee.lee5@gmail.com'
		);

	    Mail::raw($message, function ($m) use ($data){
			extract($data);
			$m->from($sender, 'Gargash Autobody');
			$m->to($emailTo, 'Tester')->subject($subject);
		});
		exit();*/
	}
}
