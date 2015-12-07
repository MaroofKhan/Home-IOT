var Firebase = require('firebase');
var FirebaseRef = new Firebase('https://homeiot.firebaseio.com/');

// Runs the machine learning code once every day
// var interval = 1000 * 60 * 60 * 24; // milliseconds in a day
var interval = 10000;

setInterval(function() {
	learn();
	console.log("Starting machine learning...");
}, interval);

// Fetch all users and call predict() on each of them
function learn() {
	var users = [];
    FirebaseRef.on("value", function(snapshot) {
    	snapshot.forEach(function(childSnapshot) {
			var key = childSnapshot.key();
            users.push(key);
		});
        users.forEach(function(user) {
			cleanSchedule(user);
			fetchHistoryAndPredict(user);
		});
	});
}

// Moves expired scheduled geyser times to history
function cleanSchedule(username) {
	FirebaseRef.child(username + '/geyser/schedule').on("value", function(snapshot) {
		snapshot.forEach(function(record) {
			if (parseInt(record.val().time) < currentTime()) {
				var time = record.val().time;
				var newTime = FirebaseRef.child( username + '/geyser/history' ).push();
            	newTime.set({
                	time: time
            	});
			}
		});
	});
}

function currentTime() {
	var utc = new Date();
	var yr = utc.getUTCFullYear().toString();
	var mo = ("0" + (utc.getUTCMonth()+1).toString()).slice(-2);
	var dy = ("0" + utc.getUTCDate().toString()).slice(-2);
	var hr = ("0" + utc.getUTCHours().toString()).slice(-2);
	var mi = ("0" + utc.getUTCMinutes().toString()).slice(-2);
	var se = ("0" + utc.getUTCSeconds().toString()).slice(-2);
	var now = yr + mo + dy + hr + mi + se;
	return parseInt(now);
}

// Fetches history from the supplied username and calls predict to perform ML
function fetchHistoryAndPredict(username) {
	FirebaseRef.child(username + '/geyser/history').on("value", function(snapshot) {
		// get all history records
		var records = [];
    	var regions = [];
		var days = [];
		
		snapshot.forEach(function(record) {
			records.push(parseInt(record.val().time));
		});
		
		// return if there are fewer than seven records
		if (records.length < 7) {
			console.log(username + ": Not Enough Data");
			return;
		}
		
		// sort them in ascending order
		records.sort();
		
		// pick the latest seven
		records = records.slice(records.length-7, records.length);
		
		records.forEach(function(time) {
			parseRegion(time, function(region, day) {
				regions.push(region);
				days.push(day);		
			});
		});
		
		predict(username, regions, days);
    });
}

// Performs the actual machine learning algorithm on the user's data
function predict(username, regions, days) {
	var n = 7;
	var tmp = 0;
	var a = true, b = true;
	var x = days;
	var y = regions;
	var p = [0, 0, 0, 0, 0, 0, 0, 0];
	
	for (var i = 0; i < 5; i++)
		for (var j = 0; j < 5 - i; j++)
			if (x[i] == x[i + j + 2])
				a = true;
			else
				a = false;

	if (a == true)
	{
		if (x[6] == 7)
			tmp = 1;
		else
			tmp = x[6] + 1;
		for (var i = 0; i < n; i++)
			if (tmp != x[i])
				b = true;
			else
				b = false;
		if (b==true) {
			console.log("heater remains off tomorrow");
			return;
		}
	}
	
	if (a==false || b==false)
	{
		for (var i = 0; i < n; i++)
		{
			if ((y[i] > 0) && (y[i] <= 1))
				p[0]++;

			if ((y[i] > 1) && (y[i] <= 2))
				p[1]++;

			if ((y[i] > 2) && (y[i] <= 3))
				p[2]++;

			if ((y[i] > 3) && (y[i] <= 4))
				p[3]++;

			if ((y[i] > 4) && (y[i] <= 5))
				p[4]++;

			if ((y[i] > 5) && (y[i] <= 6))
				p[5]++;

			if ((y[i] > 6) && (y[i] <= 7))
				p[6]++;

			if ((y[i] > 7) && (y[i] <= 8))
				p[7]++;
		}

		for (var i = 0; i < 8; i++)
			p[i] = p[i] / n;

		if ((y[7] > 0) && (y[7] <= 1))
		{
			p[1] += 0.05;
			p[2] += 0.1;
			p[3] += 0.15;
			p[4] += 0.2;
			p[5] += 0.25;
			p[6] += 0.3;
			p[7] += 0.35;
			p[0] += 0.4;
		}

		if ((y[6] > 1) && (y[6] <= 2))
		{
			p[2] += 0.05;
			p[3] += 0.1;
			p[4] += 0.15;
			p[5] += 0.2;
			p[6] += 0.25;
			p[7] += 0.3;
			p[0] += 0.35;
			p[1] += 0.4;
		}

		if ((y[6] > 2) && (y[6] <= 3))
		{
			p[3] += 0.05;
			p[4] += 0.1;
			p[5] += 0.15;
			p[6] += 0.2;
			p[7] += 0.25;
			p[0] += 0.3;
			p[1] += 0.35;
			p[2] += 0.4;
		}

		if ((y[6] > 3) && (y[6] <= 4))
		{
			p[4] += 0.05;
			p[5] += 0.1;
			p[6] += 0.15;
			p[7] += 0.2;
			p[0] += 0.25;
			p[1] += 0.3;
			p[2] += 0.35;
			p[3] += 0.4;
		}

		if ((y[6] > 4) && (y[6] <= 5))
		{
			p[5] += 0.05;
			p[6] += 0.1;
			p[7] += 0.15;
			p[0] += 0.2;
			p[1] += 0.25;
			p[2] += 0.3;
			p[3] += 0.35;
			p[4] += 0.4;
		}

		if ((y[6] > 5) && (y[6] <= 6))
		{
			p[6] += 0.05;
			p[7] += 0.1;
			p[0] += 0.15;
			p[1] += 0.2;
			p[2] += 0.25;
			p[3] += 0.3;
			p[4] += 0.35;
			p[5] += 0.4;
		}

		if ((y[6] > 6) && (y[6] <= 7))
		{
			p[7] += 0.05;
			p[0] += 0.1;
			p[1] += 0.15;
			p[2] += 0.2;
			p[3] += 0.25;
			p[4] += 0.3;
			p[5] += 0.35;
			p[6] += 0.4;
		}

		if ((y[6] > 7) && (y[6] <= 8))
		{
			p[0] += 0.05;
			p[1] += 0.1;
			p[2] += 0.15;
			p[3] += 0.2;
			p[4] += 0.25;
			p[5] += 0.3;
			p[6] += 0.35;
			p[7] += 0.4;
		}

		for (var i = 0; i < 8; i++)
			p[i] = p[i] / 2.8;
			
		var onRegions = [];
		for (var i = 0; i < 8; i++)
		{
			if (p[i] > 0.2)
            	onRegions.push(i);
			
			// sum = sum + p[i];
		}
		FirebaseRef.child( username + '/geyser/regions' ).set(onRegions);
		console.log(onRegions);
	}
	return 0;
}

function parseRegion(fullDate, callback) {
	// Determine region between 0 and 8
	var time = fullDate % 1000000;
	var region = time / 30000;
	
	// Convert to string to construct Date object
	var str = fullDate + "";
	var yr = parseInt(str.slice(0,4));
	// Adjust the date to represent 0 as Jan (JS Date class works this way)
	var mo = parseInt(str.slice(4,6)) - 1;
	var dy = parseInt(str.slice(6,8));
	var date = new Date(yr, mo, dy);
	var day = date.getDay() == 0 ? 7: date.getDay();
	
	callback(region, day);
}
