const Colors = {
  backgroundColor: '#BFDCE5',
  btnColor: '#103164',
  deleteColor: '#FF605C',
  secondaryColor: '#72B2C9',
  thirdColor: '#DAF0F3',
};

function hexToRGB(hex) {
  let r = 0,
    g = 0,
    b = 0;
  // Jika panjang hex adalah 7 (termasuk #), konversi ke RGB
  if (hex.length == 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return {r, g, b};
}
const btnColorRGB = hexToRGB(Colors.btnColor);
Colors.btnOpacity = `rgba(${btnColorRGB.r}, ${btnColorRGB.g}, ${btnColorRGB.b}, 0.6)`;

export {Colors};
