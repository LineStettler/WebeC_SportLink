/**
 * This class handles button actions 
 */
$(document).ready(function() {
	//*******************
	//Startseite
	//*******************
	//Nav Button
	$('#Startseite-Link').click(function(e) {
		e.preventDefault();
		showSection(STARTSEITE, "SportLink");

	});
	
	//*******************
	//Registration
	//*******************
	//Nav Button
	$('#ButtonRegister').click(function(e) {
		e.preventDefault();
		showSectionWithoutNav(REGISTER);
	});
	
	//Register Button
	$('#RegisterButton').click(function(e) {
		e.preventDefault();
		register();
	});
	
	//*******************
	//Login
	//*******************
	//Nav Button
	$('#ButtonLogin').click(function(e) {
		e.preventDefault();
		showSectionWithoutNav(LOGIN);
	});
	
	//Login Button
	$('#ButtonSignIn').click(function(e) {
		e.preventDefault();
		login();
	});
	
	
	//*******************
	//Logout
	//*******************
	//Nav Button
	$('#Logout-Link').click(function(e) {
		e.preventDefault();
		logout();
	});

	//*******************
	//Offene Anfragen
	//*******************
	//Nav Button
	$('#Offene_Anfragen-Link').click(function(e) {
		e.preventDefault();
		offeneAnfragen();
		showSection(OFFENEANFRAGEN, "Offene Anfragen");
		
	});
	
	//Nav Button
	$('#OffeneAnfragenButton').click(function(e) {
		e.preventDefault();
		offeneAnfragen();
		showSection(OFFENEANFRAGEN, "Offene Anfragen");
	});
	
	//Suche starten Button
	$('#startSearch').click(function(e) {
		e.preventDefault();
		offeneAnfragen();
	});

	//*******************
	//Meine Anfragen
	//*******************
	//Nav Button	
	$('#Meine_Anfragen-Link').click(function(e) {
		e.preventDefault();
		meineAnfragen();
		showSection(MEINEANFRAGEN, "Meine Anfragen");
	});

	//*******************
	//Anfrage Erstellen
	//*******************
	//Nav Button
	$('#AnfrageErstellenButton').click(function(e) {
		e.preventDefault();
		showSection(ANFRAGEERSTELLEN, "Anfrage Erstellen");
	});
	
	//Nav Button
	$('#Anfrage_Erstellen-Link').click(function(e) {
		e.preventDefault();
		showSection(ANFRAGEERSTELLEN, "Anfrage Erstellen");
	});
	
	//Create Anfrage Button
	$('#AnfrageErstelltButton').click(function(e) {
		e.preventDefault();
		anfrageErstellen();
	});
	


	//*******************
	//Termine
	//*******************
	//Nav Button
	$('#Termine-Link').click(function(e) {
		e.preventDefault();
		termine();
		showSection(TERMINE, "Termine");
	});	
});