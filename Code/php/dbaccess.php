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

			$this -> createZusage2 = $this -> pdo -> prepare("INSERT INTO `zusage2`(`zusage1id`, `telnr`, `comment`) VALUES (?,?,?)");
			$this -> getZusage2ById = $this -> pdo -> prepare("SELECT * FROM `zusage2` WHERE `id` = ?");
			$this -> setAnfrageToDoneById = $this -> pdo -> prepare("UPDATE `anfrage` SET `isopen`=1 WHERE `id` = ?");

			$this -> getAllZusagenByAnfrageId = $this -> pdo -> prepare("SELECT * FROM `zusage1` WHERE `anfrageId` = ?");

			$this -> getAllZusagen2ByAnfrageId = $this -> pdo -> prepare("SELECT * FROM `zusage2` WHERE `anfrageId` = ?");

		} catch (PDOException $e) {
			echo 'Connection failed: ' . $e -> getMessage();
		}
	}

	function login($username, $password) {
		$exec = $this -> getUserByEmail -> execute(array($username));
		$dbUser = $this -> getUserByEmail -> fetch(PDO::FETCH_ASSOC);

		if ($dbUser !== false && $password === $dbUser['password']) {
			unset($dbUser['password']);
			return $dbUser;
		}

		return false;
	}

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

	function getUserById($id) {
		$this -> getUserById -> execute(array($id));
		$dbUser = $this -> getUserById -> fetch(PDO::FETCH_ASSOC);
		unset($dbUser['password']);
		return $dbUser;
	}

	function getAnfragen($userId, $isopen, $excludeUserId, $freizeit, $training, $wettkampf, $sportart) {
		$sql = "SELECT * FROM `anfrage` WHERE `date` > NOW()";
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

	function createAnfrage($freizeit, $training, $wettkampf, $personId, $sportart, $location, $date, $comment) {
		$exec = $this -> createAnfrage -> execute(array($freizeit, $training, $wettkampf, $personId, $sportart, $location, $date, $comment, 1));
		if ($exec) {
			$this -> getAnfrageById -> execute(array($this -> pdo -> lastInsertId()));
			return $this -> getAnfrageById -> fetchAll(PDO::FETCH_ASSOC);
		}
	}

	function createZusage($anfrageId, $personId, $telNr, $comment = "") {
		$this -> createZusage -> execute(array($anfrageId, $personId, $telNr, $comment));
		$this -> getZusageById-> execute(array($this -> pdo -> lastInsertId()));
		return $this -> getZusageById -> fetch(PDO::FETCH_ASSOC);
	}

	function getZusagen($anfrageId) {
		$this -> getAllZusagenByAnfrageId -> execute(array($anfrageId));
		return $this -> getAllZusagenByAnfrageId -> fetchAll(PDO::FETCH_ASSOC);
	}

	function createZusagetoZusage($anfrageId, $personId, $telNr, $comment = "") {
		$this -> createZusage2 -> execute(array($anfrageId, $telnr, $comment));
		$lastId = $this -> pdo -> lastInsertId();

		$this -> setAnfrageToDoneById(array($anfrageId));

		$this -> getZusage2ById(array($lastId));
		return $this -> getZusage2ById -> fetch(PDO::FETCH_ASSOC);
	}

	function getZusagen2($anfrageId) {
		$this -> getAllZusagen2ByAnfrageId -> execute(array($anfrageId));
		return $this -> getAllZusagen2ByAnfrageId -> fetchAll(PDO::FETCH_ASSOC);
	}

	function getUserByAnfrageId($anfrageId) {
		$this -> getAnfrageById -> execute(array($anfrageId));
		$anfrage = $this -> getAnfrageById -> fetch(PDO::FETCH_ASSOC);
		$userID = $anfrage['personId'];
		$this -> getUserById -> execute(array($userID));
		$user = $this -> getUserById -> fetch(PDO::FETCH_ASSOC);

		return $user;
	}

	/**
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
