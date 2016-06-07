/**
 * Created by Line on 03/05/16.
 */
var START ='#Start'
var LOGIN = '#Login';
var REGISTER = '#Register';
var STARTSEITE = '#Startseite';
var OFFENEANFRAGEN = '#Offene_Anfragen';
var MEINEANFRAGEN = '#Meine_Anfragen';
var ANFRAGEERSTELLEN = '#Anfrage_Erstellen';
var TERMINE = '#Termine';
var restURL = '';
var user;

// shows Section with id excluding NavBar
function showSectionWithoutNav(id)
{
    $('section').hide(); // hides current section
    $(id).show(); //shows new section
    $('#navigation').hide(); //hides NavBar
}

// shows Section with id and title including NavBar
function showSection(id, title)
{
    $('section').hide(); // hides current section
    $('#navigation').show(); // shows NavBar
    $(id).show(); // shows new section
    $("h6").text(title); // sets wanted title on NavBar
}

//*************************************DataLogin*********************************//

function login()
{
	var user = $.post("http://localhost/webec/rest.php/login",
        {
            username: $('#username').text(),
            password: $('#passwordLogin').text()
        }
    ).fail(function(jqxhr, textStatus, error)
    {
	   $('#passwordLogin').addClass('invalid').removeClass('validate');
       $('#username').addClass('invalid').removeClass('validate');
    });
	return user;
}



 //***********************************DataRegister*********************************//
function register()
 {
     if ($('#password').text() == $('#passwordBestätigung').text())
     {
         $.getJson("/Rest.php/register",
         {
             username: $('#firstname').text(),
             lastname: $('#lastname').text(),
             mail: $('#mail').text(),
             password: $('#password').text(),
             ort: $('#ort').text()
         }).fail(function (jqxhr, textStatus, error)
         {
            alert("sending register data to database failed")
         });
     }
 }

/*
POST /Rest.php/register HTTP/1.1
Host: 127.0.0.1
Content-Type: application/json; charset=UTF-8
{   "username": $('#firstname').text(),
    "lastname": $('#lastname').text(),
    "mail": $('#mail').text(),
    "password": $('#password').text(),
    "ort": $('#ort').text()
}
*/

 //*******************************load OffeneAnfragen*********************************//
function offeneAnfragen()
{
     var myPlace = getLatLng(getSelectedLocation());
     var html;
     var anfrage = $.getJson("/rest.php/offeneAnfragen", function( json )
     {
         for(i = 0; i<json.length; ++i)
         {

             if(json[i].userid != user.userid) {

                 html = '<li>'
                 +'< div class = "collapsible-header" >'
                 +'json[i].userid.firstname + " " + json[i].userid.lastname + "," + json[i].date + "," + json[i].time < / div >'
                 +'< div class = "collapsible-body" > < p > jason[i].comment < br > < br > < a > jason[i].telnr < / a > < / p > < / div >'
                 +'< / li > ';

                 $('#anfragen').append(html);
             }
         }
     });
     return anfrage;
 }

 //*******************************OffeneAnfrage gets Zusage*********************************//
 function zusagen()
 {
     $.getJson("/rest.php/offeneAnfragen",
     {
         userid: user.userid,
         anfrageid: anfrage.anfrageid,
         comment: $('.anfrageZusagen').parent().find('p').text(),
         telnr: $('.anfrageZusagen').parent().find('a').text(),
     }).fail(function (jqxhr, textStatus, error)
     {
        alert(textStatus + " " + error);
     });
 }

 //*********************************Termine************************//
 function termine()
 {
     $.getJson("/rest.php/termine", function(json)
     {
         var html;
         for(i = 0; i<json.length; ++i)
         {
             var anfragePlace = getLatLng(json[i].location);
            if(json[i].userid==user.userid && json[i].isopen == false && getMatches(myPlace, anfragePlace))
            {
                 html = '<li>< div class = "collapsible-header">'
                 +'json[i].userid.firstname + " " + json[i].userid.lastname + "," + json[i].date + "," + json[i].time < / div >'
                 +'< div class = "collapsible-body" > < p > jason[i].comment < br > < br > < a > jason[i].telnr < / a > < / p > < / div >'
                 +'< / li > ';
                 $(TERMINE).find('ul').appendChild(html);
             }
         }
     }).fail(function (jqxhr, textStatus, error)
     {
        alert(textStatus + " " + error);
     });
 }

//**************************************selectAnfragenWithinRadius***************//
function getSelectedLocation()
{
    //$("input[type='text'][name='location']:text");
    return $('#ort').text();
    log($('#ort').text());
}

function getSelectedRadius()
{
    //$("input[type='number'][name='radius']:value");
    log($('#radius').val());
    return $('#radius').val();
}

/*function initialize() {
    var address = getSelectedLocation();
    var autocomplete = new google.maps.places.Autocomplete(address);
    autocomplete.setTypes(['geocode']);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
    });
}*/

//get latitude and longitude of a location name
function getLatLng(location)
{
    var options = {
        types: ['geocode'],
        componentRestrictions: {country: 'ch'}//Switzerland only
    };
    geocoder = new google.maps.Geocoder();
    var autocomplete = new google.maps.places.Autocomplete(location,options); //autocompletes the location
    geocoder.geocode( { 'places': autocomplete}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            Console.log(result[0].geometry.location.lat());
            return new google.maps.LatLng(results[0].geometry.location.lat(), result[0].geometry.location.lng());
            //results[0].geometry.location.lng();
        }
        else
        {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

//tests if the distance of a request location is within the radius
function getMatches(myPlace, anfragePlace)
{
    if(computeDistanceBetween(myPlace, anfragePlace) <= getSelectedRadius())
        return true;
    return flase;
}

$(document).ready(function() {
    showSectionWithoutNav(START);
    //$('#navigation').hide();

    $('#buger').click( function(){
        $('#navigation').show();
    });

    $('#ButtonLogin').click( function(){
        //showSectionWithoutNav(LOGIN);
        showSection(LOGIN, "LOGIN NUR IM MOMENT")
    });

    $('#Startseite-Link').click( function(){
        showSection(STARTSEITE, "SportLink");

    });

    $('#Offene_Anfragen-Link').click( function(){
        showSection(OFFENEANFRAGEN, "Offene Anfragen");
    });

    $('#Meine_Anfragen-Link').click( function(){
        showSection(MEINEANFRAGEN, "Meine Anfragen");
    });

    $('#Anfrage_Erstellen-Link').click( function(){
        showSection(ANFRAGEERSTELLEN, "Anfrage Erstellen");
    });

    $('#Termine-Link').click( function(){
        showSection(TERMINE, "Termine");
    });

    $('#Logout-Link').click( function(){
        showSectionWithoutNav(LOGIN);
    });

    $('#ButtonSignIn').click( function(){
		login();
        //showSection(STARTSEITE, "SportLink");
    });

    $('#ButtonRegister').click( function(){
        showSectionWithoutNav(REGISTER);
    });

    $('#RegisterButton').click( function(){
        showSectionWithoutNav(LOGIN);
    });

    $('#OffeneAnfragenButton').click( function(){
        showSection(OFFENEANFRAGEN, "Offene Anfragen");
    });

    $('#AnfrageErstellenButton').click( function(){
        showSection(ANFRAGEERSTELLEN, "Anfrage Erstellen");
    });

    $('#AnfrageErstelltButton').click( function(){
        showSection(MEINEANFRAGEN, "Meine Anfragen");
    });

    $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
    );

    $(document).ready(function() {
        Materialize.updateTextFields();
    });

    $(document).ready(function() {
        $('select').material_select();
    });

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    //am/pm
    $('#timepicker_ampm').pickatime();
    $('#timepicker_ampm_dark').pickatime({
        darktheme: true
    });
    //24
    $('#timepicker_24').pickatime({
        twelvehour: false
    });
    $('#timepicker_24_dark').pickatime({
        darktheme: true,
        twelvehour: false
    });
    //default
    $('#timepicker_default').pickatime({
        default: 'now'
    });
    //fromnow
    $('#timepicker_fromnow').pickatime({
        default: 'now',
        fromnow: 5 * 1000 * 60
    });
    //donetext
    $('#timepicker_donetext').pickatime({
        donetext: 'set'
    });
    //autoclose
    $('#timepicker_autoclose').pickatime({
        autoclose: true
    });
    //ampmclickable
    $('#timepicker_ampmclickable').pickatime({
        ampmclickable: true
    });
    $('#timepicker_ampmclickable_dark').pickatime({
        ampmclickable: true,
        darktheme: true
    });
    //vibrate
    $('#timepicker_vibrate').pickatime({
        vibrate: true
    });
});