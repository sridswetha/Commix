import React, {useState} from 'react'
import './Home.css'

function Home() {
  const [input1, setInput1] = useState(''); // first color to be mixed
  const [input2, setInput2] = useState(''); // second color to be mixed

  // Checking if an input is actually a color (more pertinent when textboxes were used)
  const isValidColor = (color) => {
    const s = new Option().style;
    s.backgroundColor = color;
    return s.backgroundColor !== ''; 
  }

  // Midpoint color logic 
  const getMidpointColor = (input1, input2) => {
    input1.trim(); // get rid of spaces in input
    input2.trim();

    if (input1.length === 7 && input2.length === 7){
      input1 = input1.replace("#", "")
      input2 = input2.replace("#", "")
      const r1 = parseInt(input1.substring(0,2), 16);
      const g1 = parseInt(input1.substring(2,4), 16);
      const b1 = parseInt(input1.substring(4,6), 16);
  
      const r2 = parseInt(input2.substring(0,2), 16);
      const g2 = parseInt(input2.substring(2,4), 16);
      const b2 = parseInt(input2.substring(4,6), 16);
      
      const r = Math.floor((r1 + r2) / 2)
      const g = Math.floor((g1 + g2) / 2)
      const b = Math.floor((b1 + b2) / 2)
      const toHex = (c) => c.toString(16).padStart(2, '0')
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`; // converts to hexcode
    }
    return 'rgba(200, 200, 200, 0.3)'; 
  }

  // Ensures that initial viewing should not have any hex/rgba output in midpoint circle:
  const showMidpointText = isValidColor(input1) && isValidColor(input2) && input1.length === 7 && input2.length === 7;

  const midpoint_color = getMidpointColor(input1, input2);

  // The text of the hexcode displayed in the midpoint box will adjust based on color
  function isColorDark(hex){
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    const luminance = 0.299*r + 0.587*g + 0.114*b;
    return luminance < 128;
  }
  const dark = isColorDark(midpoint_color);

  return (
    <div className="container">
      <div className="mixing-container">
        <div className="color-wrapper">
          <div 
            className="mixing" // First (mixing) input box 
            style={{ backgroundColor: isValidColor(input1) ? input1 : 'rgba(200, 200, 200, 0.3)' }}
            />
          <input
              type="color"
              className="color_picker"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />
        </div>
        <div className="color-wrapper">
          <div className="mixing" // Second (mixing) input box 
            style={{ backgroundColor: isValidColor(input2) ? input2 : 'rgba(200, 200, 200, 0.3)'}}
          />
            <input className="color_picker"
              type="color"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
            />
        </div>
      </div>

      {/*<div className="textbox_box">
        <input 
          type="text" 
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          className="textbox" 
          placeholder="enter hex code"
        />
        <input 
          type="text" 
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          className="textbox" 
          placeholder="enter hex code"
        />
      </div>
      Omitted the textboxes because the color picker already has functionality for hex code input, rgba, and hsf. 
      */
      }

      {/* This is my (mixed) output box*/}
      <div className="midcolor_box">
        <div
          className={`mixed ${isColorDark(midpoint_color) ? 'light-text' : 'dark-text'}`}
          style={{ backgroundColor: midpoint_color }}
        >
      {showMidpointText ? midpoint_color : ''}
    </div>
      </div>
    </div>
  )
}

export default Home