function displayDivExemple(text){
	
    if(text){
         
        //Création d'une div provisoire
        var divExemple = document.createElement('div');
        divExemple.style.position = 'absolute';
        divExemple.style.right = 0 + 'px';
        divExemple.style.top = 0+ 'px';
        divExemple.style.backgroundColor = 'green';
        divExemple.style.color='white';

        document.onmousemove = 
        	divExemple.id = 'divExemple';
        	divExemple.innerHTML = text;
        
        document.body.appendChild(divExemple);
    }
    else{
        document.onmousemove = '';
        document.body.removeChild(document.getElementById('divExemple'));
    }
}