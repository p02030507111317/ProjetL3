function displayDivInfo(text){
	
    if(text){
         
        //Création d'une div provisoire
        var divInfo = document.createElement('div');
        divInfo.style.position = 'absolute';
        divInfo.style.left = 0 + 'px';
        divInfo.style.top = 0+ 'px';
        divInfo.style.backgroundColor = 'blue';
        divInfo.style.color='white';

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