<?php
class DBAcess {
	private $dsn = 'mysql:dbname=sportlink;host=127.0.0.1';
	private $dbuser = 'root';
	private $dbpassword = '';
	private $pdo;

	private $getUserByEmail;

	private $createUser;
	private $getUserById;

	private $createAnfrage;
	private $getAnfrageById;

	private $createZusage;
	private $getZusageById;
	private $getZusageByUserId;

	private $createZusage2;
	private $getZusage2ById;
	private $setAnfrageToDoneById;

	private $getAllZusagenByAnfrageId;
	private $getAllZusagen2ByAnfrageId;

	function __construct() {
		try {
			$this -> pdo = new PDO($this -> dsn, $this -> dbuser, $this -> dbpassword);
			//prepared statements
			$this -> getUserByEmail = $this -> pdo -> prepare("SELECT *  FROM `person` WHERE `mail`=?");

			$this -> createUser = $this -> pdo -> prepare("INSERT INTO `person`(`name`, `vorname`, `mail`, `password`, `ort`) VALUES (?,?,?,?,?)");
			$this -> getUserById = $this -> pdo -> prepare("SELECT *  FROM `person` WHERE `id`=?");

			$this -> createAnfrage = $this -> pdo -> prepare("INSERT INTO `anfrage`(`freizeit`, `training`, `wettkampf`, `personId`, `sportart`, `location`, `date`, `comment`, `isopen`) VALUES (?,?,?,?,?,?,?,?,?)");
			$this -> getAnfrageById = $this -> pdo -> prepare("SELECT * FROM `anfrage` WHERE id=?");

			$this -> createZusage = $this -> pdo -> prepare("INSERT INTO `zusage1`(`anfrageId`, `personid`, `telnr`, `comment`) VALUES (?,?,?,?)");
			$this -> getZusageById = $this -> pdo -> prepare("SELECT * FROM `zusage1` WHERE `id` = ?");
			$this -> getZusageByUserId = $this -> pdo -> prepare("SELECT * FROM `zusage1` WHERE `personid` = ?");

			$this -> createZusage2 = $this -> pdo -> prepare("INSERT INTO `zusage2`(`anfrageId`, `zusage1id`, `telnr`, `comment`) VALUES (?,?,?,?)");
			$this -> getZusage2ById = $this -> pdo -> prepare("SELECT * FROM `zusage2` WHERE `id` = ?");
			$this -> setAnfrageToDoneById = $this -> pdo -> prepare("UPDATE `anfrage` SET `isopen`=0 WHERE `id` = ?");

			$this -> getAllZusagenByAnfrageId = $this -> pdo -> prepare("SELECT * FROM `zusage1` WHERE `anfrageId` = ?");

			$this -> getAllZusagen2ByAnfrageId = $this -> pdo -> prepare("SELECT * FROM `zusage2` WHERE `anfrageId` = ?");

		} catch (PDOException $e) {
			echo 'Connection failed: ' . $e -> getMessage();
		}
	}

	/**
	 * login fucntion checks the username and password against the database and returns true if it is correct
	 */
	function login($username, $password) {
		$exec = $this -> getUserByEmail -> execute(array($username));
		$dbUser = $this -> getUserByEmail -> fetch(PDO::FETCH_ASSOC);

		if ($dbUser !== false && $password === $dbUser['password']) {
			unset($dbUser['password']);
			return $dbUser;
		}

		return false;
	}

	/**
	 * adds a new person to the databse
	 */
	function register($name, $prename, $mail, $password, $place) {
		$exec = $this -> getUserByEmail -> execute(array($mail));
		$exists = $this -> getUserByEmail -> fetch(PDO::FETCH_ASSOC);
		if ($exists === false) {
			$this -> createUser -> execute(array($name, $prename, $mail, $password, $place));
			$this -> getUserById -> execute(array($this -> pdo -> lastInsertId()));
			$dbUser = $this -> getUserById -> fetch(PDO::FETCH_ASSOC);
			unset($dbUser['password']);
			return $dbUser;
		} else {
			return false;
		}
	}

	/**
	 * returns a user object by its id
	 */
	function getUserById($id) {
		$this -> getUserById -> execute(array($id));
		$dbUser = $this -> getUserById -> fetch(PDO::FETCH_ASSOC);
		unset($dbUser['password']);
		return $dbUser;
	}

	/**
	 * gets a anfrage by its filters
	 */
	function getAnfragen($userId, $isopen, $excludeUserId, $anfrageId, $freizeit, $training, $wettkampf, $sportart) {
		$sql = "SELECT * FROM `anfrage` WHERE `date` > NOW()";
		if (isset($anfrageId)) {
			$sql .= " AND id = :id";
		}
		if (isset($userId)) {
			$sql .= " AND personId = :personId";
		}
		if (isset($isopen)) {
			$sql .= " AND isopen = :isOpen";
		}
		if (isset($excludeUserId)) {
			$sql .= " AND personId <> :excludeUserId";
		}
		if (isset($freizeit) && $freizeit) {
			$sql .= " AND freizeit = :freizeit";
		}
		if (isset($training) && $training) {
			$sql .= " AND training= :training";
		}
		if (isset($wettkampf) && $wettkampf) {
			$sql .= " AND wettkampf = :wettkampf";
		}
		if (isset($sportart) && $sportart != "Sportart wählen") {
			$sql .= " AND sportart = :sportart";
		}
		$statement = $this -> pdo -> prepare($sql);
		if (isset($anfrageId)) {
			$statement -> bindParam(":id", $anfrageId);
		}
		if (isset($userId)) {
			$statement -> bindParam(":personId", $userId);
		}
		if (isset($isopen)) {
			$statement -> bindParam(":isOpen", $isopen);
		}
		if (isset($excludeUserId)) {
			$statement -> bindParam(":excludeUserId", $excludeUserId);
		}
		if (isset($freizeit) && $freizeit) {
			$statement -> bindParam(":freizeit", $freizeit);
		}
		if (isset($training) && $training) {
			$statement -> bindParam(":training", $training);
		}
		if (isset($wettkampf) && $wettkampf) {
			$statement -> bindParam(":wettkampf", $wettkampf);
		}
		if (isset($sportart) && $sportart != "Sportart wählen") {
			$statement -> bindParam(":sportart", $sportart);
		}

		$exec = $statement -> execute();
		return $statement -> fetchAll(PDO::FETCH_ASSOC);
	}

	/**
	 * adds a new anfrage to the database
	 */
	function createAnfrage($freizeit, $training, $wettkampf, $personId, $sportart, $location, $date, $comment) {
		$exec = $this -> createAnfrage -> execute(array($freizeit, $training, $wettkampf, $personId, $sportart, $location, $date, $comment, 1));
		if ($exec) {
			$this -> getAnfrageById -> execute(array($this -> pdo -> lastInsertId()));
			return $this -> getAnfrageById -> fetchAll(PDO::FETCH_ASSOC);
		}
	}

	/**
	 * adds a new zusage to the database
	 */
	function createZusage($anfrageId, $personId, $telNr, $comment = "") {
		$this -> createZusage -> execute(array($anfrageId, $personId, $telNr, $comment));
		$this -> getZusageById -> execute(array($this -> pdo -> lastInsertId()));
		return $this -> getZusageById -> fetch(PDO::FETCH_ASSOC);
	}

	/**
	 * gets a zusage from the database by the filters
	 */
	function getZusagen($anfrageId, $done) {
		if ($done) {
			$this -> getAllZusagen2ByAnfrageId -> execute(array($anfrageId));
			$zusage2 = $this -> getAllZusagen2ByAnfrageId -> fetch(PDO::FETCH_ASSOC);
			$this -> getZusageById -> execute(array($zusage2['zusage1id']));
			return $this -> getZusageById -> fetch(PDO::FETCH_ASSOC);
		} else {
			$this -> getAllZusagenByAnfrageId -> execute(array($anfrageId));
			return $this -> getAllZusagenByAnfrageId -> fetchAll(PDO::FETCH_ASSOC);
		}
	}

	/**
	 * gets a zusage from the database by the filters
	 */
	function getZusagenByUserId($userId, $done) {
		$this -> getZusageByUserId -> execute(array($userId));
		$returnData = $this -> getZusageByUserId -> fetchAll(PDO::FETCH_ASSOC);
		if ($done) {
			foreach ($returnData as $key => $value) {
				$zusage2 = $this -> getZusagen2($value['anfrageId']);
				if (!isset($zusage2) || $zusage2['zusage1id'] != $value['id']) {
					unset($returnData[$key]);
				}
			}
		}
		$returnData = array_values($returnData);
		return $returnData;
	}

	/**
	 * adds a zusage 2 to the databse
	 */
	function createZusagetoZusage($anfrageId, $zusageId, $telNr, $comment = "") {
		$this -> createZusage2 -> execute(array($anfrageId, $zusageId, $telNr, $comment));
		$lastId = $this -> pdo -> lastInsertId();

		$this -> setAnfrageToDoneById -> execute(array($anfrageId));

		$this -> getZusage2ById -> execute(array($lastId));
		return $this -> getZusage2ById -> fetch(PDO::FETCH_ASSOC);
	}

	/**
	 * gets a zusage 2 from the database
	 */
	function getZusagen2($anfrageId) {
		$this -> getAllZusagen2ByAnfrageId -> execute(array($anfrageId));
		$userId = $this -> getUserByAnfrageId($anfrageId);
		$returnArray = $this -> getAllZusagen2ByAnfrageId -> fetch(PDO::FETCH_ASSOC);
		if ($returnArray !== false) {
			$returnArray['personId'] = $userId['id'];
		}
		return $returnArray;
	}

	/**
	 * gets a user by a anfrage id from the database
	 */
	function getUserByAnfrageId($anfrageId) {
		$this -> getAnfrageById -> execute(array($anfrageId));
		$anfrage = $this -> getAnfrageById -> fetch(PDO::FETCH_ASSOC);
		$userID = $anfrage['personId'];
		$this -> getUserById -> execute(array($userID));
		$user = $this -> getUserById -> fetch(PDO::FETCH_ASSOC);

		return $user;
	}

	/**
	 * returns the distance between 2 addresses standard unit is kilometres
	 *
	 * source: http://www.codexworld.com/distance-between-two-addresses-google-maps-api-php/
	 * Author: CodexWorld
	 * Function Name: getDistance()
	 * $addressFrom => From address.
	 * $addressTo => To address.
	 * $unit => Unit type.
	 *
	 **/
	function getDistance($addressFrom, $addressTo, $unit = 'K') {
		//Change address format
		$formattedAddrFrom = str_replace(' ', '+', $addressFrom);
		$formattedAddrTo = str_replace(' ', '+', $addressTo);

		//Send request and receive json data
		$geocodeFrom = file_get_contents('http://maps.google.com/maps/api/geocode/json?address=' . $formattedAddrFrom . '&sensor=false');
		$outputFrom = json_decode($geocodeFrom);
		$geocodeTo = file_get_contents('http://maps.google.com/maps/api/geocode/json?address=' . $formattedAddrTo . '&sensor=false');
		$outputTo = json_decode($geocodeTo);

		//Get latitude and longitude from geo data
		$latitudeFrom = $outputFrom -> results[0] -> geometry -> location -> lat;
		$longitudeFrom = $outputFrom -> results[0] -> geometry -> location -> lng;
		$latitudeTo = $outputTo -> results[0] -> geometry -> location -> lat;
		$longitudeTo = $outputTo -> results[0] -> geometry -> location -> lng;

		//Calculate distance from latitude and longitude
		$theta = $longitudeFrom - $longitudeTo;
		$dist = sin(deg2rad($latitudeFrom)) * sin(deg2rad($latitudeTo)) + cos(deg2rad($latitudeFrom)) * cos(deg2rad($latitudeTo)) * cos(deg2rad($theta));
		$dist = acos($dist);
		$dist = rad2deg($dist);
		$miles = $dist * 60 * 1.1515;
		$unit = strtoupper($unit);
		if ($unit == "K") {
			return ($miles * 1.609344);
		} else if ($unit == "N") {
			return ($miles * 0.8684);
		} else {
			return $miles;
		}
	}

}
