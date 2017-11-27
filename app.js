document.addEventListener('DOMContentLoaded', function() {

	var username = "";
	var token = "";
	var table = document.createElement("table"); 
	var header = document.createElement("h2");
	header.className = "friends-header text-colour-link";
	header.innerHTML = "Friend Activity";
	table.appendChild(header);

	var active = document.getElementById("friendActivity");
	chrome.storage.local.get('username', function (result) {
		username = result.username;
	});
	
	chrome.storage.local.get('token', function (result) {
		token = result.token;
		start();
	}); 
	
	setInterval(function(){ 
		active = document.getElementById("friendActivity");
		if(active == null || active.length < 1)
		{
			start();
		}
	}, 5000);
	
	setInterval(function(){ 
		if(active != undefined)
		{    
			start();
		}
	}, 30000);
	
	function start()
	{		
		var Friends = "";
		var index = 0;
		var currentUser = "";

		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var json = xhr.responseText;                         // Response
			json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
			json = JSON.parse(json);                             // Parse JSON
			
			Friends = json;
		
			if(active != null)
			{
				active.innerHTML = "";
				table.appendChild(header);
			}
			processFriends(0);
		};

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
			
			recentTrackJson = json;

			var recentTrack = recentTrackJson.recenttracks.track;
			
			if(isEmpty(recentTrack[0]['@attr']) === false)
				var currentSong = "<a href='https://www.last.fm/user/" + currentUser + "'>" +
								  currentUser + "</a> " + "<a class='artist-name' href='https://www.last.fm/music/" +  
								  recentTrack[0].artist['#text'] + "'>" +
								  recentTrack[0].artist['#text'] + "</a> - " + 
								  "<a class='track-name' href='https://www.last.fm/music/" +  
								  recentTrack[0].artist['#text'] + "/_/" + recentTrack[0].name + "'>" +  
								  recentTrack[0].name + "</a>"
			
			if(currentSong != undefined)
			{
				var tet = document.getElementById("recent-tracks-section");
				table.className = "current-friend-activity  chartlist-name";
				table.id = "friendActivity";
				// document.body.appendChild(table); 
				var songRow = document.createElement("tr");
				songRow.className = "js-link-block js-focus-controls-container chartlist-row--even";			
				var songRowItem = document.createElement("td");
				songRowItem.className = "song-row chartlist-ellipsis-wrap";
				songRowItem.innerHTML = currentSong;
				songRow.appendChild(songRowItem);
				table.appendChild(songRow);
				
				tet.appendChild(table);
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
	}

	var link = document.getElementById('getcredentials');
	link.addEventListener('click', function() {
		getcredentials.style.display='none';
		var usernamefield = document.getElementById("username");
		usernamefield.value=username;

		var tokenfield = document.getElementById("token");
		tokenfield.value=token;
	});
	
	var link = document.getElementById('credentials');
	link.addEventListener('click', function() {		
		// Get entered username from the form by it's ID and save it
		var newusername = document.getElementById("username").value;
		chrome.storage.local.set({'username': newusername}, function (result) {
		});
	
		// Get entered token from the form by it's ID and save it
		var newtoken = document.getElementById("token").value; 
		chrome.storage.local.set({'token': newtoken}, function (result) {
		});
	});
});