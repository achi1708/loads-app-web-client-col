<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Models\Loads;
use App\Models\Trucks;
use App\Models\truckType;
use App\Models\skillsTruck;
use App\Models\Carrier;
use App\Models\User;
use App\Helpers\Utils;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\DB;
use \Firebase\JWT\JWT;
use SKAgarwal\GoogleApi\PlacesApi;
use App\Models\TipoDeTrailer;

class TrucksController extends Controller
{
	public function getTruckTypes(Request $request)
    {
        $getTruckTypes = truckType::get();

        return response()->json([
            'status' => 'ok',
            'message' => array('trucktypes_list' => $getTruckTypes),
        ]);
    }
    public function CountTruckxCarrier(Request $request){
        $post = $request->all();
        $validate_truck = array(
                            'token' => 'required'
                         );
        $msg_valid_truck = array(
                            'required' => 'Por favor completar el campo de :attribute'
                            
                         );

        $valida_truck = Validator::make($post, $validate_truck, $msg_valid_truck);


         if($valida_truck->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $valida_truck->errors(),
            ]);
        }else{

            try{
                //se decodifica el token para obtener los datos del usuario
                $decode_token = JWT::decode($post['token'], \Config::get('app.key'), array('HS256'));
                if(isset($decode_token->id)){
                    $dataUser = Carrier::where('user_id', '=', $decode_token->id)->first();
                }
            } catch(Exception $e){

            }

             if($dataUser){
              
                $getAllTrucksSearch = $this->getTrucksforCarrier($decode_token->id, false);


                $countAllTrucks = count($getAllTrucksSearch);
                return response()->json([
                            'status' => 'ok',
                            'message' => array('truck_total_results' => $countAllTrucks),
                        ]);


             }else{
                    return response()->json(Utils::getError(\Config::get('app.USER_INVALID')));
             }


        }


    }
    public function trucksxCarrier(Request $request)
    {
        $post = $request->all();
        $limit = 20;
        $offset = 0;
        $totalPages = 0;
        $allowNextPage = false;
        $countAllTrucks = 0;
        $validate_truck = array(
                            'token' => 'required',
                            'page' => 'required'
                         );
        $msg_valid_truck = array(
                            'required' => 'Por favor completar el campo de :attribute',
                            'exists' => 'No existe referencia de carrier por el id recibido.'
                         );

        $valida_truck = Validator::make($post, $validate_truck, $msg_valid_truck);

        if($valida_truck->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $valida_truck->errors(),
            ]);
        }else{
            
            try{
                //se decodifica el token para obtener los datos del usuario
                $decode_token = JWT::decode($post['token'], \Config::get('app.key'), array('HS256'));
                if(isset($decode_token->id)){
                    $dataUser = Carrier::where('user_id', '=', $decode_token->id)->first();
                }
            } catch(Exception $e){

            }

             if($dataUser){

                    if(isset($post['shortcut'])){
                        $busqueda=$post['shortcut'];
                    }else{
                         $busqueda='all';
                    }   

                    $queryCarrier = Carrier::with(['user' => function($q){
                                            $q->with(['city' => function($q){
                                                $q->with('stateLocation');
                                            }])->with('userVotes');
                                        }])->where('user_id', '=', $decode_token->id)->first();

                        $offset = ($post['page'] - 1) * $limit;
                        $getTrucksSearch = $this->getTrucksforCarrier($decode_token->id, true, $offset, $limit,$busqueda);
                        $getAllTrucksSearch = $this->getTrucksforCarrier($decode_token->id, false, $offset, $limit,$busqueda);
                        $countAllTrucks = count($getAllTrucksSearch);

                        if($getAllTrucksSearch && count($getAllTrucksSearch) > 0){
                            $totalPages = ceil($countAllTrucks/$limit);
                            if($post['page'] < $totalPages){
                                $allowNextPage = true;                            
                            }
                        }

                        $final_data_trucks = array();

                        foreach ($getTrucksSearch as $key => $value) {
                             $value->img_truck_imagenes=json_decode($value->imagenes_trucks); 
                             unset($value->imagenes_trucks);  
                                foreach ($value->truckAvailability as $keytres => $valuetres) {
                                   unset($valuetres->availablity_date_register);
                                   unset($valuetres->pivot);
                                } 


                             array_push($final_data_trucks, $value);
                        }   

                        return response()->json([
                                'status' => 'ok',
                                'message' => array('carrier_info' => $queryCarrier, 'truck_total_results' => $countAllTrucks, 'truck_results' => $final_data_trucks, 'current_page' => $post['page'], 'total_pages' => $totalPages),
                            ]); 

                  


             }else{
                    return response()->json(Utils::getError(\Config::get('app.USER_INVALID')));
             }

           
        }

    }



    public function createTruck(Request $request){

        $post = $request->all();
        $limitedext = array(".jpg");
        $ext = "";
        if(isset($_FILES['pic'])){
            $ext = strrchr($_FILES['pic']['name'],'.');
        }

        $validate_user = array(
                            'token' => 'required',
                            'brand' => 'required',
                            'model' => 'required',
                            'year' => 'required',
                            'plate' => 'required',
                            //'id_driver' => 'required',
                            'id_truck_type'=> 'required',
                            'tipodetrailer'=> 'required',
                            //'weight'=> 'required',
                            //'id_capacity_size'=> 'required',
                            'skils_truck'=> 'required',
                            //'max_distance'=> 'required',
                            'availablity'=> 'required'
                            
                         );

        $msg_valid_user = array(
                            'required' => 'Por favor completar el campo de :attribute',
                            'profile.exists' => 'Por favor ingrese un perfil valido.',
                            'user_email.email' => 'Por favor ingrese un email valido.',
                            'user_email.unique' => '0054',
                            'required_unless' => 'Por favor completar el campo de :attribute.',
                            'required_if' => 'Por favor completar el campo de :attribute.'
                           );

        $valida_user = Validator::make($post, $validate_user, $msg_valid_user);

        if($valida_user->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $valida_user->errors(),
            ]);
        }elseif(!in_array(strtolower($ext),$limitedext) && isset($_FILES['pic'])){
            /*return response()->json([
                'status' => 'error',
                'message' => 'El archivo seleccionado sobrepasa el límite de 5MB',
            ]);*/
            return response()->json(Utils::getError(\Config::get('app.MAX_LIMIT_EXCEEDED')));

        }else{


                  try{
                         //se decodifica el token para obtener los datos del usuario
                        $decode_token = JWT::decode($post['token'], \Config::get('app.key'), array('HS256'));
                        if(isset($decode_token->id)){
                            $dataUser = Carrier::where('user_id', '=', $decode_token->id)->first();
                        }
                    } catch(Exception $e){

                    }


                   if($dataUser){

                        if($decode_token->profile_desc=="OWNER"){
                            $GetdataTruck = Trucks::where('truck_carrier_owner', '=', $decode_token->id)->first();
                                if($GetdataTruck){
                                    return response()->json(Utils::getError(\Config::get('app.OWNER_UNIC_TRUCK')));
                                }else{
                                     $idCarrier=$decode_token->id;  
                                        $TruckCreated = Trucks::createTruck($post,$idCarrier);
                                             if($TruckCreated && count($TruckCreated) > 0){
                                                    return response()->json([
                                                        'status' => 'ok',
                                                        'message' => array('truck' => $TruckCreated['truck_data']),
                                                    ]);
                                             }   
                                }

                        }else{
                            $idCarrier=$decode_token->id;  
                            $TruckCreated = Trucks::createTruck($post,$idCarrier);
                                 if($TruckCreated && count($TruckCreated) > 0){
                                        return response()->json([
                                            'status' => 'ok',
                                            'message' => array('truck' => $TruckCreated['truck_data']),
                                        ]);
                                 }  
                        }
                           
                            
                    
                   }else{
                    
                    return response()->json(Utils::getError(\Config::get('app.USER_INVALID')));
                   
                   }    

        }   



    }

    public function UpdateTruck(Request $request){

        $post = $request->all();
        $limitedext = array(".jpg");
        $ext = "";
        if(isset($_FILES['pic'])){
            $ext = strrchr($_FILES['pic']['name'],'.');
        }

        $validate_user = array(
                            'token' => 'required',
                            'id_truck'=> 'required'
                            
                         );

        $msg_valid_user = array(
                            'required' => 'Por favor completar el campo de :attribute'
                         );

        $valida_truck = Validator::make($post, $validate_user, $msg_valid_user);

        if($valida_truck->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $valida_truck->errors(),
            ]);
        }else{

            try{
                //se decodifica el token para obtener los datos del usuario
                $decode_token = JWT::decode($post['token'], \Config::get('app.key'), array('HS256'));
                if(isset($decode_token->id)){
                    $dataTruck = Trucks::where('truck_carrier_owner', '=', $decode_token->id)->where('id', '=', $post['id_truck'])->first();
                }
            } catch(Exception $e){

            }


                  if($dataTruck){

                    $TruckUpdate = Trucks::updateTruck($post, $post['id_truck']);

                         if($TruckUpdate && count($TruckUpdate) > 0){

                                if(isset($TruckUpdate['truck_data']->imagenes_trucks)){
                                    $img_perfil_dec = json_decode($TruckUpdate['truck_data']->imagenes_trucks);
                                    $TruckUpdate['truck_data']->imagenes_trucks = $img_perfil_dec;
                                }

                               
                           return response()->json([
                                    'status' => 'ok',
                                    'message' => array('truck' =>$TruckUpdate['truck_data']),
                                ]);

                         }else{
                             return response()->json(Utils::getError(\Config::get('app.INFO_DONT_SAVE')));
                         }
                    

                   }else{
                    
                    return response()->json(Utils::getError(\Config::get('app.USER_INVALID')));
                   
                   }  




        }


     }    
    
    private function getTrucksforCarrier($carrier, $perPages = false, $offset = 0, $limit = 10,$busqueda='all')
    {
       


      switch($busqueda){
                case 'AssignAtload':

                  $querySearch = Trucks::with('truckCapacity')
                                ->with(['driver' => function($q){
                                     $q->with(['user' => function($q){
                                         $q->with('userVotes');
                                     }]);                           
                                }])
                             ->with('truckType')
                             ->with('truckAvailability')
                             ->select(DB::raw('trucks.*'))
                             ->join('carrier', 'trucks.truck_carrier_owner', '=', 'carrier.user_id')
                             ->where('trucks.truck_carrier_owner', '=', $carrier)->orderBy('truck_date_register', 'DESC');

                if($perPages){
                    $querySearch = $querySearch->skip($offset)->limit($limit);
                }

                return $querySearch->get();

                 break;

                case 'all':

                  $querySearch = Trucks::with('truckCapacity')
                                ->with(['driver' => function($q){
                                     $q->with(['user' => function($q){
                                         $q->with('userVotes');
                                     }]);                           
                                }])
                             ->with('truckType')
                             ->with('truckAvailability')
                             ->select(DB::raw('trucks.*'))
                             ->join('carrier', 'trucks.truck_carrier_owner', '=', 'carrier.user_id')
                             ->where('trucks.truck_carrier_owner', '=', $carrier)->orderBy('truck_date_register', 'DESC');

                if($perPages){
                    $querySearch = $querySearch->skip($offset)->limit($limit);
                }

                return $querySearch->get();

                 break;

                case 'active':

                  $querySearch = Trucks::with('truckCapacity')
                                ->with(['driver' => function($q){
                                     $q->with(['user' => function($q){
                                         $q->with('userVotes');
                                     }]);                           
                                }])
                             ->with('truckType')
                             ->with('truckAvailability')
                             ->select(DB::raw('trucks.*'))
                             ->join('carrier', 'trucks.truck_carrier_owner', '=', 'carrier.user_id')
                             ->where('trucks.truck_carrier_owner', '=', $carrier)
                             ->where('trucks.status', '=', 1)->orderBy('truck_date_register', 'DESC');

                if($perPages){
                    $querySearch = $querySearch->skip($offset)->limit($limit);
                }

                return $querySearch->get();

                 break;

                 case 'inactive':

                  $querySearch = Trucks::with('truckCapacity')
                                ->with(['driver' => function($q){
                                     $q->with(['user' => function($q){
                                         $q->with('userVotes');
                                     }]);                           
                                }])
                             ->with('truckType')
                             ->with('truckAvailability')
                             ->select(DB::raw('trucks.*'))
                             ->join('carrier', 'trucks.truck_carrier_owner', '=', 'carrier.user_id')
                             ->where('trucks.truck_carrier_owner', '=', $carrier)
                             ->where('trucks.status', '=', 0)->orderBy('truck_date_register', 'DESC');

                if($perPages){
                    $querySearch = $querySearch->skip($offset)->limit($limit);
                }

                return $querySearch->get();

                 break; 


        }
       



    }

    public function DetailTruck(Request $request){
        $post = $request->all();
        $validate_truck = array(
                            'token' => 'required',
                            'id' => 'required|exists:trucks,id'
                         );
        $msg_valid_truck = array(
                            'required' => 'Por favor completar el campo de :attribute',
                            'id.exists' => 'El id del Truck no existe'
                         );

        $valida_truck = Validator::make($post, $validate_truck, $msg_valid_truck);

        if($valida_truck->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $valida_truck->errors(),
            ]);
        }else{

            try{
                //se decodifica el token para obtener los datos del usuario
                $decode_token = JWT::decode($post['token'], \Config::get('app.key'), array('HS256'));
               
            } catch(Exception $e){

            }

            if($decode_token->profile_desc == 'CARRIER' || $decode_token->profile_desc == 'DRIVER' || $decode_token->profile_desc == 'GENERADOR_CARGA' || $decode_token->profile_desc == 'OWNER'){

                $id_truck=$post['id'];

                $queryDetailTruck = Trucks::with('truckCapacity')
                                ->with(['driver' => function($q){
                                     $q->with(['user' => function($q){
                                         $q->with('userVotes');
                                     }]);                           
                                }])
                             ->with('TipoDeTrailer')->with('truckType')->with('skillsTruck')
                             ->with('truckAvailability')
                             ->select(DB::raw('trucks.*'))
                             ->join('carrier', 'trucks.truck_carrier_owner', '=', 'carrier.user_id')
                             ->where('trucks.id', '=', $id_truck)->get();

                if($queryDetailTruck && count($queryDetailTruck) > 0){

                    $final_data_truck = array();
                     


                    foreach ($queryDetailTruck as $key => $value) {

                        $value->Loads_Transported=count(Utils::CountLoadsForTrucksByStatus($value->id,$estatus='TRANSPORTED'));;
                       $value->max_distance=$value->max_distance." mi";

                        if(isset($value->imagenes_trucks)){
                            $img_perfil_dec = json_decode($value->imagenes_trucks);
                            $value->imagenes_trucks = $img_perfil_dec;
                        }

                    foreach ($value['skillsTruck'] as $keydos => $valuedos) {
                            unset($valuedos->pivot);
                        } 

                     foreach ($value['truckAvailability'] as $keytres => $valuetres) {
                           
                           unset($valuetres->availablity_date_register);
                           unset($valuetres->pivot);
                            //var_dump($valuetres);
                        }        

                     array_push($final_data_truck, $value);


                    }
                        
                   // array_push($final_data_truck, $value);

                }

                




                return response()->json([
                    'status' => 'ok',
                    'message' => array('Truck_Details' => $final_data_truck),
                ]);   



                
            }else{

                return response()->json(Utils::getError(\Config::get('app.USER_INVALID')));
            
            }



        }



    }


    public function PointsOfInterest(Request $request){
        $google_places = new \joshtronic\GooglePlaces('AIzaSyD6fAyGG_2ybQkyaMmgRYFNolLQw3_Drtc');
        

        $post = $request->all();
        $validate_truck = array(
                            'token' => 'required',
                            'lat'=> 'required',
                            'long'=> 'required'
                            
                         );
        $msg_valid_truck = array(
                            'required' => 'Por favor completar el campo de :attribute'
                         );

        $valida_truck = Validator::make($post, $validate_truck, $msg_valid_truck);

          if($valida_truck->fails()){
            return response()->json([
                'status' => 'error',
                'message' => $valida_truck->errors(),
            ]);
        }else{

            try{
                //se decodifica el token para obtener los datos del usuario
                $decode_token = JWT::decode($post['token'], \Config::get('app.key'), array('HS256'));
               
            } catch(Exception $e){

            }

            if(isset($decode_token->id)){
                $userData = User::find($decode_token->id);
                if($userData){
                        $lat=$post['lat'];
                        $long=$post['long'];
                        
                        $google_places->location = array($lat, $long);
                        
                        
                       if(isset($post['radius'])){
                                $google_places->radius = $post['radius'];
                        }else{
                             $google_places->radius =  20000;
                        }
                        
                        if(isset($post['shortcut'])){
                            $google_places->types    = $post['shortcut']; // Requires keyword, name or types

                        }else{
                            $google_places->types    = "restaurant|gas_station|lodging|parking"; // Requires keyword, name or types

                        }

                        $google_places->keyword='cruise';
                        $results                 = $google_places->nearbysearch();

                       
                        return response()->json([
                                    'status' => 'ok',
                                    'message' => array('PointsOfInterest' => $results),
                                ]);


                }else{
                    return response()->json(Utils::getError(\Config::get('app.USER_INVALID')));
                }
            }     
        }


    }
    

    

}
