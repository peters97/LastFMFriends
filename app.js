
var Friends = "";
var index = 0;
var currentUser = "";
var div = document.createElement("div"); 

var xhr = new XMLHttpRequest();
xhr.onload = function() {
    var json = xhr.responseText;                         // Response
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
    json = JSON.parse(json);                             // Parse JSON
	
	Friends = json;
	
	processFriends(0);
};

var username = localStorage.getItem("username");
var token = localStorage.getItem("token");

alert(username);
alert(token);

xhr.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=user.getfriends&user=' + username + '&api_key=' + token + '&format=json');
xhr.send();

var recentTrackRequest = new XMLHttpRequest();
var recentTrack = "";

function processFriends(index)
{	
	if(Friends.friends != undefined && index < Friends.friends.user.length)
	{
		var requestLink = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + Friends.friends.user[index].name + '&api_key=' + token + '&format=json';
		currentUser = Friends.friends.user[index].name;
		recentTrackRequest.open('GET', requestLink);
		recentTrackRequest.send();
	}
}


recentTrackRequest.onload = function()
{
	var json = recentTrackRequest.responseText;                         // Response
	json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
	json = JSON.parse(json);                             // Parse JSON
	
	recentTrack = json;
	
	if(isEmpty(recentTrack.recenttracks.track[0]['@attr']) === false)
		var currentSong = currentUser + ": " + recentTrack.recenttracks.track[0].artist['#text'] + " - " + recentTrack.recenttracks.track[0].name;
	
	if(currentSong != undefined)
	{
		div.className = "CurrentFriendActivity";
			document.body.appendChild(div); 
		var songRow = document.createElement("span");
		songRow.className = "songRow";
		songRow.innerHTML = currentSong;
		div.appendChild(songRow);
		var x = document.createElement("BR");
		div.appendChild(x);
	}
	index++;
	
	processFriends(index);
}
// Check if a JSON object is empty
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('credentials');
    link.addEventListener('click', function() {
				alert("Credentials saved!");
	
	// Get entered username from the form by it's ID and save it
	var newusername = document.getElementById("username").value;
	localStorage.setItem('username', newusername)
	
	// Get entered token from the form by it's ID and save it
	var newtoken = document.getElementById("token").value;
	localStorage.setItem('token', newtoken)
    });
});

document.addEventListener('DOMContentLoaded', function() {
	// if the user clicks to get the crendtials, retrieve them from localStorage and append them to the forms
	 var link = document.getElementById('getcredentials');
    link.addEventListener('click', function() {
		getcredentials.style.display='none';
		var usernamefield = document.getElementById("username");
		usernamefield.value=username;

		var tokenfield = document.getElementById("token");
		tokenfield.value=token;
    });
});