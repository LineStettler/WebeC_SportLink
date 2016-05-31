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

function showSection(id){
    $('section').hide();
    $(id).show();
}

function changeTitle(title){
    $("h6").text(title);
}

$(document).ready(function() {
    showSection(START);
    $('#navigation').hide();

    $('#buger').click( function(){
        $('#navigation').show();
    });

    $('#Startseite-Link').click( function(){
        showSection(STARTSEITE);
        changeTitle("SportLink");
    });
    $('#Offene_Anfragen-Link').click( function(){
        showSection(OFFENEANFRAGEN);
        changeTitle("Offene Anfragen");
    });
    $('#Meine_Anfragen-Link').click( function(){
        showSection(MEINEANFRAGEN);
        changeTitle("Meine Anfragen");
    });
    $('#Anfrage_Erstellen-Link').click( function(){
        showSection(ANFRAGEERSTELLEN);
        changeTitle("Anfrage Erstellen");
    });
    $('#Termine-Link').click( function(){
        showSection(TERMINE);
        changeTitle("Termine");
    });
    $('#Logout-Link').click( function(){
        showSection(LOGIN);
    });
    $('#ButtonSignIn').click( function(){
        showSection(STARTSEITE);
        changeTitle("SportLink");
    });
    $('#ButtonRegister').click( function(){
        showSection(REGISTER);
        changeTitle("Register");
    });
    $('#ButtonLogin').click( function(){
        showSection(LOGIN);
        $('#navigation').show();
        changeTitle("Login");
    });
    $('#RegisterButton').click( function(){
        showSection(LOGIN);
        changeTitle("Login");
    });
    $('#OffeneAnfragenButton').click( function(){
        showSection(OFFENEANFRAGEN);
        changeTitle("Offene Anfragen");
    });
    $('#AnfrageErstellenButton').click( function(){
        showSection(ANFRAGEERSTELLEN);
        changeTitle("Anfrage Erstellen");
    });
    $('#AnfrageErstelltButton').click( function(){
        showSection(MEINEANFRAGEN);
        changeTitle("Meine Anfragen");
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