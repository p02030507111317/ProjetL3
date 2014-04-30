function displayDivInfo(text, number){
	
    if(text){
         
        //Création d'une div provisoire
        var divInfo = document.createElement('div');
        divInfo.style.position = 'absolute';
        divInfo.style.backgroundColor = '#f5f5f5';
        divInfo.style.color='#555';
        divInfo.style.zIndex='11111';
        divInfo.style.borderRadius= 3 + 'px';
        divInfo.style.boxShadow= '3px 5px 10px rgba(0,0,0,0.3)';
        divInfo.style.transition= '800ms ease-out';

        if (number=='1') {
            divInfo.style.left = 58 + '%';
            divInfo.style.top = 16+ '%';

        } else if (number=='2') {
            divInfo.style.left = 62 + '%';
            divInfo.style.top = 30+ '%';

        }else if (number=='3') {
            divInfo.style.left = 65 + '%';
            divInfo.style.top = 38+ '%';

        }else if (number=='4') {
            divInfo.style.left = 65 + '%';
            divInfo.style.top = 54+ '%';

        };

        document.onmousemove = 
        	divInfo.id = 'divInfo';
        	divInfo.innerHTML = text;
        
        document.body.appendChild(divInfo);
    }
    else{
        document.onmousemove = '';
        document.body.removeChild(document.getElementById('divInfo'));
    }
}
