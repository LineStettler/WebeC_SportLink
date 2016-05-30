<?php
class DBAcess {
	private $dsn = 'mysql:dbname=sportlink;host=127.0.0.1';
	private $dbuser = 'root';
	private $dbpassword = '';
	private $pdo;

	private $getUserByEmail;
	private $createUser;
	private $getUserById;
	private $getAllAnfrage;
	private $getAnfrageByUserId;
	private $createAnfrage;
	private $getAnfrageById;
	private $createZusage;
	private $getAllAnfrageDoneByUserId;
	private $getAllZusagenByAnfrageId;
	private $createZusage2;
	private $getZusageById;
	private $getZusage2ById;
	private $setAnfrageToDoneById;

	function __construct() {
		try {
			$this -> pdo = new PDO($this -> dsn, $this -> dbuser, $this -> dbpassword);
			//create Statements
			$this -> getUserByEmail = $this -> pdo -> prepare("SELECT *  FROM `person` WHERE `mail`=?");
			$this -> createUser = $this -> pdo -> prepare("INSERT INTO `person`(`name`, `vorname`, `mail`, `password`, `ort`) VALUES (?,?,?,?,?)");
			$this -> getUserById = $this -> pdo -> prepare("SELECT *  FROM `person` WHERE `id`=?");
			$this -> getAllAnfrage = $this -> pdo -> prepare("SELECT * FROM `anfrage`");
			$this -> getAnfrageByUserId = $this -> pdo -> prepare("SELECT * FROM `anfrage` WHERE `personId`=?");
			$this -> createAnfrage = $this -> pdo -> prepare("INSERT INTO `anfrage`(`freizeit`, `training`, `wettkampf`, `personId`, `sportart`, `location`, `date`, `comment`, `isopen`) VALUES (?,?,?,?,?,?,?,?,?)");
			$this -> getAnfrageById = $this -> pdo -> prepare("SELECT * FROM `anfrage` WHERE id=?");
			$this -> createZusage = $this -> pdo -> prepare("INSERT INTO `zusage1`(`anfrageId`, `personid`, `telnr`, `comment`) VALUES (?,?,?,?)");
			$this -> getAllAnfrageDoneByUserId = $this -> pdo -> prepare("SELECT * FROM `anfrage` WHERE `personId` = ? AND `isopen` = 0");
			$this -> $getAllZusagenByAnfrageId = $this -> pdo -> prepare("SELECT * FROM `zusage1` WHERE `anfrageId` = ?");
			$this -> createZusage2 = $this -> pdo -> prepare("INSERT INTO `zusage2`(`zusage1id`, `telnr`, `comment`) VALUES (?,?,?)");
			$this -> getZusageById = $this -> pdo -> prepare("SELECT * FROM `zusage1` WHERE `id` = ?");
			$this -> getZusage2ById = $this -> pdo -> prepare("SELECT * FROM `zusage2` WHERE `id` = ?");
			$this -> setAnfrageToDoneById = $this -> pdo -> prepare("UPDATE `anfrage` SET `isopen`=1 WHERE `id` = ?");
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

	function getAllAnfragen() {
		$exec = $this -> getAllAnfrage -> execute();
		return $this -> getAllAnfrage -> fetchAll(PDO::FETCH_ASSOC);
	}

	function getUserAnfrage($userId) {
		$exec = $this -> getAnfrageByUserId -> execute(array($userId));
		return $this -> getAnfrageByUserId -> fetchAll(PDO::FETCH_ASSOC);
	}

	function createAnfrage($freizeit, $training, $wettkampf, $personId, $sportart, $location, $date, $comment) {
		$exec = $this -> createAnfrage -> execute(array($freizeit, $training, $wettkampf, $personId, $sportart, $location, $date, $comment, 0));
		if ($exec) {
			$this -> getAnfrageById -> execute(array($this -> pdo -> lastInsertId()));
			return $this -> getAnfrageById -> fetchAll(PDO::FETCH_ASSOC);
		}
	}

	function createZusage($anfrageId, $personId, $telNr, $comment = "") {
		$this -> createZusage -> execute(array($anfrageId, $personId, $telNr, $comment));
		$this -> getZusageById(array($this -> pdo -> lastInsertId()));
		return $this -> getZusageById -> fetch(PDO::FETCH_ASSOC);
	}

	function getDoneAnfragen($userId) {
		$this -> getAllAnfrageDoneByUserId -> execute(array($userId));
		return $this -> getAllAnfrage -> fetchAll(PDO::FETCH_ASSOC);
	}

	function getAllZusagen($anfrageId) {
		$this -> getAllZusagenByAnfrageId -> execute(array($anfrageId));
		return $this -> getAllZusagenByAnfrageId -> fetchAll(PDO::FETCH_ASSOC);
	}

	function createZusagetoZusage($zusageId, $telnr, $comment = "") {
		$this -> createZusage2 -> execute(array($zusageId, $telnr, $comment));
		$lastId = $this->pdo->lastInsertId();
		
		$this->getZusageById->execute(array($zusageId));
		$zusage = $this->getZusageById->fetch(PDO::FETCH_ASSOC);
		$this->setAnfrageToDoneById(array($zusage['anfrageId']));
		
		$this -> getZusage2ById(array($lastId));
		return $this -> getZusage2ById -> fetch(PDO::FETCH_ASSOC);
		//set anfrage to done
	}

}
