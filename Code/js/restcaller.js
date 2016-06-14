/**
 * Checks if the register information is correct
 * and if the data is correct it would send the register information to the
 * server
 * if the register process was succesfull, it shows the Login screen
 * if unsucessful it will show what was wrong
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
 * sends login data to server and if it is valid, userdata is returned and saved.
 * Otherwise password and username gets marked
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

/**
 * deletes the user information and redirects to the login screen
 */
function logout() {
	$('#userId').text("");
	$('#firstName').text("");
	showSectionWithoutNav(LOGIN);
}

/**
 * gets all Anfragen that dont belong to the user
 * if sucessful it empties the offene anfrage list
 * and adds the data from the server to the offene Anfrage list
 */
function offeneAnfragen() {

	$.get(restURL + 'anfrage', {
		//data
		isopen : "true",
		excludeUserId : $('#userId').text(),
		range : $('#radius').val(),
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
	});
}

/**
 * gets the user information matching an anfrage
 * if succesfull adds the anfrage to the offene anfrage list
 */
function addOffeneAnfrage(anfrage, id, subId) {
	$.get(restURL + "/user", {
		userId : anfrage.personId
	}).done(function(data) {
		var anfrageUser = JSON.parse(data);
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

/**
 * gets all Anfrage from the user and adds them to meine anfrage
 * if succesfull also gets all zusage to the anfragen and adds them to the anfrage
 */
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
		});
	});
}

/**
 * gets the zusage by anfrageid and adds them to the html element id
 */
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
		+'</div></li>';
		//@formatter:on
		$('.collapsible').collapsible({
			accordion : true
		});
		$(id).append(html);
	});
}

/**
 * creates a post request to create a anfrage
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
		sportart : $('#sportart option:selected').text(),
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
	});
}

/**
 * populates the Meien Anfragen screen with data
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
	});
}

/**
 * creates a new zusage to a anfrage
 * if sucessful redirects to offene anfragen
 */
function createZusage(anfrageid) {
	$.post(restURL + "/zusage", {
		userId : $('#userId').text(),
		anfrageId : anfrageid,
		comment : $('#anfrageZusageComment' + anfrageid).val(),
		telNr : $('#anfrageZusageTelNr' + anfrageid).val()
	}).done(function(data) {
		showSection(STARTSEITE, "Startseite");
	});
}

/**
 * creates a new zusage 2 per post request
 */
function createZusage2(anfrageId, zusageId) {
	$.post(restURL + "/zusage2", {
		anfrageId : anfrageId,
		zusageId : zusageId,
		comment : $('#zusageZusageComment' + zusageId).val(),
		telNr : $('#zusageZusageTelNr' + zusageId).val()
	}).done(function(data) {
		termine();
		showSection(TERMINE, "Termine");
	});
}

/**
 * populates the termine screen
 */
function termine() {
	$('#temine').empty();
	$.get(restURL + '/anfrage', {
		isopen : "false",
		userId : $('#userId').text()
	}).done(function(data) {
		var anfragen = JSON.parse(data);
		for ( i = 0; i < anfragen.length; ++i) {
			var anfrage = anfragen[i];
			addTerminAnfrage(anfrage, "terminAnfrage" + anfrage.id);
		}
	});

	$.get(restURL + '/zusage', {
		userId : $('#userId').text(),
		done : "true"
	}).done(function(data) {
		var zusagen = JSON.parse(data);
		for ( i = 0; i < zusagen.length; ++i) {
			var zusage = zusagen[i];
			getTerminAnfrage(zusage.anfrageId);
		}
	});
}
/**
 * gets a anfrage matching a anfrageid
 * and adds it to the termine screen
 */
function getTerminAnfrage(anfrageId) {
	$.get(restURL + "/anfrage", {
		anfrageId : anfrageId
	}).done(function(data) {
		var anfrage = JSON.parse(data)[0];
		addTerminAnfrage(anfrage, "terminAnfrage" + anfrage.id);
	});
}

/**
 * add a anfrage including the zusage and zusage2 to the termin screen
 */
function addTerminAnfrage(anfrage, subId) {
	$.get(restURL + "/user", {
		userId : anfrage.personId
	}).done(function(data) {
		var anfrageUser = JSON.parse(data);
		//@formatter:off
		var html = '<li><div class="collapsible-header">' 
		+'<i class="material-icons"></i>' + anfrageUser.vorname + ' ' + anfrageUser.name + ', ' + anfrage.date
		+'</div><div class="collapsible-body" id="' + 'meineTermine' + anfrage.id + '">'
		+'Ort: '+anfrage.location+'<br>'
		+'Sportart: '+anfrage.sportart+'<br>'
		+'Freizeit: '+anfrage.freizeit+'<br>'
		+'Training: '+anfrage.training+'<br>'
		+'Wettkampf: '+anfrage.wettkampf+'<br>'
		+'<p>' + anfrage.comment + '</p></div></li>';
		//@formatter:on
		$('#temine').append(html);
		getTerminZusageToAnfrage(anfrage.id);
		
	});
}

/**
 * gets a zusage to a anfrage and adds it to the anfrage in termin and adds zusage 2
 */
function getTerminZusageToAnfrage(anfrageId){
	$.get(restURL + '/zusage', {
			anfrageId : anfrageId,
			done : "true"
		}).done(function(data) {
			var zusage = JSON.parse(data);
			var ul = '<ul class="collapsible" data-collapsible="accordion" id="meineZusage' + anfrageId + '"></ul>';
			$('#meineTermine' + anfrageId).append(ul);
			addTerminZusageToAnfrage(zusage, '#meineZusage' + anfrageId, anfrageId);
		});
}

/**
 * adds a zusage to a anfrage and adds zusage 2
 */
function addTerminZusageToAnfrage(zusage, id, anfrageId) {
	$.get(restURL + "/user", {
		userId : zusage.personid
	}).done(function(data) {
		var zusageUser = JSON.parse(data);
		//@formatter:off
		var html = '<li><div class = "collapsible-header" >' + zusageUser.vorname + ' ' + zusageUser.name + '</div><div class = "collapsible-body" id="meineZusageDiv'+anfrageId+'">'
		+'<p>' + zusage.comment + '<br><br><a>' + zusage.telnr + '</a></p>'
		+'</div></li>';
		var ul = '<ul class="collapsible" data-collapsible="accordion" id="meineZusageZusage' + anfrageId + '"></ul>';
		//@formatter:on
		$(id).append(html);
		$('#meineZusageDiv' + anfrageId).append(ul);
		$('.collapsible').collapsible({
			accordion : true
		});
		getTerminZusageToZusage(anfrageId);

	});
}

/**
 * gets a zusage 2 to a zusage and adds it to the termin screen 
 */
function getTerminZusageToZusage(anfrageId) {
	$.get(restURL + "/zusage2", {
		anfrageId : anfrageId
	}).done(function(data) {
		var zusage = JSON.parse(data);
		addTerminZusageToZusage(zusage, "#meineZusageZusage" + anfrageId);
	});
}

/**
 * add the zusage 2 to the zusage in the termin screen
 */
function addTerminZusageToZusage(zusage2, id) {
	$.get(restURL + "/user", {
		userId : zusage2.personId
	}).done(function(data) {
		var zusageUser = JSON.parse(data);
		//@formatter:off
		var html = '<li><div class = "collapsible-header" >' + zusageUser.vorname + ' ' + zusageUser.name + '</div><div class = "collapsible-body">'
		+'<p>' + zusage2.comment + '<br><br><a>' + zusage2.telnr + '</a></p>'
		+'</div></li>';
		//@formatter:on
		$(id).append(html);
	});
}

