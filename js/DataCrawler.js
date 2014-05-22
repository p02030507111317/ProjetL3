var labelType, useGradients, nativeTextSupport, animate, fd, ctool;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

function add(fd, node, r, f){
  //alert("Entrée");
  $.ajax({
    url: "crawler.php",
    type: "POST",
    dataType: "json",
    //contentType: "json",
    data: {"target":node.id, "mainrule":r, "field":f},
    error: function(xhr, ajaxOptions, thrownError) {
        alert("Error during data collect");
      }
    }).done(function( arg ) {
      var j = arg;
      //alert(JSON.stringify(j));
      for (var i = 0; i < j['noeuds'].length; i++) {
        var newnode = {id: j["noeuds"][i]["id"], name: j["noeuds"][i]["nom"]};
        fd.graph.addAdjacence(node, newnode);
      };
      fd.computeIncremental({  
          iter: 5,  
          property: 'end',  
          onStep: function(perc) {  
            Log.write("loading " + perc + "%");
            
            $("#log").fadeIn("9000") 
            
          },  
          onComplete: function() {  
          Log.write("done");  
          $("#log").fadeIn("2000").fadeOut("2000");
          fd.animate();  
          }  
        });
    });
};

function zoomin(){
  fd.canvas.scale(1.1,1.1);
}

function zoomout(){
  fd.canvas.scale(0.9,0.9);
}

function redraw()
{
  fd.computeIncremental({  
          iter: 5,  
          property: 'end',  
          onStep: function(perc) {  
            Log.write("loading " + perc + "%");
            $("#log").fadeIn("2000");
          },  
          onComplete: function() {  
          Log.write("done");  
          $("#log").fadeIn("2000").fadeOut("2000");
          fd.animate();  
          }  
        });
}

function selectTool(tool)
{
  if(tool)
  {
    if(tool==1)
    {
      document.body.style.cursor = "url(./css/imageBoutton/cursorG.png), auto";
      var elmt = document.getElementById("plus");
      elmt.className = " activeP";
      elmt.style.background = "url('./css/imageBoutton/icroixSelect.png')";
      document.getElementById("deplacer").style.background="url('./css/imageBoutton/ideplacer.png')";
      document.getElementById("deplacer").style.backgroundSize="100% 100%";
      document.getElementById("supp").style.background="url('./css/imageBoutton/supprimer.png')";
      document.getElementById("supp").style.backgroundSize="100% 100%";
      ctool = "add";
    }
    if(tool==2)
    {
      document.body.style.cursor = "url(./css/imageBoutton/cursorD.png), auto";
      var elmt = document.getElementById("deplacer");
      elmt.style.background = "url('./css/imageBoutton/ideplacerSelect.png')";
      document.getElementById("plus").style.background="url('./css/imageBoutton/icroix.png')";
      document.getElementById("plus").style.backgroundSize="100% 100%";
      document.getElementById("plus").className="";
      document.getElementById("supp").style.background="url('./css/imageBoutton/supprimer.png')";
      document.getElementById("supp").style.backgroundSize="100% 100%";
      ctool = null;
    }
    if(tool==3)
    {
      document.body.style.cursor = "url(./css/imageBoutton/cursorR.png), auto";
      var elmt = document.getElementById("supp");
      elmt.style.background = "url('./css/imageBoutton/supprimerSelect.png')";
      document.getElementById("plus").style.background="url('./css/imageBoutton/icroix.png')";
      document.getElementById("plus").style.backgroundSize="100% 100%";
      document.getElementById("plus").className="";
      document.getElementById("deplacer").style.background="url('./css/imageBoutton/ideplacer.png')";
      document.getElementById("deplacer").style.backgroundSize="100% 100%";
      ctool = "del";
    }
  }
}

function dot()
{
  var r = "diGraph {\n";
  fd.graph.eachNode(function (node){
    r = r + "\"" + node.id + "\" [label = \"" + node.name + "\"];\n";
  });
  fd.graph.eachNode(function (node) {
    var pars = node.getParents();
    for (var i = 0; i < pars.length; i++)
    {
      r = r + "\"" + pars[i].id + "\" -> \"" + node.id + "\";\n";
    };
  });
  r = r + "}";
  document.getElementById("areaPop").innerHTML = r;
}

function init(t, n, r, f){

      var elmt = document.getElementById("deplacer"); //petit bug quand on étant le premier noeud..
      elmt.style.background = "url('./css/imageBoutton/ideplacerSelect.png')";
      document.body.style.cursor = "url(./css/imageBoutton/cursorD.png), auto"; 
      
    fd = new $jit.ForceDirected({
    //id of the visualization container
    injectInto: 'container',
    //Enable zooming and panning
    //with scrolling and DnD
    Navigation: {
      enable: true,
      type: 'Native',
      //Enable panning events only if we're dragging the empty
      //canvas (and not a node).
      panning: 'avoid nodes',
      zooming: 10 //zoom speed. higher is more sensible
    },
    // Change node and edge styles such as
    // color and width.
    // These properties are also set per node
    // with dollar prefixed data-properties in the
    // JSON structure.
    Node: {
      overridable: true,
      color:'#FF0000',
      dim: 12
    },
    Edge: {
      overridable: true,
      color: '#23A4FF',
      lineWidth: 0.4
    },
    // Add node events
    Events: {
      enable: true,
      type: 'Native',
      //Change cursor style when hovering a node
      // onMouseEnter: function() {
      //   fd.canvas.getElement().style.cursor = 'move';
      // },
      // onMouseLeave: function() {
      //   fd.canvas.getElement().style.cursor = '';
      // },
      //Update node positions when dragged
      onDragMove: function(node, eventInfo, e) {
        if(!ctool)
        {
          var pos = eventInfo.getPos();
          node.pos.setc(pos.x, pos.y);
          fd.plot();
        }
      },
      onClick: function(node, eventInfo, e) {
        if (node) {
          if(ctool == "add")
          {
            if (node.getData('color') == "#FF0000") {
             Log.write("Waiting for data");
             $("#log").fadeIn("9000") 
              node.setData('color',"#00FF00");
              add(fd, node, r, f);
            };
          }
          if(ctool == "del")
          {
            node.setData('alpha', 0, 'end');
            node.eachAdjacency(function(adj) {
              adj.setData('alpha', 0, 'end');
            });
            fd.fx.animate({
              modes: ['node-property:alpha',
                      'edge-property:alpha'],
              duration: 500
            });
          }
        };
      },
      //Implement the same handler for touchscreens
      onTouchMove: function(node, eventInfo, e) {
        $jit.util.event.stop(e); //stop default touchmove event
        this.onDragMove(node, eventInfo, e);
      },
    },
    //Number of iterations for the FD algorithm
    iterations: 200,
    //Edge length
    levelDistance: 130,
    // This method is only triggered
    // on label creation and only for DOM labels (not native canvas ones).
    onCreateLabel: function(domElement, node){
      // Create a 'name' and 'close' buttons and add them
      // to the main node label
      var nameContainer = document.createElement('span'),
          closeButton = document.createElement('span'),
          style = nameContainer.style;
      nameContainer.className = 'name';
      nameContainer.innerHTML = node.name;
      //closeButton.className = 'close';
      //closeButton.innerHTML = 'x';
      domElement.appendChild(nameContainer);
      //domElement.appendChild(closeButton);
      style.fontSize = "0.8em";
      style.color = "#ddd";
      //Fade the node and its connections when
      //clicking the close button
      // closeButton.onclick = function() {
      //   node.setData('alpha', 0, 'end');
      //   node.eachAdjacency(function(adj) {
      //     adj.setData('alpha', 0, 'end');
      //   });
      //   fd.fx.animate({
      //     modes: ['node-property:alpha',
      //             'edge-property:alpha'],
      //     duration: 500
      //   });
      // };
      //Toggle a node selection when clicking
      //its name. This is done by animating some
      //node styles like its dimension and the color
      //and lineWidth of its adjacencies.
      // nameContainer.onclick = function() {
      //   //set final styles
      //   fd.graph.eachNode(function(n) {
      //     if(n.id != node.id) delete n.selected;
      //     n.setData('dim', 7, 'end');
      //     n.eachAdjacency(function(adj) {
      //       adj.setDataset('end', {
      //         lineWidth: 0.4,
      //         color: '#23a4ff'
      //       });
      //     });
      //   });
      //   if(!node.selected) {
      //     node.selected = true;
      //     node.setData('dim', 17, 'end');
      //     node.eachAdjacency(function(adj) {
      //       adj.setDataset('end', {
      //         lineWidth: 3,
      //         color: '#36acfb'
      //       });
      //     });
      //   } else {
      //     delete node.selected;
      //   }
      //   //trigger animation to final styles
      //   fd.fx.animate({
      //     modes: ['node-property:dim',
      //             'edge-property:lineWidth:color'],
      //     duration: 500
      //   });
      //   // Build the right column relations list.
      //   // This is done by traversing the clicked node connections.
      //   var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
      //       list = [];
      //   node.eachAdjacency(function(adj){
      //     if(adj.getData('alpha')) list.push(adj.nodeTo.name);
      //   });
      //   //append connections information
      //   $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
      // };

	

    
    },
    // Change node styles when DOM labels are placed
    // or moved.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style;
      var left = parseInt(style.left);
      var top = parseInt(style.top);
      var w = domElement.offsetWidth;
      style.left = (left - w / 2) + 'px';
      style.top = (top + 10) + 'px';
      style.display = '';
    }
  });
  var rootnode = {id: t, name: n, data: {color: "#FF0000"}}; 
  fd.loadJSON(rootnode);
  fd.refresh();
}