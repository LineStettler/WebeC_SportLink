/**
 * sends user data to server
 */
function register() {
	$('#registerResult').text("");
	if ($('#password').val() == $('#passwordBestätigen').val() && validateEmail($('#mail').val())) {
		$.post(restURL + 'register', {
			firstname : $('#firstname').val(),
			lastname : $('#lastname').val(),
			mail : $('#mail').val(),
			password : MD5($('#password').val()),
			ort : $('#ort').val()
		}).done(function(data) {
			var user = JSON.parse(data);
			$('#username').text(user.mail);
			showSectionWithoutNav(LOGIN);
		}).fail(function(jqxhr, textStatus, error) {
			if (jqxhr.status = 400) {
				$('#mail').addClass('invalid').removeClass('validate');
				$('#registerResult').text(error);
			}
		});
	} else {
		if (!validateEmail($('#mail').val())) {
			$('#mail').addClass('invalid').removeClass('validate');
			$('#registerResult').text("invalid email. ");
		} else {
			$('#mail').removeClass('invalid').addClass('validate');
		}
		if ($('#password').val() != $('#passwordBestätigen').val()) {
			$('#password').addClass('invalid').removeClass('validate');
			$('#passwordBestätigen').addClass('invalid').removeClass('validate');
			$('#registerResult').text($('#registerResult').text() + "passwords don't match.");
		} else {
			$('#password').removeClass('invalid').addClass('validate');
			$('#passwordBestätigen').removeClass('invalid').addClass('validate');
		}
	}
}

/**
 * sends login data to server and if it is valid, userdata is returned.
 * Otherwise password and username gets marked
 *
 * @return user if username and password are valid
 */
function login() {
	$.post(restURL + 'login', {
		username : $('#username').val(),
		password : MD5($('#passwordLogin').val())
	}).done(function(data) {
		var user = JSON.parse(data);
		$('#userId').text(user.id);
		$('#firstName').text(user.vorname);
		showSection(STARTSEITE, "SportLink");
	}).fail(function(jqxhr, textStatus, error) {
		$('#loginResult').text(error);
		$('#passwordLogin').addClass('invalid').removeClass('validate');
		$('#username').addClass('invalid').removeClass('validate');
	});
}

function logout() {
	$('#userId').text("");
	$('#firstName').text("");
	showSectionWithoutNav(LOGIN);
}

/**
 * Adds all open request to dom
 *
 * @return Array with all requests
 */
function offeneAnfragen() {

	$.get(restURL + 'anfrage', {
		//data
		isopen : "true",
		excludeUserId : $('#userId').text(),
		range : $('#range').val(),
		freizeit : $('#freizeit2').is(":checked"),
		training : $('#training2').is(":checked"),
		wettkampf : $('#wettkampf2').is(":checked"),
		sportart : $('#sports :selected').text(),
		rangeUserId : $('#userId').text()
	}).done(function(data) {
		$('#offeneAnfragen').empty();
		var anfragen = JSON.parse(data);
		for ( i = 0; i < anfragen.length; ++i) {
			addOffeneAnfrage(anfragen[i], '#offeneAnfragen', '');
		}
	}).fail(function(jqxhr, textStatus, error) {
		alert("something went horribly wrong, sry");
	});
}

function addOffeneAnfrage(anfrage, id, subId) {
	$.get(restURL + "/user", {
		userId : anfrage.personId
	}).done(function(data) {
		var anfrageUser = JSON.parse(data);
		console.log(anfrage);
		//@formatter:off
		var html = '<li><div class="collapsible-header">' 
		+ '<i class="material-icons"></i>' + anfrageUser.vorname + ' ' + anfrageUser.name + ', ' + anfrage.date 
		+ '</div><div class="collapsible-body" id="' + subId + '">'
		+'Ort: '+anfrage.location+'<br>'
		+'Sportart: '+anfrage.sportart+'<br>'
		+'Freizeit: '+anfrage.freizeit+'<br>'
		+'Training: '+anfrage.training+'<br>'
		+'Wettkampf: '+anfrage.wettkampf+'<br>'
		+'<p>' + anfrage.comment + '</p>'
		+'<p>'
		+'<div class="input-field">'
		+'<input type="text" id="anfrageZusageTelNr'+anfrage.id+'" class="validate">'
		+'<label class="" for="anfrageZusageTelNr'+anfrage.id+'">Telefonnummer</label>'
		+'</div>'
		+'<div class="input-field">'
		+'<textarea class="materialize-textarea" id="anfrageZusageComment'+anfrage.id+'"></textarea>'
		+'<label for="anfrageZusageComment'+anfrage.id+'">Kommentar</label>'
		+'</div>'
		+'<button class="btn btn-default" onclick="createZusage('+anfrage.id+')">Zusagen</button></p>'
		+'</div></li>';
		//@formatter:on

		$(id).append(html);
	});
}

function createZusage(anfrageid) {
	$.post(restURL + "/zusage", {
		userId : $('#userId').text(),
		anfrageId : anfrageid,
		comment : $('#anfrageZusageComment' + anfrageid).val(),
		telNr : $('#anfrageZusageTelNr' + anfrageid).val()
	}).done(function(data) {
		console.log(data);
		showSection(OFFENEANFRAGEN, "Offene Anfragen");
	}).fail(function(jqxhr, textStatus, error) {
		alert("something went horribly wrong, sry");
	});
}

function addZusage(zusage, id, anfrageId) {
	$.get(restURL + "/user", {
		userId : zusage.personid
	}).done(function(data) {
		var zusageUser = JSON.parse(data);
		//@formatter:off
		var html = '<li><div class = "collapsible-header" >' + zusageUser.vorname + ' ' + zusageUser.name + '</div><div class = "collapsible-body">'
		+'<p>' + zusage.comment + '<br><br><a>' + zusage.telnr + '</a></p>'
		+'<p>'
		+'<div class="input-field">'
		+'<input type="text" id="zusageZusageTelNr'+zusage.id+'" class="validate">'
		+'<label class="" for="zusageZusageTelNr'+zusage.id+'">Telefonnummer</label>'
		+'</div>'
		+'<div class="input-field">'
		+'<textarea class="materialize-textarea" id="zusageZusageComment'+zusage.id+'"></textarea>'
		+'<label for="zusageZusageComment'+zusage.id+'">Kommentar</label>'
		+'</div>'
		+'<button class="btn btn-default" onclick="createZusage2('+anfrageId+','+zusage.id+')">Zusagen</button></p>'
		+'</div></li>';
		+'</div></li></ul>';
		//@formatter:on
		$('.collapsible').collapsible({
			accordion : true
		});
		$(id).append(html);
	});
}

function createZusage2(anfrageId, zusageId){
	
}

function addMeineAnfrage(anfrage) {
	$.get(restURL + "/user", {
		userId : anfrage.personId
	}).done(function(data) {
		var anfrageUser = JSON.parse(data);
		//@formatter:off
		var html = '<li><div class="collapsible-header">' 
		+'<i class="material-icons"></i>' + anfrageUser.vorname + ' ' + anfrageUser.name + ', ' + anfrage.date
		+'</div><div class="collapsible-body" id="' + 'meineAnfrage' + anfrage.id + '">'
		+'Ort: '+anfrage.location+'<br>'
		+'Sportart: '+anfrage.sportart+'<br>'
		+'Freizeit: '+anfrage.freizeit+'<br>'
		+'Training: '+anfrage.training+'<br>'
		+'Wettkampf: '+anfrage.wettkampf+'<br>'
		+'<p>' + anfrage.comment + '</p></div></li>';
		//@formatter:on
		$('#meineAnfragen').append(html);

		$.get(restURL + 'zusage', {
			anfrageId : anfrage.id
		}).done(function(data) {
			if (data.length > 2) {
				var zusagen = JSON.parse(data);
				var ul = '<ul class="collapsible" data-collapsible="accordion" id="meineZusage' + anfrage.id + '"></ul>';
				$('#meineAnfrage' + anfrage.id).append(ul);
				for ( i = 0; i < zusagen.length; ++i) {
					var zusage = zusagen[i];
					addZusage(zusage, '#meineZusage' + anfrage.id, anfrage.id);
				}
			}
		}).fail(function(jqxhr, textStatus, error) {
			alert("something went horribly wrong, sry");
		});
	});
}

/**
 * sends data of new request to server to generate new request in database
 */
function anfrageErstellen() {
	$.post(restURL + "anfrage", {
		userId : $('#userId').text(),
		date : $('#date').val(),
		time : $('#timepicker_24').val(),
		location : $('#location').val(),
		freizeit : $('#freizeit').val(),
		training : $('#training').val(),
		wettkampf : $('#wettkampf').val(),
		sportart : $('#sportart').val(),
		comment : $('#comment').val()
	}).done(function(data) {
		$('#date').val("");
		$('#timepicker_24').val("");
		$('#location').val("");
		$('#freizeit').val("");
		$('#training').val("");
		$('#wettkampf').val("");
		$('#sportart').val("");
		$('#comment').val("");
		meineAnfragen();
		showSection(MEINEANFRAGEN, "Meine Anfragen");
	}).fail(function(jqxhr, textStatus, error) {
		alert("something went horribly wrong, sry");
	});
}

/**
 * adds to dom users open requests, users open confirmations and confirmations
 * the user got from his request
 * but have not confirmed jet
 */
function meineAnfragen() {
	$.get(restURL + 'anfrage', {
		userId : $('#userId').text(),
		isopen : "true"
	}).done(function(data) {
		$('#meineAnfragen').empty();
		var anfragen = JSON.parse(data);
		for ( i = 0; i < anfragen.length; ++i) {
			var anfrage = anfragen[i];
			addMeineAnfrage(anfrage);
		}
	}).fail(function(jqxhr, textStatus, error) {
		alert("something went horribly wrong, sry");
	});
}


//TODO
/**
 * adds all confirmed requests to users list of appointments
 */
function termine() {
	$('#temine').empty();
	$.get(restURL+ '/anfrage', {
		isopen:"false",
		userId:$('#userId').text()
	}).done(function(data) {
		console.log(data);
		
	}).fail(function(jqxhr, textStatus, error) {
		alert("something went horribly wrong, sry");
	});
}
