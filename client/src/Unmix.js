import React, {useState, useEffect} from 'react'
import './Unmix.css'

function Unmix() {
    const [input1, setInput1] = useState(''); // First input (unmixing color)
    const [input2, setInput2] = useState(''); // Second input (second color if wanted)
    
    const isValidColor = (color) => {
        const s = new Option().style;
        s.backgroundColor = color;
        return s.backgroundColor !== ''; 
      }

    // Output random colors based on one (unmixing color) or two inputs (unmixing + second input)
    const [mode, setMode] = useState('random');
    const getColor = (input, targetColor) => {
      if (!targetColor || !isValidColor(targetColor)) return ['#808080', '#808080'];
      targetColor = targetColor.replace('#', '');
      const r1 = parseInt(targetColor.substring(0,2), 16);
      const g1 = parseInt(targetColor.substring(2,4), 16);
      const b1 = parseInt(targetColor.substring(4,6), 16);
  
      let r2, g2, b2;
      if (!input || input.length === 0) {
          r2 = Math.floor(Math.random() * 256);
          g2 = Math.floor(Math.random() * 256);
          b2 = Math.floor(Math.random() * 256);
      } else {
          input = input.replace('#', '');
          r2 = parseInt(input.substring(0,2), 16);
          g2 = parseInt(input.substring(2,4), 16);
          b2 = parseInt(input.substring(4,6), 16);
      }
  
      const r3 = Math.max(0, Math.min(255, r1 * 2 - r2));
      const g3 = Math.max(0, Math.min(255, g1 * 2 - g2));
      const b3 = Math.max(0, Math.min(255, b1 * 2 - b2));
  
      const toHex = (c) => c.toString(16).padStart(2, '0');
      return [
          `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`,
          `#${toHex(r3)}${toHex(g3)}${toHex(b3)}`
      ];
  };

    const colors_input = getColor(input2, input1);
    const [randomColors, setRandomColors] = useState(['#808080', '#808080']);
    const regenerateRandomColors = () => {
      setRandomColors(getColor("", input1));
    };

    // Purpose of useEffect is to automatically regenerate random colors when random colors button clicked
    useEffect(() => {
      if (mode === 'random') {
        regenerateRandomColors();
      }
    }, [mode, input1]);

    function isColorDark(hex){
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0,2), 16);
      const g = parseInt(hex.substring(2,4), 16);
      const b = parseInt(hex.substring(4,6), 16);
      const luminance = 0.299*r + 0.587*g + 0.114*b;
      return luminance < 128;
    }

    return (
        <div className="container">
            <div className="input-box"> 
              <div // First and only input box (unmixed)
                  className="unmixed"
                  style={{backgroundColor: isValidColor(input1) ? input1 : '#808080'}}
              />
              <input className="color_picker"
                type="color"
                value={input2}
                onChange={(e) => setInput1(e.target.value)}
              />
            </div>

            <div className="results_container">
                <div className="mode_selector">
                  <button onClick={() => { setMode('random'); regenerateRandomColors();}}> random colors </button>
                  <button onClick={() => setMode('input')}> input a color </button>
                </div>

                {/* Random colors functionality */}
                {mode === 'random' ? (
                    <div className = "random_results">
                      <div className = "random_square"> 
                      <div // First random color based on unmixed
                          className={`color_result random-circle ${isColorDark(randomColors[0]) ? 'light-text' : 'dark-text'}`}
                          style = {{backgroundColor: randomColors[0]}}
                          >
                            {randomColors[0] !== '#808080' ? randomColors[0] : ''}
                        </div>
                      </div>
                      
                      <div className = "random_square"> 
                        <div // Second random color based on unmixed
                          className={`color_result random-circle ${isColorDark(randomColors[1]) ? 'light-text' : 'dark-text'}`}
                          style = {{backgroundColor: randomColors[1]}}
                          >
                            {randomColors[1] !== '#808080' ? randomColors[1] : ''}
                        </div>
                      </div>
                    </div>

                    /* Input and random color functionality */
                    ) : (
                        <div className="input_results">
                          <div className="color_pair_row">
                            <div className="input-box">
                            <div // Input circle 
                              className={`color_result input-circle ${isColorDark(colors_input[0]) ? 'light-text' : 'dark-text'}`} 
                              style={{ backgroundColor: colors_input[0] }}
                            />
                              <input className="color_picker"
                                type="color"
                                value={input2}
                                onChange={(e) => setInput2(e.target.value)}
                              />
                            </div>
                          
                          <div className="random_square"> 
                            <div // Random circle (based on unmixed and input)
                              className={`color_result random-circle ${isColorDark(colors_input[1]) ? 'light-text' : 'dark-text'}`} 
                              style={{ backgroundColor: colors_input[1] }}
                            >
                                {colors_input[1] !== '#808080' ? colors_input[1] : ''}

                            </div>
                          </div>
                        </div>
                      </div>
                    )}     
                </div>       
            </div>  
        );
  }

export default Unmix;