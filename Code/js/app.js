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

// this global variabels are necessary to avoid to many database request
var user;
var anfragen;

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


//TODO is not working, because server aborts login, even if the sent data is correct ?MD5?, & cand find source CryptoJS.MD5
/**
 * sends login data to server and if it is valid, userdata is returned.
 * Otherwise password and username gets marked
 *
 * @return user if username and password are valid
 */
function login()
{
	user = $.post(restURL + 'login', function(json)
        {
            username: $('#username').val(),
            password: CryptoJS.MD5($('#passwordLogin').val())
        }
    ).fail(function(jqxhr, textStatus, error)
    {
	   $('#passwordLogin').addClass('invalid').removeClass('validate');
       $('#username').addClass('invalid').removeClass('validate');
    });
}


/**
 * sends user data to server
 */
function register()
 {
     if ($('#password').val() == $('#passwordBestätigung').val())
     {
         $.post(restURL +'register', function(json)
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
 * sends data of new request to server to generate new request in database
 */
function anfrageErstellen()
{
    $.post(restURL + "anfrage", function(json)
        {
            personId: user.id,
            date: $('#date').val(),
            time: $('#timepicker_24').val(),
            location: $('#location').val(),
            freizeit: $('#freizeit').val(),
            training: $('#training').val(),
            wettkampf: $('#wettkampf').val(),
            sportart: $('#sportart').val(),
        }).fail(function (jqxhr, textStatus, error)
    {
        alert(textStatus + ":" + error);
    });
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
     var anfrage = $.get(restURL+ 'anfrage', function( json )
     {
         for(i = 0; i<json.length; ++i)
         {
             anfragePlace = getLatLng(json[i].location);
             if(json[i].personId != user.id &&                        //is not form user itself
                 json[i].isopen == true &&                              //is still open
                 getMatches(myPlace, anfragePlace) &&                   //is within radius
                 json[i].freizeit == $('#freizeit2').val() &&           //has same categories set as selectet by checkboxes
                 json[i].training == $('#training2').val() &&
                 json[i].wettkampf == $('#wettkampf2').val()&&
                 json[i].sportart == $('#sports').val())
             {

                 html = ['<li>'
                 +'< div class = "collapsible-header" >'
                 +'json[i].personId.firstname + " " + json[i].personId.lastname + "," + json[i].anfrageId.date + "," + json[i].anfrageId.time < / div >'
                 +'< div class = "collapsible-body" > < p > jason[i].comment < br > < br > < a > jason[i].telnr < / a > < / p > <br><br> <div style="text-align:center;">
                 <button id="RegisterButton" class="btn btn-default" class="ButtonZusage1">Zusagen</button>
                 </div>< / div >'
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
function zusage1()
 {
     $.post(restURL+ 'zusage1', function(json)
     {
         userid: user.id,
         anfrageid: anfrage.id,
         comment: $('.anfrageZusagen').parent().find('p').val(),
         telnr: $('.anfrageZusagen').parent().find('a').val(),
     }).fail(function (jqxhr, textStatus, error)
     {
        alert(textStatus + " " + error);
     });
 }

/**
 * gets all aviable confirmation from database
 *
 * @return Array with all confirmations
 */
function getZusage1()
{
    $.get(restURL + "zusage1", function(json)
    {
        return json;
    });
}

/**
 * adds to dom users open requests, users open confirmations and confirmations the user got from his request
 * but have not confirmed jet
 */
function meineAnfragen()
{
    var html;
    anfragen = $.get(restURL+ 'anfragen', function( json )
    {
        var zusagen = getZusage1();

        for(int i = 0; i<zusagen.length; ++i)
        {
            for (int j = 0; j < json.length; ++j)
            {
                // appends request to dom if there is no confirmation
                if (json[j].personId == user.id && json[j].isopen == true && zusage[i].anfrageId != json[j].id)
                {
                    html = ['<li>'
                    + '< div class = "collapsible-header" >'
                    + 'json[j].personId.firstname + " " + json[j].personId.lastname + "," + json[j].anfrageId.date + "," + json[j].anfrageId.time < / div >'
                    + '< div class = "collapsible-body" > < p > "bis jetzt keine Zusage erhalten" < / p > < / div >'
                    + '< / li > '];

                    $('#anfragen').appendChild(html.join(''));
                }

                //appends users confirmation to other request to dom
                if(zusagen[j].personId == user.id && json[j].isopen == true)
                {
                    html = ['<li>'
                    +'< div class = "collapsible-header" >'
                    +'zusagen[i].personId.firstname + " " + zusagen[i].personId.lastname + "," + zusagen[i].anfrageId.date + "," + zusagen[i].anfrageId.time < / div >'
                    +'< div class = "collapsible-body" > < p > zusagen[i].comment < br > < br > < a > zusagen[i].telnr < / a > <br><br>(noch nicht bestätigt)< / p > < / div >'
                    +'< / li > '];

                    $('#anfragen').appendChild(html.join(''));
                }
                // appends confirmation to dom if there is allready one
                if(json[j].personId == user.id && json[j].isopen == true && zusage[i].anfrageId == json[j].id)
                {
                    html = ['<li>'
                    +'< div class = "collapsible-header" >'
                    +'zusagen[i].personId.firstname + " " + zusagen[i].personId.lastname + "," + zusagen[i].anfrageId.date + "," + zusagen[i].anfrageId.time < / div >'
                    +'< div class = "collapsible-body" > < p > zusagen[i].comment < br > < br > < a > zusagen[i].telnr < / a > <br> <br> <div style="text-align:center;">
                    <button id="RegisterButton" class="btn btn-default" class="ButtonZusage2">Zusagen</button>
                    </div>< / p > < / div >'
                    +'< / li > '];

                    $('#anfragen').appendChild(html.join(''));
                }
            }
        }

    });
}

/**
 * sends comment and tel nbr of the second confirmation to server
 */
function zusage2()
{
    $.post(restURL+ 'zusage2', function(json)
        {
            userid: user.id,
            anfrageId: anfrage.id,
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
     $.get(restURL + 'zusage2', function(json)
     {
         var html;
         var zusagen1 = getZusage1();
         for(i = 0; i < zusagen1.length; ++i)
         {
             for(int j = 0; j < json.length; ++j)
             {
                 //TODO: Datenbank von zusage2 bräuchte noch eine zusage1Id auf zusage eins, sonst kommt man nicht an die personId der person die zugesagt hat
                 if((json[j].anfrageId.isopen == false) && (json[j].personId == user.id && || json[j].zusage1Id.personId == user.id))
                 {
                     html = ['<li>< div class = "collapsible-header">'
                     +'json[j].personId.firstname + " " + json[j].personId.lastname + "," + json[j].anfrageId.date + "," + json[j].anfrageId.time < / div >'
                     +'< div class = "collapsible-body" > < p > jason[j].comment < br > < br > < a > jason[j].telnr < / a >< / p > < / div >'
                     +'< / li > '];
                     $(TERMINE).find('ul').appendChild(html.join(''));
                 }
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
            //TODO: es muss anders auf lat lng zugegriffen werden
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

    //*************************Handels navigation to sections**************************
    $('#buger').click( function(e){
        e.preventDefault();
        $('#navigation').show();
    });

    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });

    $('#ButtonLogin').click( function(e){
        e.preventDefault();
        showSectionWithoutNav(LOGIN);
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
        meineAnfragen();
        showSection(MEINEANFRAGEN, "Meine Anfragen");
    });

    $('#Anfrage_Erstellen-Link').click( function(e){
        e.preventDefault();
        showSection(ANFRAGEERSTELLEN, "Anfrage Erstellen");
    });

    $('#Termine-Link').click( function(e){
        e.preventDefault();
        termine();
        showSection(TERMINE, "Termine");
    });

    $('#Logout-Link').click( function(e){
        e.preventDefault();
        showSectionWithoutNav(LOGIN);
    });

    //****************************************Login**********************
    $('#ButtonSignIn').click( function(e){
        e.preventDefault();
		//login();
        //getLatLng("Kriens");
        //alert(google.maps.geometry.spherical.computeDistanceBetween(getLatLng("Meggen"), getLatLng("Luzern")));
        showSection(STARTSEITE, "SportLink");
    });

    //***************************************Registration*******************
    $('#ButtonRegister').click( function(e){
        e.preventDefault();
        showSectionWithoutNav(REGISTER);
    });

    $('#RegisterButton').click( function(e){
        e.preventDefault();
        register();
        showSectionWithoutNav(LOGIN);
    });

    //***************************************shows offene Anfragen***********
    $('#OffeneAnfragenButton').click( function(e){
        e.preventDefault();
        showSection(OFFENEANFRAGEN, "Offene Anfragen");
    });

    $('#AnfrageErstelltButton').click( function(e){
        e.preventDefault();
        anfrageErstellen();
        meineAnfragen();
        showSection(MEINEANFRAGEN, "Meine Anfragen");
    });

    $('#startSearch').click( function(e){
        e.preventDefault();
        offeneAnfragen();
    });
    //***************************************Zusagen******************************
    $('.ButtonZusage1').click(function(e){
        e.preventDefault();
        zusage1();
    });

    $('.ButtonZusage2').click(function(e){
        e.preventDefault();
        zusage2();
    });
    //***************************************shows AnfrageErstellen***************
    $('#AnfrageErstellenButton').click( function(e){
        e.preventDefault();
        showSection(ANFRAGEERSTELLEN, "Anfrage Erstellen");
    });

    //************************************Time picker*****************************
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

    //***************************Materialize functions to handle materailize animations**************************
    $(document).ready(function() {          //second $(document).ready(function() is needed to keep materialize working
        Materialize.updateTextFields();
    });

    $(document).ready(function() {          //third $(document).ready(function() is needed to keep materialize working
        $('select').material_select();
    });

    //**********************************Date picker**********************************
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

});