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

// shows Section with id excluding NavBar
function showSectionWithoutNav(id){
    $('section').hide(); // hides current section
    $(id).show(); //shows new section
    $('#navigation').hide(); //hides NavBar
    $
}

// shows Section with id and title including NavBar
function showSection(id, title){
    $('section').hide(); // hides current section
    $(id).show(); // shows new section
    $('#navigation').show(); // shows NavBar
    $("h6").text(title); // sets wanted title on NavBar
}

$(document).ready(function() {
    showSection(START);
    $('#navigation').hide();

    $('#buger').click( function(){
        $('#navigation').show();
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
        showSection(STARTSEITE, "SportLink");
    });

    $('#ButtonRegister').click( function(){
        showSectionWithoutNav(REGISTER);
    });

    $('#ButtonLogin').click( function(){
        showSectionWithoutNav(LOGIN);
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