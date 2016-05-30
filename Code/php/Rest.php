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
 * POST	Username(String)Password(String)
 * Gleicht die Daten mit der Datenbank ab.
 * On Success 200 OK and UserId
 * On Fail 401
 *
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
 * POST	Username(String) Password(String)
 * Erstellt diesen Benutzer
 * On Success 200 OK
 * On Fail 400 mit Error was falsch ist
 *
 */
$app -> post('/register', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$name = filter_var($data['name'], FILTER_SANITIZE_STRING);
	$prename = filter_var($data['prename'], FILTER_SANITIZE_STRING);
	$mail = filter_var($data['mail'], FILTER_SANITIZE_STRING);
	$password = filter_var($data['password'], FILTER_SANITIZE_STRING);
	$place = filter_var($data['place'], FILTER_SANITIZE_STRING);

	//$name, $prename, $mail, $password, $place
	//$value = $this->db->register($name, $prename, $mail, $password, $place);
	$value = $this -> db -> register("karl", "karl", "karl@gmail.com", "b", "there");

	if ($value === false) {
		$response = $response -> withStatus(400, "username already exists");
		return $response;
	}
	$response -> withJson($value);
	return $response;
});
/**
 * GET
 * Gibt Alle Anfragen zurück
 * 200 OK
 *
 * GET	UserId(int)
 * Gibt Alle Anfragen eines Nutzers zurück
 * 200 OK
 */
$app -> get('/anfrage', function(Request $request, Response $response) {
	$data = $request -> getQueryParams();
	$returnData;
	if (isset($data['userId'])) {
		$returnData = $this -> db -> getUserAnfrage($data['userId']);
		var_dump($returnData);
	} else {
		$returnData = $this -> db -> getAllAnfragen();
	}
	$response -> withJson($returnData);
	return $response;
});

/**
 * PUT	UserId(int)Date(Date)Type(String)Sport (String)
 * Erstellt eine Anfrage
 * 200 OK
 * 400
 *
 */
$app -> put('/anfrage', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$freizeit = filter_var($data['freizeit'], FILTER_SANITIZE_STRING);
	$training = filter_var($data['training'], FILTER_SANITIZE_STRING);
	$wettkampf = filter_var($data['wettkampf'], FILTER_SANITIZE_STRING);
	$personId = filter_var($data['personId'], FILTER_SANITIZE_STRING);
	$sportart = filter_var($data['sportart'], FILTER_SANITIZE_STRING);
	$location = filter_var($data['location'], FILTER_SANITIZE_STRING);
	$date = filter_var($data['date'], FILTER_SANITIZE_STRING);
	$comment = filter_var($data['comment'], FILTER_SANITIZE_STRING);

	$anfrage = $this -> db -> createAnfrage($freizeit, $training, $wettkampf, $personId, $sportart, $location, $date, $comment);
	$response -> withJson($anfrage);
	return $response;
});

/**
 * POST	UserId(int) TelNr(String)
 * Zusage zur Anfrage erstellen
 * 200 OK
 * 400
 *
 */
$app -> post('/anfrage/{id}', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$anfrageId = filter_var($data['anfrageId'], FILTER_SANITIZE_STRING);
	$personId = filter_var($data['personId'], FILTER_SANITIZE_STRING);
	$telNr = filter_var($data['telNr'], FILTER_SANITIZE_STRING);
	$comment = filter_var($data['comment'], FILTER_SANITIZE_STRING);
	$zusage = $this -> db -> createZusage($anfrageId, $personId, $telNr, $comment = "");
	$response -> withJson($zusage);
	return $response;
});
/**
 * GET	UserId(int)
 * Gibt Alle fertigen Anfragen für diesen Nutzer zurück
 * 200 OK
 */
$app -> get('/anfrage/done', function(Request $request, Response $response) {
	$data = $request -> getQueryParams();
	$anfragen = $this -> db -> getDoneAnfragen($data['userId']);
	$response -> withJson($anfragen);
	return $response;
});

/**
 * GET
 * Gibt Alle Zusagen für diese Anfrage zurück
 * 200 OK
 */
$app -> get('/anfrage/{id}/zusagen', function(Request $request, Response $response, $id) {
	$zusagen = $this -> db -> getAllZusagen($id);
	$response -> withJson($zusagen);
	return $response;
});

/**
 * POST	TelNr(String)
 * Zusage zur Zusage erstellen
 * 200 OK
 * 400
 *
 */
$app -> post('/zusagen/{id}', function(Request $request, Response $response) {
	$data = $request -> getParsedBody();
	$zusageId = filter_var($data['zusageId'], FILTER_SANITIZE_STRING);
	$telnr = filter_var($data['telnr'], FILTER_SANITIZE_STRING);
	$comment = filter_var($data['comment'], FILTER_SANITIZE_STRING);
	
	$zusage2 = $this->db->createZusagetoZusage($zusageId, $telnr, $comment = ""); 
	
	$response -> withJson($zusage2);
	return $response;
});

$app -> run();
