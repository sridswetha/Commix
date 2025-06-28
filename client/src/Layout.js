import { Outlet, Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import './Layout.css'
import add from './add.png';
import imagey from './imagey.png';


function Layout() {
  const [showModal, setShowModal] = useState(false); // a pop up for color picking options
  const [showColors, setShowColors] = useState(false); // another pop up for color picking from a color picker
  const [showImage, setShowImage] = useState(false); // another pop up for color picking from an image

  // Change color on a colorpicker
  const [color, setColors] = useState('#ffffff'); 
  function handleColorChange(newColor){ 
    setColors(newColor)
  }
  const [image, setImage] = useState();
  const [pickedColor, setPickedColor] = useState(null);

  // Storing and colors onto the palette at the bottom
  const [paletteColors, setPaletteColors] = useState([]); 
  function addColors(newColor){
    setPaletteColors(prevColors => [...prevColors, newColor])
  }

  // Remove colors from pallette
  function removeColors(i){
    setPaletteColors(prevColors => prevColors.filter((_, idx) => idx !== i));
  }

  // When a color from the pallette is chosen, it will automatically be copied
  const [copied, setCopied] = useState(false);
  function copyHex(hex){ 
    navigator.clipboard.writeText(hex) /* use this API to copy text! */
      .then(() => {
        console.log("hex copied to clipboard:", hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500)
      })
      .catch((err) => {
        console.error("hex copy failed", err);
      });
  }

  // Drawing a selected image onto a canvas
  const canvasRef = useRef(null);
  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [image]);

  // Functionality for us to choose each individual pixel of an image to obtain color hex
  function handleCanvasClick(e) { // Credit: chatgpt
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
  
    // Get mouse click coordinates relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    // Get scale factor between canvas size on screen vs real drawing size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
  
    // Convert to real image coordinates
    const realX = Math.floor(x * scaleX);
    const realY = Math.floor(y * scaleY);
  
    // Get pixel data
    const pixel = ctx.getImageData(realX, realY, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
  
    const toHex = (val) => val.toString(16).padStart(2, '0');
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  
    setPickedColor(hex);
  }

  function isColorDark(hex){
    if (!hex || typeof hex !== 'string') return false; 
  
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    const luminance = 0.299*r + 0.587*g + 0.114*b;
    return luminance < 128;
  }
  

  return (
    <div className="container">
      <div className="text-container"> 
        <h1>commix</h1>
        {/* This is to get a little help button next to header */}
        <span className="tooltip">
          <span className="circle-icon">?</span>
          <span className="tooltiptext">click on a circle with a white halo to pick a color</span>
        </span>
      </div>

      {/* Links to my mix page and unmix page */}
      <div className="buttons">
        <Link to="/" className="mix">
          <button id="mix">mix</button>
        </Link>
        <Link to="/unmix" className="unmix">  
          <button id="unmix">unmix</button>
        </Link>
      </div>
      <Outlet />

      {/* Bottom color palette code */}
      {copied && (<div className="toast">hex code copied!</div>)}
      <div className="palette">
        <div className="scrollable"> 
          <div className="add">  
            {/* Add button opens up a pop up with two options (add from picker, add from image) */}
            <button onClick={() => setShowModal(true)}>
              <img src={add} alt="add"></img>
            </button>
          </div>

          {paletteColors.map((color, idx) => {
            const dark = isColorDark(color);
              return(
                <div key={idx} className="colored-box-box"> {/* Add a color to palette when */}
                  <div
                    key={idx}
                    className="colored-box"
                    style = {{ backgroundColor : color }}
                    onClick ={() => copyHex(color)}> {/* When box clicked, copy hex color */}
                    <span style={{ color: dark ? 'white' : 'black', pointerEvents: 'none' }}>
                      {color}
                    </span>
                    <button className="remove"  // When x button clicked, remove box from palette
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColors(idx);
                        }}
                      >
                      x
                    </button>
                  </div>
                </div>
                );

          })}
        </div>
      </div>

      {showModal && (
        <div className="modal"> 
          <div className="modal-content">
            {showColors ? ( // Opens up modal for color picker to add color from to palette
              <div className="color-container">
                <div className="color-picker">   
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(e.target.value)}
                    />
                </div>
              <div className="color-picker-buttons">
                <button id="add_color" onClick={() => addColors(color)}>add color to palette</button> 
                <button className="remove" id="main_exit" onClick={() => {
                  setShowColors(false)
                  setShowModal(false)
                  }}>
                x
                </button>
              </div>
            </div>
              
            ) : showImage ? ( // Opens up modal to choose colors from an image
              <div className="image-buttons">
                <div className="image-container">
                  <div id="add_color" className="file-input-wrapper">
                    <label className="custom-file-upload">
                      choose an image
                      <input 
                        type="file" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImage(reader.result); 
                          };
                          if (file){
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  </div>  
                    {image && 
                      <canvas 
                        ref={canvasRef}
                        className="upload-canvas" 
                        // Allows us to click on pixels of image drawn over canvas to get colors
                        onClick={handleCanvasClick} />
                    } 
                    
                  <div className="color-display-container">
                    <div
                      className="picked-color-box"
                      style={{ backgroundColor: pickedColor || "transparent" }}
                    />
                    <label className="custom-file-upload">
                      <button
                        id="add_color"
                        onClick={() => addColors(pickedColor)}
                        style={{ all: 'unset', cursor: 'pointer' }}
                      >
                        add color to palette
                      </button>
                    </label>
                  </div>
                <button className="remove" id="main_exit" onClick={() => { // Exit both modals
                  setShowImage(false)
                  setShowModal(false)
                  }}>
                x
                </button>
                </div>
              </div>
            ): (
              <>
              {/* On main modal: add from picker button, color picker modals pop up*/}
              <button className="small-button" id="color" onClick={() => setShowColors(true)}>
                <img src={add} alt="add" /> 
              </button>
              {/* On main modal: add colors from image button, image modal pops up*/}
              <button className="small-button" id="color" onClick={() => setShowImage(true)}>
                <img src={imagey} alt="imagey" />
              </button>  
                <button className="remove" id="main_exit" onClick={() => { // Exit the main modal
                  setShowModal(false)
                }}>
                  x
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout