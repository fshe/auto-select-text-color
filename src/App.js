import React from 'react';
import { SketchPicker } from 'react-color';
import './App.css';

const getContrastRatio = (brighterLuminance, darkerLuminance) => {
  return (brighterLuminance + 0.05) / (darkerLuminance + 0.05);
};

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// https://www.w3.org/TR/WCAG20/#relativeluminancedef
const getLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);

  const RsRGB = r / 255;
  const GsRGB = g / 255;
  const BsRGB = b / 255;

  let R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow(((RsRGB+0.055)/1.055), 2.4);
  let G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow(((GsRGB+0.055)/1.055), 2.4);
  let B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow(((BsRGB+0.055)/1.055), 2.4);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

const calculateForegroundColor = (backgroundColor) => {
  // Calculate contrast ratio for both black and white, and pick the ratio that's larger.
  const luminance = getLuminance(backgroundColor);
  const withWhiteText = getContrastRatio(1, luminance);
  const withBlackText = getContrastRatio(luminance, 0);
  return withWhiteText > withBlackText ? '#FFF' : '#000';
};

const calculateForegroundColorSimple = (backgroundColor) => {
  const { r, g, b } = hexToRgb(backgroundColor);
  if ((r*0.299 + g*0.587 + b*0.114) > 186) {
    return "#000";
  }

  return "#FFF";
};

function App() {
  const [backgroundColor, setBackgroundColor] = React.useState('#FFF');
  const [isSimpleAlgorithm, setIsSimpleAlgorithm] = React.useState(true);

  return (
    <div className="App" style={{ padding: '20px' }}>
      <button onClick={() => setIsSimpleAlgorithm(val => !val)}>
        {isSimpleAlgorithm ? 'Use W3C algorithm' : 'Use simple algorithm'}
      </button>
      <SketchPicker color={backgroundColor} onChange={(color) => setBackgroundColor(color.hex)} />
      <div style={{
        marginTop: '16px',
        backgroundColor,
        border: '1px solid black',
      }}>
        <p style={{
          color: isSimpleAlgorithm ? calculateForegroundColorSimple(backgroundColor) : calculateForegroundColor(backgroundColor)
        }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  );
}

export default App;
