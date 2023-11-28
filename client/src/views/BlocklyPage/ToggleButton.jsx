import React, { useEffect } from "react";
import {message} from "antd"
import arrow from './arrow.svg'

export default function attachButton(){



  useEffect(() => {
    var BTN = document.getElementById("ToggleButton");

    //get the object to mount to
    var toolboxMnt = document.getElementsByClassName('blocklyToolboxDiv')[0];

    var ADDBTN = document.getElementById("ADDBTN");

    //attachment
    if(BTN && toolboxMnt){

    toolboxMnt.appendChild(BTN);


    //formatting
    BTN.style.height = 50 + 'px';
    BTN.style.width = 25 + 'px';
    BTN.style.border = 0 + 'px';
    BTN.style.padding = 0 + 'px';
    BTN.style.marginLeft = 70 + 'px'
    BTN.style.flexDirection = 'column';
    BTN.style.display = 'flex';
    BTN.style.transform = 'rotate(' + 180 + 'deg)';

    //Arrow.style.background = 'transparent';
    BTN.style.background = 'transparent';
    }
  })

var toolBoxActive = true;
  var id = null;
  function toggleToolBox(){

    var BTN = document.getElementById("ToggleButton");

    //message.info("Triggered collapse!");

    var toolBox = document.getElementsByClassName("blocklyToolboxDiv");

    var TR = document.getElementById(':0');

    //message.info(toolBox);

    clearInterval(id);
    id = setInterval(frame, .5);
    var width = 30;

    if(toolBoxActive){
      width = 112;
      //need to retract the toolbox into the left side of the screen
      //toolBox.style.left = 
    }
    else{
      width = 30;
      //need to extend the toolbox into the screen
    }

    
    if(toolBoxActive){
        targetRotation = 180;
    }
    else{
        targetRotation = 360;
    }
    rotateID = setInterval(rotate, 1);


    function frame(){
      //message.info(width);
    if(toolBoxActive){
      if(width <= 30){
        if(ADDBTN)
          ADDBTN.style.visibility = 'hidden';

        toolBoxActive = false;
        BTN.style.marginLeft = 0 + 'px'
        TR.style.visibility = 'hidden';

        clearInterval(id);
        return;
      }
        
      width -= 2;
      toolBox[0].style.width = width + 'px';

      BTN.style.marginLeft = (width - 40) + 'px';

      
      //need to retract the toolbox into the left side of the screen
      //toolBox.style.left = 

      //adjust the position of the arrow
      
    }
    else{
      if(width >= 112){
        if(ADDBTN)
          ADDBTN.style.visibility = 'visible';
        toolBoxActive = true;
        BTN.style.marginLeft = 70 + 'px'
        TR.style.visibility = 'visible';
        
        clearInterval(id);
        return;
      }
        
      width += 2;
      toolBox[0].style.width = width + 'px';

      BTN.style.marginLeft = (width - 35) + 'px';

      
      //need to extend the toolbox into the screen
      
    }
  }

}

//var Selected = document.getElementsByClassName();
window.addEventListener("click", () => {
  var toolboxCategories = document.getElementsByClassName("blocklyTreeSelected");
  var BTN = document.getElementById('ToggleButton');

  if(toolboxCategories.length == 0){
    BTN.style.visibility = 'visible';
  }
  else{
    BTN.style.visibility = 'hidden';
  }


})

var rotateID = null;
var targetRotation = 0;
var rotation = 0;

function rotate(){

    var Arrow = document.getElementById("Arrow");
    Arrow.style.transform = 'rotate(' + rotation + 'deg)';
    rotation += 5;
    if(rotation >= targetRotation){
        Arrow.style.transform = 'rotate(' + rotation + 'deg)';
        clearInterval(rotateID);
        if(rotation >= 360)
            rotation = 0;

    }
    //message.info(rotation);
}

return(
<button id="ToggleButton" onClick={toggleToolBox}><img id="Arrow" src={arrow}/></button>
)
}