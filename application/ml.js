
function learn() {
            
	// number of records
	var n = 7;
        
	// 1 twice indicates that geyser used twice 
	// var x = [ 1, 1, 2, 2, 3, 4, 5 ];
	
	// 0 to 1: 6AM to 9AM
	// 1 to 2: 9AM to 12PM
	// 2 to 3: 12PM to 3PM
	// 3 to 4: 3PM to 6PM
	// 4 to 5: 6PM to 9PM
	// 5 to 6: 9PM to 12AM
	// 6 to 7: 12AM to 3AM
	// 7 to 8: 3AM to 6AM 
    var y = [ 0.5, 5.5, 0.5, 5.5, 0.5, 0.5, 5.5 ];

	// probability of using geyser in one of the eight regions
	var p = [ 0, 0, 0, 0, 0, 0, 0, 0 ];

	var sum = 0;
	
	// counts the number of times geyser used in all the regions 	
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

	// calculates the probabilities
	for (var i = 0; i < 8; i++)
		p[i] = p[i] / n;

	// adds to the probability of turning geyser on based on the last day's usage
	if ((y[7]>0) && (y[7]<=1))
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

	if ((y[6]>1) && (y[6] <= 2))
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

	if ((y[6]>2) && (y[6] <= 3))
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

	if ((y[6]>3) && (y[6] <= 4))
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

	if ((y[6]>4) && (y[6] <= 5))
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

	if ((y[6]>5) && (y[6] <= 6))
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

	if ((y[6]>6) && (y[6] <= 7))
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

	if ((y[6]>7) && (y[6] <= 8))
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
	
	// 
	for (var i = 0; i < 8; i++)
		p[i] = p[i] / 2.8;

	// 
	for (var i = 0; i < 8; i++)
	{
		cout << p[i] << endl;
		if (p[i] > 0.2)
			cout << " heater on at " << i << endl;
		sum = sum + p[i];
	}

	cout << sum;
	getchar();
	return 0;
}
