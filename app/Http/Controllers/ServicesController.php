<?php

namespace App\Http\Controllers;

use App\MainService;
use App\SubService;

use Illuminate\Http\Request;

use App\Http\Requests;

class ServicesController extends Controller
{
    public function index() {
    	
	}
	
	public function getMainServices() {
		$main_services = MainService::all();
		
		return $main_services;
	}
	
	public function getSubServices(Request $request) {
		$sub_services = SubService::where('parent_id', '=', $request->serviceId)->get();
		
		return $sub_services;
	}
	
	public function addMainService(Request $request)
    {
	    $service = MainService::create([
	        'title' => $request->name
	    ]);
    
    	return response()->success(compact('service'));
    }
    
    public function addSubService(Request $request)
    {
        $service = SubService::create([
        	'parent_id' => $request->parentId,
            'title' => $request->name,
            'price' => $request->price,
            'description' => $request->description
        ]);
    
    	return response()->success(compact('service'));
    }
    
    public function updateMainService(Request $request)
    {
        $service = MainService::find($request->id);
    	
    	$serviceData = [
            'title' => $request->title
        ];

        MainService::where('id', '=', $request->id)->update($serviceData);
    	
        return response()->success('success');
    }
    
    public function updateSubService(Request $request)
    {
        $service = SubService::find($request->id);
    	
    	$serviceData = [
            'title' => $request->title,
            'price' => $request->price,
            'description' => $request->description
        ];

        SubService::where('id', '=', $request->id)->update($serviceData);
    	
        return response()->success('success');
    }
    
    public function deleteMainService(Request $request)
    {
    	MainService::destroy($request->id);
    	
    	return response()->success('success');
    }
    
    public function deleteSubService(Request $request)
    {
    	SubService::destroy($request->id);
    	
    	return response()->success('success');
    }
    
    public function getMainServiceInfo(Request $request)
    {
        $service = MainService::find($request->serviceId);

        return response()->success($service);
    }
    
    public function getSubServiceInfo(Request $request)
    {
        $service = SubService::find($request->serviceId);

        return response()->success($service);
    }
}
