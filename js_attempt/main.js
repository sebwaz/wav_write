// MADE BY SEBAS :) 
var img;

// screen dims
var w = 850;
var h = 480;

// theremin dims
var numOctaves = 3;
var maxPitch   = 440;

//for rotator
a = 0
b = 0.5*Math.PI
c = 1*Math.PI
d = 1.5*Math.PI

// on init
function setup()
{
  createCanvas(w, h)
  background(0)
  
  // saws 3x osc
  saw1 = new p5.Oscillator('sawtooth');
  saw1.amp(1)
  
  saw2 = new p5.Oscillator('sawtooth');
  saw2.amp(1)
  
  saw3 = new p5.Oscillator('sawtooth');
  saw3.amp(1)
}



// default touch functions
var is_click = false

// If no touchStarted() function is defined, the mousePressed()
// function will be called instead if it is defined.
function touchStarted()
{
    // interpret as mouse click over links areas
    if (touches[0]["y"] >= 0 &&
        touches[0]["y"] <= 1 &&
        touches[0]["x"] >= 0 &&
        touches[0]["x"] <= 1)
    {
        is_click = true
        mousePressed()
    }
    // guarantees no zoom/pan during multitouch
    else { return false }
}



// If no touchEnded() function is defined, the mouseReleased()
// function will be called instead if it is defined.
function touchEnded()
{
    // interpret as mouse click over links
    if (is_click)
    {
        mouseReleased()
        is_click = false
    }
    // guarantees no zoom/pan during multitouch
    else { return false }
}



// convert height to Hz
function heightToHz(currentPos)
{
  return (Math.pow(2, (currentPos-h)/(h/numOctaves)))*maxPitch
}



// make sure one touch at a time
var lock_saw1 = false
var lock_saw2 = false
var lock_saw3 = false

function draw()
{

  /* START OSC */
  
  // check for mouse saw
  if (mouseIsPressed && !lock_saw1)
  {
    lock_saw1 = true
    saw1.start()
  }    
    
  // check for saw1
  if (touchIsDown && !lock_saw1)
  {
    lock_saw1 = true
    saw1.start()
  }
  
  // check for saw2 (saw1 must be active)
  if (touchIsDown && lock_saw1 && !lock_saw2)
  {
    lock_saw2 = true
    saw2.start()
  }
  
  // check for saw3 (saw1 & saw2 must be active)
  if (touchIsDown && lock_saw1 && lock_saw2 && !lock_saw3)
  {
    lock_saw3 = true
    saw3.start()
  }
  
  
  /* MODIFY PITCH */
  
  // if still holding mouse, allow pitch manip
  if (mouseIsPressed)
  {
    // range: [C1, C4]
    saw1.freq(heightToHz(mouseY))
  }  
    
  // if still holding saw1, allow pitch manip
  if (touches[0] !== undefined)
  {
    // range: [C1, C4]
    saw1.freq(heightToHz(touches[0]["y"]))
  }
  
  // if still holding saw2, allow pitch manip
  if (touches[1] !== undefined)
  {
    // range: [C1, C4]
    saw2.freq(heightToHz(touches[1]["y"]))
  }
  
  // if still holding saw2, allow pitch manip
  if (touches[2] !== undefined)
  {
    // range: [C1, C4]
    saw3.freq(heightToHz(touches[2]["y"]))
  }
  
  
  /* END OSC */
  
  // no 3 touch, stop saw3
  if (touches[2] === undefined)
  {
    saw3.stop()
    lock_saw3 = false
  }
  
  // no 2 touch, stop saw2
  if (touches[1] === undefined)
  {
    saw2.stop()
    lock_saw2 = false
  }
  
  // no touch, stop saw1
  if (touches[0] === undefined && !mouseIsPressed)
  {
    saw1.stop()
    lock_saw1 = false
  }
    
    /* CALCULATE XY OFFSETS */
  n = 17*Math.pow(sin(a), 2) * (sin(a) < 0 ? -1 : 1);
  m = 17*Math.pow(cos(a), 2) * (cos(a) < 0 ? -1 : 1);
  
  o = 17*Math.pow(sin(b), 2) * (sin(b) < 0 ? -1 : 1);
  p = 17*Math.pow(cos(b), 2) * (cos(b) < 0 ? -1 : 1);

  q = 17*Math.pow(sin(c), 2) * (sin(c) < 0 ? -1 : 1);
  r = 17*Math.pow(cos(c), 2) * (cos(c) < 0 ? -1 : 1);
    
  s = 17*Math.pow(sin(d), 2) * (sin(d) < 0 ? -1 : 1);
  t = 17*Math.pow(cos(d), 2) * (cos(d) < 0 ? -1 : 1);
    
  /* DRAW SQUARES */
    if (touches[0] !== undefined || mouseIsPressed)
    {
        fill('#FFFFFF')
        rect(604+n, 104+m, 32, 32);
        rect(660+o, 104+p, 32, 32);
        rect(716+q, 104+r, 32, 32);
        rect(604+o, 160+p, 32, 32);
        rect(660+q, 160+r, 32, 32);
        rect(716+s, 160+t, 32, 32);
        rect(604+q, 216+r, 32, 32);
        rect(660+s, 216+t, 32, 32);
        rect(716+n, 216+m, 32, 32);
    }
    else
    {      
        fill('#DE3964')
        rect(604+n, 104+m, 32, 32);
        fill('#fbf8ab')
        rect(660+o, 104+p, 32, 32);
        fill('#135f91')
        rect(716+q, 104+r, 32, 32);
        fill('#f83d44')
        rect(604+o, 160+p, 32, 32);
        fill('#ffb03a')
        rect(660+q, 160+r, 32, 32);
        fill('#054b49')
        rect(716+s, 160+t, 32, 32);
        fill('#b30100')
        rect(604+q, 216+r, 32, 32);
        fill('#ff7935')
        rect(660+s, 216+t, 32, 32);
        fill('#002e2e')
        rect(716+n, 216+m, 32, 32);

        /* INCREMENT */
        a += 0.02;
        b += 0.02;
        c += 0.02;
        d += 0.02;
        
        /* DON'T OVERFLOW */
        a %= 2*Math.PI;
        b %= 2*Math.PI;
        c %= 2*Math.PI;
        d %= 2*Math.PI;
    }
}