<?php
require 'vendor/autoload.php';
require 'dbaccess.php';
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\App;

$app = new App();
$container = $app -> getContainer();
$container['db'] = function($c) {
	$db = new DBAcess();
	return $db;
};
/**
 * POST /login
 * @param username the username to login
 * @param passwordLogin the decrypted password to login
 * @return 200 OK and the user JSON object if logged in successfully or 401 username password combination doesn't match
 */
$app -> post('/login', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$username = filter_var($data['username'], FILTER_SANITIZE_STRING);
	$password = filter_var($data['password'], FILTER_SANITIZE_STRING);
	$value = $this -> db -> login($username, $password);
	if ($value === false) {
		$response = $response -> withStatus(401, "wrong username password combination");
		return $response;
	}
	$response -> withJson($value);
	return $response;
});

/**
 * POST /register
 * @param firstname the first name of the user
 * @param lastname the last name of the user
 * @param mail the email adress of the user
 * @param password the password of the user
 * @param ort the location of the user
 * @return 200 OK and the JSON user object if created sucessfully, otherwise 400
 */
$app -> post('/register', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$name = filter_var($data['lastname'], FILTER_SANITIZE_STRING);
	$prename = filter_var($data['firstname'], FILTER_SANITIZE_STRING);
	$mail = filter_var($data['mail'], FILTER_SANITIZE_EMAIL);
	$password = filter_var($data['password'], FILTER_SANITIZE_STRING);
	$place = filter_var($data['ort'], FILTER_SANITIZE_STRING);

	//$name, $prename, $mail, $password, $place
	//$value = $this->db->register($name, $prename, $mail, $password, $place);
	$value = $this -> db -> register($name, $prename, $mail, $password, $place);

	if ($value === false) {
		$response = $response -> withStatus(400, "username already exists");
		return $response;
	}
	$response -> withJson($value);
	return $response;
});

/**
 * GET /anfrage
 * @param userId (optional) filter to get all anfrage with this userid
 * @param isopen (optional) filter to get all anfrage that are closed or open
 * @param excludeUserId (optioal) filter to get all anfrage that don't have this userId
 * @return all anfragen that match the filters as JSON objects and are after todays date
 */
$app -> get('/anfrage', function(Request $request, Response $response) {
	$data = $request -> getQueryParams();
	$userId =null;
	$isopen = null;
	$excludeUserId = null;
	if (isset($data['userId'])) {
		$userId = filter_var($data['userId'], FILTER_SANITIZE_NUMBER_INT);
	}
	if (isset($data['isopen'])) {
		$isopen = filter_var($data['isopen'], FILTER_VALIDATE_BOOLEAN);
	}
	if (isset($data['excludeUserId'])) {
		$excludeUserId = filter_var($data['excludeUserId'], FILTER_SANITIZE_NUMBER_INT);
	}
	$returnData = $this -> db -> getAnfragen($userId, $isopen, $excludeUserId);
	$response -> withJson($returnData);
	return $response;
});

/**
 * POST /anfrage
 * @param date the date the anfrage is
 * @param time the time the anfrage is
 * @param location the location the anfrage is
 * @param freizeit if it is an freizeit anfrage
 * @param training if it is an training anfrage
 * @param wettkampf if it is an wettkampf anfrage
 * @param sportart which sport the anfrage is about
 * @param comment (optional) comment about the anfrage
 * @param userId the userid that created this anfrage
 * @return 200 OK and the newly created anfrage if successfully, otherwise 400
 *
 */
$app -> post('/anfrage', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$date = filter_var($data['date'], FILTER_SANITIZE_STRING);
	$time = filter_var($data['time'], FILTER_SANITIZE_STRING);
	$location = filter_var($data['location'], FILTER_SANITIZE_STRING);
	$freizeit = filter_var($data['freizeit'], FILTER_SANITIZE_STRING);
	$training = filter_var($data['training'], FILTER_SANITIZE_STRING);
	$wettkampf = filter_var($data['wettkampf'], FILTER_SANITIZE_STRING);
	$sportart = filter_var($data['sportart'], FILTER_SANITIZE_STRING);
	$comment = filter_var($data['comment'], FILTER_SANITIZE_STRING);
	$userId = filter_var($data['userId'], FILTER_SANITIZE_STRING);
	$datetime = $date . ' ' . $time;
	$anfrage = $this -> db -> createAnfrage($freizeit, $training, $wettkampf, $userId, $sportart, $location, $datetime, $comment);
	$response -> withJson($anfrage);
	return $response;
});

/**
 * GET /zusage
 * @param anfrageId a filter for the zusagen
 * @return all zusage that match the anfrageId
 */
$app -> get('/zusage', function(Request $request, Response $response) {
	$data = $request -> getQueryParams();
	$anfrageId = filter_var($data['anfrageId'], FILTER_SANITIZE_STRING);
	$returnData = $this -> db -> getZusagen($anfrageId);
	$response -> withJson($returnData);
	return $response;
});

/**
 * POST /zusage
 * @param userId the user that is creating this zusage
 * @param anfrageId the anfrage this zusage is about
 * @param comment (optional) an optional comment
 * @param telNr the telephone number of the user
 * @return 200 OK and the newly created zusage as JSON object
 */
$app -> post('/zusage', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$userId = filter_var($data['userId'], FILTER_SANITIZE_STRING);
	$anfrageId = filter_var($data['anfrageId'], FILTER_SANITIZE_STRING);
	$comment = filter_var($data['comment'], FILTER_SANITIZE_STRING);
	$telNr = filter_var($data['telNr'], FILTER_SANITIZE_STRING);

	$returnData = $this -> db -> createZusage($anfrageId, $userId, $telNr, $comment);
	$response -> withJson($returnData);
	return $response;
});

/**
 * GET /zusage2
 * @param anfrageId a filter for the zusagen2
 * @return all zusage2 that match the anfrageId
 */
$app -> get('/zusage2', function(Request $request, Response $response) {
	$data = $request -> getQueryParams();
	$anfrageId = filter_var($data['anfrageId'], FILTER_SANITIZE_STRING);

	$responseData = $this -> db -> getZusagen2($anfrageId);

	$response -> withJson($returnData);
	return $response;
});

/**
 * POST /zusage2
 * creates a new zusage2 and sets the isOpen status of the anfrage to false
 * @param userId the user that is creating this zusage2
 * @param anfrageId the anfrage this zusage2 is about
 * @param comment (optional) an optional comment
 * @param telNr the telephone user this is about
 * @return 200 OK and the nwely created zusage2
 */
$app -> post('/zusage2', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$userId = filter_var($data['userId'], FILTER_SANITIZE_STRING);
	$anfrageId = filter_var($data['anfrageId'], FILTER_SANITIZE_STRING);
	$comment = filter_var($data['comment'], FILTER_SANITIZE_STRING);
	$telNr = filter_var($data['telNr'], FILTER_SANITIZE_STRING);

	$returnData = $this -> db -> createZusagetoZusage($anfrageId, $userId, $telNr, $comment);

	$response -> withJson($returnData);
	return $response;
});

/**
 * GET /user
 * @param anfrageid a filter for the user
 * @return the user matching this anfrage as JSON object
 */
$app -> get('/user', function(Request $request, Response $response) {
	$data = $request -> getQueryParams();
	$anfrageId = filter_var($data['anfrageId'], FILTER_SANITIZE_STRING);

	$responseData = $this -> db -> getUserByAnfrageId($anfrageId);

	$response -> withJson($responseData);
	return $response;
});
$app -> run();