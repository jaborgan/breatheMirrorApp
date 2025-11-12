//ramp code:
let customGlobalVariable; // The variable that holds the current, smoothly-ramped value
let targetValue;          // The next random value to ramp towards
let startValue;           // The value at the start of the ramp
let startTime;            // Time (in milliseconds) when the current ramp started

const MIN_VAL = 0.022;    // Minimum value for the random range
const MAX_VAL = 0.550;    // Maximum value for the random range
let durationSlider;
// const RAMP_DURATION = 10000; // 15 seconds in milliseconds
//end ramp code

let breatheFont;

let huexH = 0;
let huexS = 0;
let huexL = 0;

let hueyH = 0;
let hueyS = 0;
let hueyL = 0;

let startAngle = 0;
let angleVel = 0.2;

function preload(){
breatheFont = loadFont('aladin.ttf');
}

function setup() {
  
  createCanvas(640, 400);
  colorMode(HSL, 360, 100, 100, 100);
  frameRate(60);
  rectMode(CENTER);
  blendMode(BLEND);
  textFont(breatheFont);
  textSize(17);
  
  //create slider for ramp_duration
  //range 1 second to 60 seconds
  durationSlider = createSlider(1, 60, 15, 1);
  //starts at 15, tep of 1 sec
  durationSlider.position(10, height+10);
  
  //initialize first target and set starting state
  targetValue = random(MIN_VAL, MAX_VAL);
  customGlobalVariable = targetValue; // Start at the first target
  startValue = targetValue;
  startTime = millis();
  //slider

   
}

function draw() {
  background(0,1);
  textSize(17);
  
  const RAMP_DURATION_SEC = durationSlider.value();
  const RAMP_DURATION_MS = RAMP_DURATION_SEC * 1000;
  
  let currentElapsed = millis();
  let elapsedTime = currentElapsed - startTime;
  
   // 1. Check if it's time for a new target value
  if (elapsedTime >= RAMP_DURATION_MS) {
    // The 15-second hold/ramp is over. Start a new cycle.
    
    // The current customGlobalVariable is the final value of the last ramp, 
    // which becomes the starting value for the next ramp.
    startValue = customGlobalVariable; 
    
    // Generate a new random target value
    targetValue = random(MIN_VAL, MAX_VAL);
    
    // Reset the timer
    startTime = currentElapsed;
    elapsedTime = 0; // Reset elapsed time for the new ramp
  }
  
  // 2. Calculate the current value using the logarithmic ramp
  
  // Calculate the normalized time (t) for the ramp (0.0 to 1.0)
  let t = map(elapsedTime, 0, RAMP_DURATION_MS, 0, 1);
  
  // Clamp t to ensure it doesn't go over 1.0, which would happen at the end of the 15s cycle
  t = constrain(t, 0, 1);
  
  // Apply the logarithmic easing function to the normalized time
  let easedT = easeInOutLog(t);
  
  // Interpolate between the start and target values using the eased time
  customGlobalVariable = lerp(startValue, targetValue, easedT);
  
  // 3. Display the current value and time remaining
  
  // Calculate time remaining in seconds
  let timeRemaining = (RAMP_DURATION_MS - elapsedTime) / 1000;
  timeRemaining = max(0, timeRemaining); // Ensure it doesn't show negative time
  
  

  startAngle += 0.01666;
  let angle = startAngle;
  //angleVel = map(mouseX, 0, width, 0.044, 0.770, 10000);
  angleVel = customGlobalVariable;

  for (let x = 0; x <= width; x += 1) {
    let y = map(sin(angle), -1, 1, 0, height);
    stroke(0, 100);
    hueyH = map(y, 0, height, 175, 250)
    fill(hueyH, 50, 50, 25);
    strokeWeight(1);
    ellipse(x, y, 10, 0.5*(map(y, 0, height, 10, 300)));
    angle += angleVel;
  }
    for (let x = 0; x <= width; x += 1.5) {
    let y = map(cos(angle), -1, 1, 0, height);
    stroke(0);
    fill(0, 50);
    strokeWeight(1);
    //ellipse(x, y, 8, 0.25*(map(x, 0, height, 10, 30)));
    angle += angleVel/0.2;
  }
  
  for (let x = 0; x <= width; x += 6) {
    let y = 0.2*map(noise(angle), -1, 1, 0, height);
    stroke(0);
    fill(0, 255, 200, 50);
    strokeWeight(0.5);
   // ellipse(y , x, 48, 48);
    angle += angleVel;
  }
  
  fill(0, 0, 0, 50)
  rect(133, 30, 265, 45, 20);
 
  fill(255, 100, 100, 100);
  text("Angle Velocity: "+ angleVel, 5, 22)
  text("Frame #: "+round(frameCount), 5, 40)
  text("seconds: "+second(), 90, 40);
  text("millisecs:"+millis(), 180, 40)
  fill(255, 60)
  rect(width-90, height-45, 164, 80, 20)
  fill(0);
  text(`Current Value: ${nf(customGlobalVariable, 1, 3)}`, width -140, height -60);
  text(`Target Value: ${nf(targetValue, 1, 3)}`, width-140, height - 40);
  text(`Time to Next Change: ${nf(timeRemaining, 1, 1)}s`, width-166, height -20);
  strokeWeight(4);
  textSize(30);
  stroke(255,100,100);
  fill('cornflowerblue')
  text('Breath Rate: Every '+RAMP_DURATION_SEC+' Seconds.', 5, height-25)
  
}

function mouseDragged(){
  //blendMode(DIFFERENCE);
  fill('deeppink');
  
  rect(mouseX-25, mouseY-25, 1200, 100, 30);
}


// --- Logarithmic Easing Function (Ease In/Out) ---
// This function creates a smooth, S-shaped curve for the transition,
// which gives the "logarithmic ramp" or "ease in and out" effect.
function easeInOutLog(t) {
  // t is the normalized time (0 to 1)
  // We use a power function (t^3) for a strong ease-in/ease-out effect.
  // The function is split into two halves for the S-curve.
  if (t < 0.5) {
    return 4 * t * t * t; // Ease in (slow start)
  } else {
    let f = ((2 * t) - 2);
    return 0.5 * f * f * f + 1; // Ease out (slow end)
  }
}
