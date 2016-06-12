/**
 * Created by Line on 03/05/16.
 */
var START = '#Start'
var LOGIN = '#Login';
var REGISTER = '#Register';
var STARTSEITE = '#Startseite';
var OFFENEANFRAGEN = '#Offene_Anfragen';
var MEINEANFRAGEN = '#Meine_Anfragen';
var ANFRAGEERSTELLEN = '#Anfrage_Erstellen';
var TERMINE = '#Termine';

var restURL = 'http://localhost/webec/php/rest.php/';

/**
 * Shows section with id excluding NavBar
 *
 * @param id    Id of section
 */
function showSectionWithoutNav(id) {
	$('section').hide();
	// hides all sections
	$(id).show();
	//shows new section
	$('#navigation').hide();
	//hides NavBar
}

/**
 * shows Section with id and title including NavBar
 *
 * @param id   Id of section
 * @param title Title of section
 */
function showSection(id, title) {
	$('section').hide();
	// hides all sections
	$('#navigation').show();
	// shows NavBar
	$(id).show();
	// shows new section
	$("h6").text(title);
	// sets wanted title on NavBar
}


/**
 * Gets location name of user as string
 *
 * @return  LocationName the user selected by register
 */
function getSelectedLocation() {
	return $('#ort').val();
}

/**
 * Gets radius from slider input
 *
 * @return selected radius
 */
function getSelectedRadius() {
	return $('#radius').val();
}

/**
 * gets latitude and longitude of a location name
 *
 * @param location  name of location
 * @return LatLng   object of location
 */
function getLatLng(location) {
	geocoder = new google.maps.Geocoder();
	var ret = geocoder.geocode({
		'address' : location
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			console.log(results[0].geometry.location.lat());
			console.log(results[0].geometry.location.lng());
			//TODO: es muss anders auf lat lng zugegriffen werden
			return new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
	console.log(geocoder);
}

/**
 * checks if the distance of a requested place is within the radius of myPlace
 *
 * @param myPlace   place user chose by registration
 * @param anfragePlace  place of Request
 *
 * @return if anfragePlace is within the selected radius of myPlace
 */
function getMatches(myPlace, anfragePlace) {
	return google.maps.geometry.spherical.computeDistanceBetween(myPlace, anfragePlace) <= getSelectedRadius();
}


$(document).ready(function() {

	showSectionWithoutNav(START);

	//*************************Handels navigation to sections**************************
	$('#buger').click(function(e) {
		e.preventDefault();
		$('#navigation').show();
	});

	$('.button-collapse').sideNav({
		menuWidth : 300, // Default is 240
		edge : 'left', // Choose the horizontal origin
		closeOnClick : true // Closes side-nav on <a> clicks, useful for Angular/Meteor
	});

	//************************************Time picker*****************************
	//am/pm
	$('#timepicker_ampm').pickatime();
	$('#timepicker_ampm_dark').pickatime({
		darktheme : true
	});
	//24
	$('#timepicker_24').pickatime({
		twelvehour : false
	});
	$('#timepicker_24_dark').pickatime({
		darktheme : true,
		twelvehour : false
	});
	//default
	$('#timepicker_default').pickatime({
		default : 'now'
	});
	//fromnow
	$('#timepicker_fromnow').pickatime({
		default : 'now',
		fromnow : 5 * 1000 * 60
	});
	//donetext
	$('#timepicker_donetext').pickatime({
		donetext : 'set'
	});
	//autoclose
	$('#timepicker_autoclose').pickatime({
		autoclose : true
	});
	//ampmclickable
	$('#timepicker_ampmclickable').pickatime({
		ampmclickable : true
	});
	$('#timepicker_ampmclickable_dark').pickatime({
		ampmclickable : true,
		darktheme : true
	});
	//vibrate
	$('#timepicker_vibrate').pickatime({
		vibrate : true
	});

	//***************************Materialize functions to handle materailize animations**************************
	$(document).ready(function() {//second $(document).ready(function() is needed to keep materialize working
		Materialize.updateTextFields();
	});

	$(document).ready(function() {//third $(document).ready(function() is needed to keep materialize working
		$('select').material_select();
	});

	//**********************************Date picker**********************************
	$('.datepicker').pickadate({
		selectMonths : true, // Creates a dropdown to control month
		selectYears : 15 // Creates a dropdown of 15 years to control year
	});

});
