/*--THINGS I COULD CHOOSE TO IMPROVE ON:
1) WOULD PREFER TO FIX THE RADIO BUTTON EVENT HANDLER SO THAT IT JUST CHECKS TO SEE WHICH BUTTON IS CURRENTLY CHECKED, AND NOT
ON THE CHANGE, BECAUSE THAT APPEARS TO LEAD TO OCCASIONAL BUGS BETWEEN PAGE REFRESHES
*/

let sketchMode = "1"; //global variable used to store what the current sketch mode is. Controlled by page radio buttons

//*************************************************************************************************************
//Functions used to create and manipulate the etch a sketch grid
//*************************************************************************************************************
    //*************************************************************************************************************
    //Creates the grid for the etch a sketch
    function makeGrid(SideL) {
      const container = document.querySelector('#sketch-container');
      //the two rules below ensure that every cell in the grid is square, and a proportional fraction of the total grid size
      container.style.gridTemplateColumns = `repeat(${SideL}, ${100/SideL}%)`;
      container.style.gridTemplateRows = `repeat(${SideL}, ${100/SideL}%)`;
      //populates the grid space with <div> cells
      for (let i = 0; i < (SideL*SideL); i++ ) {
      let mkDiv = document.createElement('div');
      mkDiv.setAttribute("class", "sketch-pixel");
      container.appendChild(mkDiv);
      }
    }
    //*************************************************************************************************************
    //removes the grid from the etch a sketch
    function removeGrid() {
      const container = document.querySelector('#sketch-container');
      while (container.firstChild) {
        container.removeChild(container.lastChild);
      }

    }
    //*************************************************************************************************************
    //makes a grid with a user specified side length
    function customGrid() {
      let sideLength = prompt("Enter the amount of pixels on the new grid's side...")

      //type check to ensure user enters a valid number
      if (+sideLength === parseInt(sideLength)) {

        //if user chose a sidelength greater than 100 pixels, restrict grid to 100 pixels in side length (just gets hard to see beyond that)
        if (+sideLength >= 100) {
          sideLength = 100;
          alert("grid size restricted to 100 cells per side");}

        //replace the previous grid with a new one and refresh the event handler for the new grid
        removeGrid();        
        makeGrid((sideLength));
        eventRefresh();
      }
      else {
        //informs user that their prompt answer was invalid
        alert("That is not a valid number.");
      }
    }

    //*************************************************************************************************************
    //clears out the whole grid
    function clearGrid() {
    let pixelGrid = document.querySelectorAll('.sketch-pixel');
      //iterates through the node list and removes all dynamic coloring classes and styles
      pixelGrid.forEach((pixel) => {
        pixel.classList.remove("darkerEveryHover");
        pixel.classList.remove("randomColor");
        pixel.classList.remove("on-pixel");
        pixel.style.backgroundColor = "";
      });
    }
    //*************************************************************************************************************
    //simple function to get an integer from between 2 numbers
    function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

  //*************************************************************************************************************
  //Event handlers
  //*************************************************************************************************************
  //*************************************************************************************************************
  //attaches new event listeners to each cell in the new grid
  function eventRefresh() {
      //event handlers used to control the etch a sketch through an array-like object
      let pixelGrid = document.querySelectorAll('.sketch-pixel');
      //iterates through the node list and checks to see if the mouse has entered a pixel
      pixelGrid.forEach((pixel) => {
        pixel.addEventListener('mouseover', () => {
          //if "black" radio button is selected then this mode simply turns pixels off and on.
          if (sketchMode == "1") {
          //three rules below allow "black" to draw over dimmer and random color
          pixel.classList.remove("darkerEveryHover");
          pixel.classList.remove("randomColor");
          pixel.style.backgroundColor = "";
          pixel.classList.toggle("on-pixel");
          }

          //if "dimmer" radio button is selected, then everytime the mouse hovers over the cell it becomes greyscale and 10% darker
          else if (sketchMode === "2") {
            if (pixel.classList.contains("randomColor")) {pixel.classList.remove("randomColor");}
            if (!pixel.classList.contains("darkerEveryHover")){
              pixel.classList.add("darkerEveryHover");
            }
              else {
                //getComputedStyle is a read only function, so 2 variables are needed to acquire the css rule for background color rgb values
                let style = getComputedStyle(pixel);
                let backgroundColor = style.backgroundColor;
                //takes the css rgb values for background and puts their string values into an array
                let currentRGBValues = backgroundColor.slice(4,backgroundColor.length -1);
                currentRGBValues = currentRGBValues.split(", ");
                //creates a stepdown value that is 25 units darker in rgb values than the current rgb values
                let nextDarkerStep = parseInt(currentRGBValues[0] -25);
                //updates the background color css rule with the new rgb value
                pixel.style.backgroundColor = `rgb(${nextDarkerStep},${nextDarkerStep},${nextDarkerStep}`;
              }
            }
          //if "Random Color" radio button is selected every cell the mouse moves over gets a new random color
          else if (sketchMode === "3") {
            pixel.style.backgroundColor = "";
            pixel.classList.add("randomColor");
            pixel.style.backgroundColor = `rgb(${randomIntFromInterval(0,255)},${randomIntFromInterval(0,255)},${randomIntFromInterval(0,255)})`;           
          }
        });
      });
  }
  //*************************************************************************************************************
  //listens to see if the user selects a different drawing mode
  let radioButtons = document.querySelectorAll('.mode');
  radioButtons.forEach((radio) => {
    radio.addEventListener('change', () => {
      sketchMode = radio.value;
      });
  });

    //upon first page load this populates the webpage with a 4x4 grad  
    makeGrid(4);
    eventRefresh();
