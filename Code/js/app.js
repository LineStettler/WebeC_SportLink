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
var restURL = 'http://localhost:8080/webec/rest.php/';
var user;

/**
 * Shows section with id excluding NavBar
 *
 * @param id    Id of section
 */
function showSectionWithoutNav(id)
{
    $('section').hide(); // hides all sections
    $(id).show(); //shows new section
    $('#navigation').hide(); //hides NavBar
}

/**
 * shows Section with id and title including NavBar
 *
 * @param id   Id of section
 * @param title Title of section
 */
function showSection(id, title)
{
    $('section').hide(); // hides all sections
    $('#navigation').show(); // shows NavBar
    $(id).show(); // shows new section
    $("h6").text(title); // sets wanted title on NavBar
}


//TODO is not working, because server aborts login, even if the sent data is correct
/**
 * sends login data to server and if it is valid, userdata is returned.
 * Otherwise password and username gets marked
 *
 * @return user if username and password are valid
 */
function login()
{
	var user = $.post(restURL + 'login',
        {
            username: $('#username').val(),
            password: CryptoJS.MD5($('#passwordLogin').val())
        }
    ).fail(function(jqxhr, textStatus, error)
    {
	   $('#passwordLogin').addClass('invalid').removeClass('validate');
       $('#username').addClass('invalid').removeClass('validate');
    });
	return user;
}


/**
 * sends user data to server
 */
function register()
 {
     if ($('#password').val() == $('#passwordBestätigung').val())
     {
         $.post(restURL +'register',
         {
             username: $('#firstname').val(),
             lastname: $('#lastname').val(),
             mail: $('#mail').val(),
             password: CryptoJS.MD5($('#password').val()),
             ort: $('#ort').val()
         }).fail(function (jqxhr, textStatus, error)
         {
            alert("sending register data to database failed")
         });
     }
 }

/**
 * Adds all open request to dom
 *
 * @return Array with all requests
 */
function offeneAnfragen()
{
     var myPlace = getLatLng(getSelectedLocation());
     var html;
     var anfragePlace
     var anfrage = $.get(restURL+ 'offeneAnfragen', function( json )
     {
         for(i = 0; i<json.length; ++i)
         {
             anfragePlace = getLatLng(json[i].location);
             if(json[i].userid != user.userid &&                        //is not form user itself
                 json[i].isopen == true &&                              //is still open
                 getMatches(myPlace, anfragePlace) &&                   //is within radius
                 json[i].freizeit == $('#freizeit2').val() &&           //has same categories set as selectet by checkboxes
                 json[i].training == $('#training2').val() &&
                 json[i].wettkampf == $('#wettkampf2').val()&&
                 json[i].sportart == $('#sports').val()){

                 html = ['<li>'
                 +'< div class = "collapsible-header" >'
                 +'json[i].userid.firstname + " " + json[i].userid.lastname + "," + json[i].date + "," + json[i].time < / div >'
                 +'< div class = "collapsible-body" > < p > jason[i].comment < br > < br > < a > jason[i].telnr < / a > < / p > < / div >'
                 +'< / li > '];

                 $('#anfragen').append(html.join(''));
             }
         }
     });
     return anfrage;
 }

/**
 * sends comment and tel nbr of the confirmation to server
 */
function zusagen()
 {
     $.get(restURL+ 'offeneAnfragen',
     {
         userid: user.userid,
         anfrageid: anfrage.anfrageid,
         comment: $('.anfrageZusagen').parent().find('p').val(),
         telnr: $('.anfrageZusagen').parent().find('a').val(),
     }).fail(function (jqxhr, textStatus, error)
     {
        alert(textStatus + " " + error);
     });
 }

/**
 * adds all confirmed requests to users list of appointments
 */
 function termine()
 {
     $.get(restURL + 'termine', function(json)
     {
         var html;
         for(i = 0; i<json.length; ++i)
         {
             var anfragePlace = getLatLng(json[i].location);
            if(json[i].userid==user.userid && json[i].isopen == false && getMatches(myPlace, anfragePlace))
            {
                 html = ['<li>< div class = "collapsible-header">'
                 +'json[i].userid.firstname + " " + json[i].userid.lastname + "," + json[i].date + "," + json[i].time < / div >'
                 +'< div class = "collapsible-body" > < p > jason[i].comment < br > < br > < a > jason[i].telnr < / a > < / p > < / div >'
                 +'< / li > '];
                 $(TERMINE).find('ul').appendChild(html.join(''));
             }
         }
     }).fail(function (jqxhr, textStatus, error)
     {
        alert(textStatus + " " + error);
     });
 }

/**
 * Gets location name of user as string
 *
 * @return  LocationName the user selected by register
 */
function getSelectedLocation()
{
    return $('#ort').val();
    log($('#ort').val());
}

/**
 * Gets radius from slider input
 *
 * @return selected radius
 */
function getSelectedRadius()
{
    log($('#radius').val());
    return $('#radius').val();
}

/**
 * gets latitude and longitude of a location name
 *
 * @param location  name of location
 * @return LatLng   object of location
 */
function getLatLng(location)
{
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': location}, function(results, status)
    {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(result[0].geometry.location.lat());
            return new google.maps.LatLng(results[0].geometry.location.lat(), result[0].geometry.location.lng());
        }
        else
        {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

/**
 * checks if the distance of a requested place is within the radius of myPlace
 *
 * @param myPlace   place user chose by registration
 * @param anfragePlace  place of Request
 *
 * @return if anfragePlace is within the selected radius of myPlace
 */
function getMatches(myPlace, anfragePlace)
{
    return google.maps.geometry.spherical.computeDistanceBetween(myPlace, anfragePlace) <= getSelectedRadius();
}

$(document).ready(function() {
    showSectionWithoutNav(START);
    //$('#navigation').hide();

    $('#buger').click( function(e){
        e.preventDefault();
        $('#navigation').show();
    });

    $('#ButtonLogin').click( function(e){
        e.preventDefault();
        //showSectionWithoutNav(LOGIN);
        showSection(LOGIN, "LOGIN NUR IM MOMENT")
    });

    $('#Startseite-Link').click( function(e){
        e.preventDefault();
        showSection(STARTSEITE, "SportLink");

    });

    $('#Offene_Anfragen-Link').click( function(e){
        e.preventDefault();
        showSection(OFFENEANFRAGEN, "Offene Anfragen");
    });

    $('#Meine_Anfragen-Link').click( function(e){
        e.preventDefault();
        showSection(MEINEANFRAGEN, "Meine Anfragen");
    });

    $('#Anfrage_Erstellen-Link').click( function(e){
        e.preventDefault();
        showSection(ANFRAGEERSTELLEN, "Anfrage Erstellen");
    });

    $('#Termine-Link').click( function(e){
        e.preventDefault();
        showSection(TERMINE, "Termine");
    });

    $('#Logout-Link').click( function(e){
        e.preventDefault();
        showSectionWithoutNav(LOGIN);
    });

    $('#ButtonSignIn').click( function(e){
        e.preventDefault();
		//login();
        //getLatLng("Kriens");
        //alert(google.maps.geometry.spherical.computeDistanceBetween(getLatLng("Meggen"), getLatLng("Luzern")));
        showSection(STARTSEITE, "SportLink");
    });

    $('#ButtonRegister').click( function(e){
        e.preventDefault();
        showSectionWithoutNav(REGISTER);
    });

    $('#RegisterButton').click( function(e){
        e.preventDefault();
        showSectionWithoutNav(LOGIN);
    });

    $('#OffeneAnfragenButton').click( function(e){
        e.preventDefault();
        showSection(OFFENEANFRAGEN, "Offene Anfragen");
    });

    $('#AnfrageErstellenButton').click( function(e){
        e.preventDefault();
        showSection(ANFRAGEERSTELLEN, "Anfrage Erstellen");
    });

    $('#AnfrageErstelltButton').click( function(e){
        e.preventDefault();
        showSection(MEINEANFRAGEN, "Meine Anfragen");
    });

    $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
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

    $(document).ready(function() {          //second $(document).ready(function() is needed to keep materialize working
        Materialize.updateTextFields();
    });

    $(document).ready(function() {          //third $(document).ready(function() is needed to keep materialize working
        $('select').material_select();
    });

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    $('#startSearch').click( function(e){
        e.preventDefault();
        offeneAnfragen();
    });
});