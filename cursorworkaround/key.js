const cursorCanvas = document.createElement('canvas');
cursorCanvas.width = 32;
cursorCanvas.height = 32;
const cursorCtx = cursorCanvas.getContext('2d');
const cursorImg = new Image();
cursorImg.crossOrigin = 'vecteezy';
cursorImg.src = 'https://64.media.tumblr.com/821cf7001bf745e2ddca3d248163c513/894ac02f0d28ad70-56/s1280x1920/b524d63c6de82323756b1603e624961da509144e.png';
cursorImg.onload = () => {
  cursorCtx.drawImage(cursorImg, 0, 0, 32, 32); // squishes it to 32x32
  document.body.style.cursor = `url(${cursorCanvas.toDataURL()}), auto`;
};