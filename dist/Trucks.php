<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Input;
use App\Models\skillsTruck;
use App\Helpers\Utils;

class Trucks extends Model
{
    /**
     * Table name
     */
    protected $table = 'trucks';
    public $timestamps = false;

    public function carrier()
    {
        return $this->belongsTo('App\Models\Carrier', 'truck_carrier_owner', 'user_id');
    }

    public function driver()
    {
        return $this->belongsTo('App\Models\Driver', 'truck_driver', 'user_id');
    }

    public function truckType()
    {
        return $this->belongsTo('App\Models\truckType', 'truck_type');
    }

    public function TipoDeTrailer()
    {
        return $this->belongsToMany('App\Models\TipoDeTrailer', 'tipo_de_trailer_has_trucks', 'trucks_id', 'tipo_de_trailer_id');
    }

    public function truckCapacity()
    {
        return $this->belongsTo('App\Models\truckCapacity', 'truck_capacity');
    }

    public function truckAvailability()
    {
        return $this->belongsToMany('App\Models\truckAvailability', 'truck_has_availablities_relationship', 'truck_id', 'availablity_id');
    }

    public function skillsTruck()
    {
        return $this->belongsToMany('App\Models\skillsTruck', 'trucks_has_skills_truck', 'trucks_id', 'skills_truck_id');
    }

    public static function updateTruck($data,$idtruck){

        $truck = false;
        if(isset($idtruck)){
            $truck = self::find($idtruck);
        }

        if(isset($data['brand']) and $data['brand']!=""){$truck->brand = (isset($data['brand'])) ? $data['brand'] : '';}
        
        if(isset($data['model']) and $data['model']!=""){$truck->model = (isset($data['model'])) ? $data['model'] : 0;}
        
        if(isset($data['year']) and $data['year']!=""){ $truck->year = (isset($data['year'])) ? $data['year'] : '';}
        
        if(isset($data['plate']) and $data['plate']!=""){$truck->plate = (isset($data['plate'])) ? $data['plate'] : 0;}
        
        if(isset($data['id_driver']) and $data['id_driver']!=""){ $truck->truck_driver = (isset($data['id_driver'])) ? $data['id_driver'] : '';}

        if(isset($data['id_truck_type']) and $data['id_truck_type']!=""){ $truck->truck_type = (isset($data['id_truck_type'])) ? $data['id_truck_type'] : '';}

        if(isset($data['length']) and $data['length']!=""){ $truck->length = (isset($data['length']) ) ? $data['length'].' ft' : '';}
        
        if(isset($data['weight']) and $data['weight']!=""){ $truck->weight = (isset($data['weight']) ) ? $data['weight'].' kg' : '';}
        
        if(isset($data['id_capacity_size']) and $data['id_capacity_size']!=""){ $truck->truck_capacity = (isset($data['id_capacity_size'])) ? $data['id_capacity_size'] : '';}
        
        if(isset($data['max_distance']) and $data['max_distance']!=""){ $truck->max_distance = (isset($data['max_distance'])) ? $data['max_distance'].' mi' : '';}
        
        if(isset($data['additional_info']) and $data['additional_info']!=""){ $truck->additional_info = (isset($data['additional_info'])) ? $data['additional_info'] : '';}

        if(isset($data['status']) and $data['status']!=""){ $truck->status = (isset($data['status'])) ? $data['status'] : '0';}
        
        if(isset($data['plate_trailer']) and $data['plate_trailer']!=""){$truck->plate_trailer = (isset($data['plate_trailer'])) ? $data['plate_trailer'] : '';}

    
        /*Data info save img truck*/
        /*guardado de foto declaracion de variable*/
        $limitedext = array(".jpg");
        $ext = "";
                    
        $perfil_paths = storage_path()."/app/public/".env('DIR_TRUCKS', 'trucks/');  
        $URLwebservice = env('APP_URL', 'http://smartpark.com.co/');

        if(isset($data['skils_truck'])){
                        $data['skils_truck'] = json_decode($data['skils_truck']);
                        if(is_array($data['skils_truck'])){
                                
                           $deleteacction=self::DeleteSkillToTruck($idtruck);

                           if($deleteacction){
                               foreach ($data['skils_truck'] as $key => $value) {
                                    $searchSkill = skillsTruck::find($value);
                                    if($searchSkill){
                                        $dataSkillLoad = array('trucks_id' => $idtruck,
                                                               'skills_truck_id' => $value);
                                        self::addSkillToTruck($dataSkillLoad);
                                    }
                                }
                            }else{
                                   foreach ($data['skils_truck'] as $key => $value) {
                                        $searchSkill = skillsTruck::find($value);
                                        if($searchSkill){
                                            $dataSkillLoad = array('trucks_id' => $idtruck,
                                                                   'skills_truck_id' => $value);
                                            self::addSkillToTruck($dataSkillLoad);
                                        }
                                    }
                            }

                        }
        }  

        if(isset($data['availablity'])){   
                       $data['availablity'] = json_decode($data['availablity']);
                        if(is_array($data['availablity']) and isset($data['availablity'])){
                           $deleteacction=self::DeleteAvailablityToTruck($idtruck);

                          if($deleteacction){ 
                               foreach ($data['availablity'] as $key => $valuedos) {
                                   
                                    $searchAvailablity = truckAvailability::find($valuedos);
                                    
                                    if($searchAvailablity){
                                        $dataAvailablityTruck = array('truck_id' => $idtruck,
                                                               'availablity_id' => $valuedos);
                                       self::addAvailablityToTruck($dataAvailablityTruck);
                                    }
                                }
                            }else{

                                foreach ($data['availablity'] as $key => $valuedos) {
                                   
                                    $searchAvailablity = truckAvailability::find($valuedos);
                                    
                                    if($searchAvailablity){
                                        $dataAvailablityTruck = array('truck_id' => $idtruck,
                                                               'availablity_id' => $valuedos);
                                       self::addAvailablityToTruck($dataAvailablityTruck);
                                    }
                                }   
                            }

                        }
        }

         if(isset($data['tipodetrailer'])){   
                       $data['tipodetrailer'] = json_decode($data['tipodetrailer']);
                        if(is_array($data['tipodetrailer']) and isset($data['tipodetrailer'])){
                           $deleteacction=self::DeleteTipoDeTrailerToTruck($idtruck);

                          if($deleteacction){ 
                               foreach ($data['tipodetrailer'] as $key => $valuedos) {
                                    $searchAvailablity = TipoDeTrailer::find($valuedos);
                                    if($searchAvailablity){
                                        $dataAvailablityTruck = array('trucks_id' => $idtruck,
                                                               'tipo_de_trailer_id' => $valuedos);
                                       self::addTipoDeTrailerToTruck($dataAvailablityTruck);
                                    }


                                }
                            }else{

                                foreach ($data['tipodetrailer'] as $key => $valuedos) {
                                   
                                    $searchAvailablity = TipoDeTrailer::find($valuedos);
                                    if($searchAvailablity){
                                        $dataAvailablityTruck = array('trucks_id' => $idtruck,
                                                               'tipo_de_trailer_id' => $valuedos);
                                       self::addTipoDeTrailerToTruck($dataAvailablityTruck);
                                    }
                                }   
                            }

                        }
        }  



         if(isset($_FILES['pic'])){
                                    $ext = strrchr($_FILES['pic']['name'],'.');
                                    $dataTruckNew = Trucks::find($idtruck);

                                     if($dataTruckNew){  
                                            $id_newTruck= $idtruck;  
                                            $hashImg=Utils::randomString(10);
                                            $NamePre='imagen_'.$hashImg.$id_newTruck;

                                            $perfil_file_name = $NamePre.$ext;

                                            $uploadFileTruck = Utils::uploadFilePic(Input::file('pic'), $perfil_paths, $perfil_file_name,$id_newTruck,$NamePre,".jpgs");
                                           
                                        if($uploadFileTruck){
                                            
                                                    $arrayimg='[{"imagen-60":"'.$URLwebservice.'storage/app/public/trucks/'.$NamePre.'x60'.'.jpg","imagen-180":"'.$URLwebservice.'storage/app/public/trucks/'.$NamePre.'x180'.'.jpg","imagen-270":"'.$URLwebservice.'storage/app/public/trucks/'.$NamePre.'x270'.'.jpg"}]';

                                                    $json_string = $arrayimg;
                                                 
                                                    $truck->imagenes_trucks  = $json_string;
                                                        

                                                }else{

                                                   return response()->json(Utils::getError(\Config::get('app.INFO_DONT_SAVE')));

                                                }   
                                         }   
                        
        }


        if($truck->save()){
            return array('truck_data' => $truck);
        }else{
            return false;
        }

    }

    public static function createTruck($data,$idcarrier)
    {
        $new_truck = new Trucks();

        /*Datos anteriores validar funcionalidad*/
        $new_truck->brand = (isset($data['brand'])) ? $data['brand'] : '';
        $new_truck->model = (isset($data['model'])) ? $data['model'] : 0;
        $new_truck->year = (isset($data['year'])) ? $data['year'] : '';
        $new_truck->plate = (isset($data['plate'])) ? $data['plate'] : 0;
        $new_truck->truck_driver = (isset($data['id_driver'])) ? $data['id_driver'] : NULL;
        $new_truck->truck_type = (isset($data['id_truck_type'])) ? $data['id_truck_type'] : '';
        $new_truck->length = (isset($data['length'])) ? $data['length'].' ft' : '';
        $new_truck->weight = (isset($data['weight'])) ? $data['weight'].' kg' : '';
        $new_truck->truck_capacity = (isset($data['id_capacity_size'])) ? $data['id_capacity_size'] :NULL;
        $new_truck->truck_carrier_owner = (isset($idcarrier)) ? $idcarrier : '';
        $new_truck->max_distance = (isset($data['max_distance'])) ? $data['max_distance'].' mi' : '';
        $new_truck->additional_info = (isset($data['additional_info'])) ? $data['additional_info'] : '';

        $new_truck->plate_trailer = (isset($data['plate_trailer'])) ? $data['plate_trailer'] : '';

        

        /*Data info save img truck*/
        /*guardado de foto declaracion de variable*/
        $limitedext = array(".jpg");
        $ext = "";
                    
        $perfil_paths = storage_path()."/app/public/".env('DIR_TRUCKS', 'trucks/');  
        $URLwebservice = env('APP_URL', 'http://smartpark.com.co/');
      


        if($new_truck->save()){

                        
                    if(isset($data['skils_truck'])){


                        $data['skils_truck'] = json_decode($data['skils_truck']);
                        if(is_array($data['skils_truck'])){
                            
                           foreach ($data['skils_truck'] as $key => $value) {
                               
                                $searchSkill = skillsTruck::find($value);

                                if($searchSkill){
                                    $dataSkillLoad = array('trucks_id' => $new_truck->id,
                                                           'skills_truck_id' => $value);
                                   self::addSkillToTruck($dataSkillLoad);
                                }
                            }
                        }
                    }   


                    if(isset($data['availablity'])){   
                       $data['availablity'] = json_decode($data['availablity']);
                        if(is_array($data['availablity']) and isset($data['availablity'])){
                           foreach ($data['availablity'] as $key => $valuedos) {
                               
                                $searchAvailablity = truckAvailability::find($valuedos);
                                
                                if($searchAvailablity){
                                    $dataAvailablityTruck = array('truck_id' => $new_truck->id,
                                                           'availablity_id' => $valuedos);
                                   self::addAvailablityToTruck($dataAvailablityTruck);
                                }
                            }
                        }
                    }

                    if(isset($data['tipodetrailer'])){   
                       $data['tipodetrailer'] = json_decode($data['tipodetrailer']);
                        if(is_array($data['tipodetrailer']) and isset($data['tipodetrailer'])){
                           foreach ($data['tipodetrailer'] as $key => $valuedos) {
                               
                                $searchAvailablity = TipoDeTrailer::find($valuedos);
                                
                                if($searchAvailablity){
                                    $dataAvailablityTruck = array('trucks_id' => $new_truck->id,
                                                           'tipo_de_trailer_id' => $valuedos);
                                   self::addTipoDeTrailerToTruck($dataAvailablityTruck);
                                }
                            }
                        }
                    }    

                    


                        if(isset($_FILES['pic'])){
                                    $ext = strrchr($_FILES['pic']['name'],'.');
                                    $dataTruckNew = Trucks::find($new_truck->id);

                                     if($dataTruckNew){  
                                            $id_newTruck= $new_truck->id;  
                                            $hashImg=Utils::randomString(10);
                                            $NamePre='imagen_'.$hashImg.$id_newTruck;

                                            $perfil_file_name = $NamePre.$ext;

                                            $uploadFileTruck = Utils::uploadFilePic(Input::file('pic'), $perfil_paths, $perfil_file_name,$id_newTruck,$NamePre,".jpg");
                                           


                                        if($uploadFileTruck){
                                            
                                                    $arrayimg='[{"imagen-60":"'.$URLwebservice.'storage/app/public/trucks/'.$NamePre.'x60'.'.jpg","imagen-180":"'.$URLwebservice.'storage/app/public/trucks/'.$NamePre.'x180'.'.jpg","imagen-270":"'.$URLwebservice.'storage/app/public/trucks/'.$NamePre.'x270'.'.jpg"}]';

                                                    $json_string = $arrayimg;
                                                    $dataTruckNew->imagenes_trucks = $json_string;

                                                        if($dataTruckNew->save()){
                                                        
                                                        

                                                        }else{
                                                            return false;
                                                            
                                                        }
                                                

                                                }else{

                                                    return false;

                                                }   
                                         }   
                        
                        }

                        return array('truck_data' => $new_truck);
        }else{
            return false;
        }

    }

    public static function getUserDriver($id_user){
         $truckInfo = self::with(['driver' => function($q){
                                $q->with(['user' => function($q){
                                    $q->with('userVotes');
                                }]);
                            }])->where('id', '=', $id_user)->first();





         return $truckInfo;
    }
    
    public static function addSkillToTruck($data)
    {
        $truck = self::find($data['trucks_id']);
        $save = $truck->skillsTruck()->attach($data['skills_truck_id']);

        return $save;
    }

    public static function addAvailablityToTruck($data)
    {
        $truck = self::find($data['truck_id']);
        $save = $truck->truckAvailability()->attach($data['availablity_id']);

        return $save;
    }

    public static function addTipoDeTrailerToTruck($data)
    {
        $truck = self::find($data['trucks_id']);
        $save = $truck->TipoDeTrailer()->attach($data['tipo_de_trailer_id']);

        return $save;
    }

    public static function DeleteSkillToTruck($trucks_id){
        $truck = self::find($trucks_id);
        $save = $truck->skillsTruck()->detach();
        return $save;

    }

    public static function DeleteAvailablityToTruck($trucks_id){
        $truck = self::find($trucks_id);
        $save = $truck->truckAvailability()->detach();
        return $save;

    }

    public static function DeleteTipoDeTrailerToTruck($trucks_id){
        $truck = self::find($trucks_id);
        $save = $truck->TipoDeTrailer()->detach();
        return $save;

    }

    public static function UpdateLatAndLon($iduser,$lat,$long){

        $GetTruckInfo=self::where('truck_driver', '=', $iduser)->update(['latitud_truck' => $lat,'longitud_truck' => $long]);


    }

    public static function UpdateDriverTruck($trucks_id,$idDriver=null){
        $truck = false;
        if(isset($trucks_id)){
            $truck = self::find($trucks_id);
        }

        $truck->truck_driver =  $idDriver ;

        if($truck->save()){
            return 1;
        }else{
            return 0;
        }   

    }

    
}
