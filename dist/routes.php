<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () { return view('welcome'); });

Route::get('pruebaMiddleware', ['middleware' => ['request_origin'], function(){
	exit("pruebaMiddleware");
}]);

Route::group(['prefix' => 'api/v1'], function(){
	//
	// Security
	//Se defne servicion y metodos de seguridad primordial y basica.
	// -------------------------
	Route::group(['prefix' => 'security'], function(){
		
		/*
		- Realiza el login del usuario
		*/	
		Route::post('/auth', [
			'middleware' => [
				'auth',
				// 'signature',
			],
			'uses' => 'SecurityController@auth',
		]);

		/*
		- Realiza el login del usuario
		*/	
		Route::post('auth/doLogin', [ 'uses' => 'SecurityController@doLogin' ]);
		/*
		- resetea el password y envia un email al correo registrado por el usuario.
		*/
		Route::post('auth/rememberPassword', [ 'uses' => 'SecurityController@resetPassword' ]);
		/*
		- Cambia el password del usuario.
		*/
		Route::post('auth/changePassword', [ 'uses' => 'SecurityController@changePassword' ]);

	});


	//
	// Media files
	// -------------------------
	Route::group(['prefix' => 'media'], function(){
		Route::get('/{directory}/{filename}', [
			'middleware' => [
				'signature',
				'jwt',
			],
			'uses' => 'MediaController@get',
		])->where('directory', '[a-zA-Z0-9_-]+')->where('filename', '[a-zA-Z0-9._-]+');

		Route::get('/public/{directory}/{filename}', [
			'middleware' => [],
			'uses' => 'MediaController@get',
		])->where('directory', '[a-zA-Z0-9_-]+')->where('filename', '[a-zA-Z0-9._-]+');
	});


	//
	// Users
	// -------------------------
	Route::group(['prefix' => 'user'], function(){
		Route::get('/', [
			'middleware' => [
				'signature',
				'jwt',
			],
			'uses' => 'UserController@get',
		]);

		Route::post('/update', [
			'middleware' => [
				'signature',
				'jwt',
			],
			'uses' => 'UserController@update',
		]);

		// Crear usuario
		Route::post('/create', [
			'middleware' => [],
			'uses' => 'UserController@create',
		]);

		Route::post('/find', [
			'middleware' => [],
			'uses' => 'UserController@find',
		]);

		Route::get('/get-user-types-and-company', [
			'middleware' => [],
			'uses' => 'UserController@getUserTypesAndCompanies',
		]);

		Route::get('/information', [
			'middleware' => [],
			'uses' => 'UserController@getInformation',
		]);

		Route::get('/registered', [
			'middleware' => [],
			'uses' => 'UserController@getRegistered',
		]);

		Route::post('/set-device', [
			'middleware' => [
				'signature',
				'jwt',
			],
			'uses' => 'UserController@setDevice',
		]);

		Route::post('/send-notification-for-all', [
			'middleware' => [],
			'uses' => 'UserController@sendNotificationForAll',
		]);

		

		// Servicio de prueba push
		Route::post('/push', [
			'middleware' => [],
			'uses' => 'UserController@push',
		]);



		//user services Loads App

		Route::post('/send-push-notification-for-all', [
			'middleware' => [],
			'uses' => 'UserController@sendPushNotificationForAll',
		]);


		Route::post('/createUser', [
			'middleware' => [],
			'uses' => 'UserController@createUserWithRol',
		]);

		Route::post('/UpdateUser', [
			'middleware' => [],
			'uses' => 'UserController@UpdateUserWithRol',
		]);

		Route::post('/voteForUsers', [
			'middleware' => [],
			'uses' => 'UserController@voteForUsers',
		]);

		Route::post('/setMyDevice', [
			'middleware' => [],
			'uses' => 'UserController@setMyDevice',
		]);

		Route::post('/ClearMyDevice', [
			'middleware' => [],
			'uses' => 'UserController@ClearMyDevice',
		]);

		Route::post('/setMyPicImg', [
			'middleware' => [],
			'uses' => 'UserController@setMyPicImg',
		]);

		Route::post('/send-push-notification-for-one-user', [
			'middleware' => [],
			'uses' => 'UserController@sendPushNotificationForOneUser',
		]);


		/*Config setting mensajes*/
		Route::post('/user-settings-message', [
			'middleware' => [],
			'uses' => 'UserController@userSettingsMessage',
		]);
		
	});


	//
	// Title
	// -------------------------
	// Other routes here

	Route::group(['prefix' => 'loads'], function(){
		/*
			servicio que devuelve
		*/
		Route::post('/getPriceLoads', [
			'middleware' => [],
			'uses' => 'LoadsController@getPriceLoads',
		]);
		
		/*
			Servicio que devuelve lista de tipos de carga, load size, load Length, Load Frecuency, Truck Type, Truck Availability
			Trucks Skills
		*/
		/*
			servicio que devuelve
		*/
		Route::post('/getItemsSizeLengthLoads', [
			'middleware' => [],
			'uses' => 'LoadsController@getAllItemsList',
		]);
		
		/*
			Servicio que devuelve lista de tipos de carga, load size, load Length, Load Frecuency, Truck Type, Truck Availability
			Trucks Skills
		*/

		Route::post('/getTotalItems', [
			'middleware' => [],
			'uses' => 'LoadsController@countAllLoads',
		]);

		/*
			Servicio que realiza busqueda de filtro avanzado, retorna las cargas y los truck dependiendo del perfil
		*/

		Route::post('/searchLoads', [
			'middleware' => [],
			'uses' => 'LoadsController@searchLoads',
		]);


		/*
			Servicio que realiza busqueda de filtro avanzado, retorna las cargas y los truck dependiendo del perfil
		*/

		Route::post('/searchLoadsWeb', [
			'middleware' => [],
			'uses' => 'LoadsController@searchLoadsWebComercial',
		]);


		/*
			Detalle de una carga
		*/

		Route::post('/loadDetails', [
			'middleware' => [],
			'uses' => 'LoadsController@getLoadDetails',
		]);


		/*
			Cancelar una carga por X motivo
		*/

		Route::post('/cancelLoad', [
			'middleware' => [],
			'uses' => 'LoadsController@setCancelLoad',
		]);

		/*
			Cambiar el status de una carga por X motivo
		*/

		Route::post('/loadChangueStatus', [
			'middleware' => [],
			'uses' => 'LoadsController@setStatuslLoad',
		]);

		/*
			Ver la documentacion de una carga
		*/

		Route::post('/viewDocumentsLoad', [
			'middleware' => [],
			'uses' => 'LoadsController@viewDocumentsLoad',
		]);

		/*
			Calcula la distancia entre 2 puntos
		*/

		Route::post('/distanceBetweenLoadMyPoint', [
			'middleware' => [],
			'uses' => 'LoadsController@distanceBetweenLoadandUser',
		]);

		/*
			Obtener las cargas dependiendo del rol que consuma el servicio
		*/

		Route::post('/getLoadsforUserRol', [
			'middleware' => [],
			'uses' => 'LoadsController@getLoadsforUserRol',
		]);

		/*
			Obtener las cargas de historial dependiendo del usuario
		*/

		Route::post('/getLoadsHistoryforUserRol', [
			'middleware' => [],
			'uses' => 'LoadsController@getLoadsHistoryforUserRol',
		]);

		/*
			subir documento de invoice
		*/

		Route::post('/uploadInvoiceToLoad', [
			'middleware' => [],
			'uses' => 'LoadsController@uploadInvoiceToLoad',
		]);

		/*
			Publicar una carga por el generador
		*/

		Route::post('/loadPostByLoadGenerator', [
			'middleware' => [],
			'uses' => 'LoadsController@loadPostByLoadGenerator',
		]);

		/*
			Actualizar una carga por el generador
		*/

		Route::post('/loadupdateByLoadGenerator', [
			'middleware' => [],
			'uses' => 'LoadsController@loadupdateByLoadGenerator',
		]);

		/*
			Publicar una carga por el generador
		*/

		Route::post('/loadTypesSizesAndLengthLists', [
			'middleware' => [],
			'uses' => 'LoadsController@loadTypesSizesAndLengthLists',
		]);

		/*
			Servicio que cmabiar el estado de automatic load
		*/

		Route::post('/setAutomaticLoad', [
			'middleware' => [],
			'uses' => 'LoadsController@setMyAutomaticLoad',
		]);


		/*
			Servicio que trae los request de una carga
		*/

		Route::post('/getRequestCarrierLoads', [
			'middleware' => [],
			'uses' => 'LoadsController@getRequestCarrierLoads',
		]);


	    /*
			Servicio que acepta una request de una carga
		*/

		Route::post('/setRequestCarrierLoads', [
			'middleware' => [],
			'uses' => 'LoadsController@setRequestCarrierLoads',
		]);


		/*
			Servicio que crea  una request de una carga
		*/

		Route::post('/CreateRequestCarrierLoads', [
			'middleware' => [],
			'uses' => 'LoadsController@CreateRequestCarrierLoads',
		]);

		/*
			Servicio que cancela un request de un carrier
		*/

		Route::post('/CanceldRequestCarrierLoads', [
			'middleware' => [],
			'uses' => 'LoadsController@CanceldRequestCarrierLoads',
		]);



		/*
			Servicio que trae las cargas con factoring  aprobado
		*/

		Route::post('/getCarrierFactoringLoads', [
			'middleware' => [],
			'uses' => 'LoadsController@getCarrierFactoringLoads',
		]);


		/*
			Servicio que trae las cargas con factoring  aprobado
		*/

		Route::post('/ReportLoadIssues', [
			'middleware' => [],
			'uses' => 'LoadsController@ReportLoadIssues',
		]);


		/*
			Servicio que trae las cargas de un driver y las organiza por fecha y distancia
		*/

		Route::post('/LoadRoutePlanner', [
			'middleware' => [],
			'uses' => 'LoadsController@LoadRoutePlanner',
		]);


		/*
			Servicio que trae la consulta de todas las cargas posteadas,
		*/

		Route::post('/LoadsByProfile', [
			'middleware' => [],
			'uses' => 'LoadsController@LoadsByProfile',
		]);


		/*
			Servicio para testing
		*/

		Route::post('/LoadsByExample', [
			'middleware' => [],
			'uses' => 'LoadsController@LoadsByExample',
		]);
		
		
	});
	
	/*
	Servicio de busqueda cercana
	*/

	Route::post('/searchForLocation', [
		'middleware' => [],
		'uses' => 'LoadsController@searchForLocation',
	]);


	Route::post('/getreasoncancel', [
		'middleware' => [],
		'uses' => 'LoadsController@getreasoncancel',
	]);
	

	Route::group(['prefix' => 'trucks'], function(){
		
		/*
		Servicio que trae los truck X un carrier
		*/

		Route::post('/trucksForCarrier', [
			'middleware' => [],
			'uses' => 'TrucksController@trucksxCarrier',
		]);




		/*
		Servicio que trae los truck X un carrier
		*/

		Route::post('/getTruckTypes', [
			'middleware' => [],
			'uses' => 'TrucksController@getTruckTypes',
		]);

		/*
		Servicio que crea un truck 
		*/

		Route::post('/createTruck', [
			'middleware' => [],
			'uses' => 'TrucksController@createTruck',
		]);
		
		/*Servicio para modificar un truck*/

		Route::post('/UpdateTruck', [
			'middleware' => [],
			'uses' => 'TrucksController@UpdateTruck',
		]);


		/*
		Servicio que cuanta los truck X un carrier
		*/
		Route::post('/CountTruckxCarrier', [
			'middleware' => [],
			'uses' => 'TrucksController@CountTruckxCarrier',
		]);

		/*
		Servicio que trae el detalle de un  truck 
		*/
		Route::post('/DetailTruck', [
			'middleware' => [],
			'uses' => 'TrucksController@DetailTruck',
		]);

		/*Servicio que trae los puntos de interes*/

			Route::post('/PointsOfInterest', [
			'middleware' => [],
			'uses' => 'TrucksController@PointsOfInterest',
		]);

	});

	Route::group(['prefix' => 'carrier'], function(){
		
		/*
		Servicio que acepta un requet de un carrier por un generador
		*/
		Route::post('/sendAcceptLoadRequest', [
			'middleware' => [],
			'uses' => 'CarrierController@sendAcceptLoadRequest',
		]);

		

		Route::post('/getLoadGeneratorCompanies', [
			'middleware' => [],
			'uses' => 'CarrierController@getLoadGeneratorCompanies',
		]);

		/*
		Servicio que asigna un truck a un driver
		*/

		Route::post('/assignTruckandDrivertoLoad', [
			'middleware' => [],
			'uses' => 'CarrierController@assignTruckandDrivertoLoad',
		]);
		/*
		Servicio que aplica a factoring
		*/
		Route::post('/applyToFactoring', [
			'middleware' => [],
			'uses' => 'CarrierController@applyToFactoring',
		]);

		/*
		Servicio que lista los drivers de un carrier
		*/
		Route::post('/DriverxCarrier', [
			'middleware' => [],
			'uses' => 'CarrierController@DriverxCarrier',
		]);


		/*
		Servicio que lista los drivers de un carrier
		*/
		Route::post('/DriverxCarrierxStatus', [
			'middleware' => [],
			'uses' => 'CarrierController@DriverxCarrierxStatus',
		]);



		/*
		Servicio que trae la informacion de un carrier
		*/

		Route::post('/CarrierInformation', [
			'middleware' => [],
			'uses' => 'CarrierController@CarrierInformation',
		]);

	});


	Route::group(['prefix' => 'shipper'], function(){
		/*
		Servicio que bisca un carrier
		*/
		Route::post('/searchCarrier', [
			'middleware' => [],
			'uses' => 'CarrierController@searchCarrier',
		]);

	});	

	Route::group(['prefix' => 'driver'], function(){
		/*
		Servicio que actualiza lña posición d eu driver
		*/

		Route::post('/updateMyLocation', [
			'middleware' => [],
			'uses' => 'DriverController@updateMyLocation',
		]);

		/*
		Servicio que actualiza lña posición d eu driver
		*/

		Route::post('/CreateDriverProfile', [
			'middleware' => [],
			'uses' => 'UserController@createUserWithRol',
		]);

		/*
		Servicio para ver la información del driver X carrier
		*/

		Route::post('/CarrierXDriverInformation', [
			'middleware' => [],
			'uses' => 'CarrierController@CarrierXDriverInformation',
		]);

		/*
		Servicio para modificar información del driver X carrier
		*/

		Route::post('/CarrierXDriverInformationUpdate', [
			'middleware' => [],
			'uses' => 'CarrierController@CarrierXDriverInformationUpdate',
		]);

	});
		
		Route::group(['prefix' => 'notification'], function(){
		
		/*
		- Lista las notificaiones de unusaurio.
		*/	
			Route::post('/userNotificationList', [
			'middleware' => [],
			'uses' => 'NotificationController@userNotificationList',
			]);

		/*
		- Cambia el estado de las notificaiones a leidas.
		*/
		Route::post('/makeAsReadNotifications', [
			'middleware' => [],
			'uses' => 'NotificationController@makeAsReadNotifications',
		]);

		/*
		- Cambia el estado de las notificaiones a leidas.
		*/
		Route::post('/makeAsReadNotificationsById', [
			'middleware' => [],
			'uses' => 'NotificationController@makeAsReadNotificationsById',
		]);

		/*
		- Cuenta el numero de notificaiones que tien un usuario
		*/
		Route::post('/getNewNotificationsCount', [
			'middleware' => [],
			'uses' => 'NotificationController@getNewNotificationsCount',
		]);
	});

		/*
		- Servicios de posteverywhere
		*/

		Route::group(['prefix' => 'posteverywhere'], function(){
		/*
		- Crea una cuenta de usuario
		*/

		Route::post('/createAccount', [
			'middleware' => [],
			'uses' => 'PostEverywhereController@createAccount',
		]);

		/*
		- Verifica una cuenta de usuario
		*/
		Route::post('/verifyAccount', [
			'middleware' => [],
			'uses' => 'PostEverywhereController@verifyAccount',
		]);

		/*
		- Modifca una carga
		*/
		Route::post('/updateAccount', [
			'middleware' => [],
			'uses' => 'PostEverywhereController@updateAccount',
		]);

		/*
		- Crea una carga.
		*/
		Route::post('/loads', [
			'middleware' => [],
			'uses' => 'PostEverywhereController@createLoad',
		]);

		/*
		- Canela una carga por un motivo dado
		*/
		Route::post('/cancelLoads', [
			'middleware' => [],
			'uses' => 'PostEverywhereController@cancelLoads',
		]);
	});

});

Route::group(['prefix' => 'admin/v1'], function(){

});