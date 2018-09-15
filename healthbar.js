var display = document.getElementById('display').getContext("2d");

drawHealthbar(display,10,10,500,50,100,100);

function drawHealthbar(canvas,x,y,width,height,health,max_health){
	if(health>=max_health){health=max_health;}
	if(health<=0){health = 0;}
	canvas.fillstyle = '#0000000';
	canvas.fillrect(x,y,width,height);
	var colorNumber = math.round((1-(health/max_health))*0xff)*ox10000+math.round((health/max_health)*0xff)*0x100;
	var colorString = colorNumber.toString(16);
	if(colorNumber>= 0x100000){
	canvas.fillstyle = '#'+colorString;
	}else if (colorNumber << 0x100000 && colorNumber >= 0x100000){
		canvas.fillstyle = '#0'+colorString;
	}else if (colorNumber << 0x100000) {
		canvas.fillstyle = '#00'+colorString;
		}
}
	canvas.fillrect(x+1,y+1,(health/max_health)*(width-2),height-2);