/**
 * Created by Line on 03/05/16.
 */

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
    showSection(LOGIN);
    //$('#navigation').hide();

    $('#buger').click( function(){
        $('#navigation').show();
    });

    $('#Startseite-Link').click( function(){
        showSection(STARTSEITE);
    });
    $('#Offene_Anfragen-Link').click( function(){
        showSection(OFFENEANFRAGEN);
    });
    $('#Meine_Anfragen-Link').click( function(){
        showSection(MEINEANFRAGEN);
    });
    $('#Anfrage_Erstellen-Link').click( function(){
        showSection(ANFRAGEERSTELLEN);
    });
    $('#Termine-Link').click( function(){
        showSection(TERMINE);
    });
    $('#Logout-Link').click( function(){
        showSection(LOGIN);
    });
    $('#ButtonSignIn').click( function(){
        showSection(STARTSEITE);
    });
    $('#ButtonRegister').click( function(){
        showSection(REGISTER);
    });
    $('#RegisterButton').click( function(){
        showSection(LOGIN);
    });
    $('#OffeneAnfragenButton').click( function(){
        showSection(OFFENEANFRAGEN);
    });
    $('#AnfrageErstellenButton').click( function(){
        showSection(ANFRAGEERSTELLEN);
    });
    $('#AnfrageErstelltButton').click( function(){
        showSection(MEINEANFRAGEN);
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