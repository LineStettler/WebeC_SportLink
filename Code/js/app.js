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

$(document).ready(function() {
    showSection(START);
    $('#navigation').hide();

    $('#buger').click( function(){
        $('#navigation').show();
    });

    $('#Startseite-Link').click( function(){
        showSection(STARTSEITE);
        $("h6").text("SportLink");
    });
    $('#Offene_Anfragen-Link').click( function(){
        showSection(OFFENEANFRAGEN);
        $("h6").text("Offene Anfragen");
    });
    $('#Meine_Anfragen-Link').click( function(){
        showSection(MEINEANFRAGEN);
        $("h6").text("Meine Anfragen");
    });
    $('#Anfrage_Erstellen-Link').click( function(){
        showSection(ANFRAGEERSTELLEN);
        $("h6").text("Anfrage Erstellen");
    });
    $('#Termine-Link').click( function(){
        showSection(TERMINE);
        $("h6").text("Termine");
    });
    $('#Logout-Link').click( function(){
        showSection(LOGIN);
    });
    $('#ButtonSignIn').click( function(){
        showSection(STARTSEITE);
        $("h6").text("SportLink");
    });
    $('#ButtonRegister').click( function(){
        showSection(REGISTER);
        $("h6").text("Register");
    });
    $('#ButtonLogin').click( function(){
        showSection(LOGIN);
        $('#navigation').show();
        $("h6").text("Login");
    });
    $('#RegisterButton').click( function(){
        showSection(LOGIN);
        $("h6").text("Login");
    });
    $('#OffeneAnfragenButton').click( function(){
        showSection(OFFENEANFRAGEN);
        $("h6").text("Offene Anfragen");
    });
    $('#AnfrageErstellenButton').click( function(){
        showSection(ANFRAGEERSTELLEN);
        $("h6").text("Anfrage Erstellen");
    });
    $('#AnfrageErstelltButton').click( function(){
        showSection(MEINEANFRAGEN);
        $("h6").text("Meine Anfragen");
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


});