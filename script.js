const canvas = document.getElementById('coloringCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');

canvas.addEventListener('click', (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const fillColor = hexToRgb(colorPicker.value);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    floodFill(imageData, x, y, fillColor);
    ctx.putImageData(imageData, 0, 0);
});

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function floodFill(imageData, x, y, fillColor) {
    const { width, height, data } = imageData;
    const targetColor = getColorAtPixel(data, x, y, width);
    if (colorsMatch(targetColor, fillColor)) return;

    const stack = [{ x, y }];
    while (stack.length) {
        const { x, y } = stack.pop();
        const currentColor = getColorAtPixel(data, x, y, width);
        if (!colorsMatch(currentColor, targetColor)) continue;

        setColorAtPixel(data, x, y, fillColor, width);

        if (x > 0) stack.push({ x: x - 1, y });
        if (x < width - 1) stack.push({ x: x + 1, y });
        if (y > 0) stack.push({ x, y: y - 1 });
        if (y < height - 1) stack.push({ x, y: y + 1 });
    }
}

function getColorAtPixel(data, x, y, width) {
    const index = (y * width + x) * 4;
    return {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        a: data[index + 3],
    };
}

function setColorAtPixel(data, x, y, color, width) {
    const index = (y * width + x) * 4;
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = 255; 
}

function colorsMatch(color1, color2) {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b && color1.a === color2.a;
}

const img = new Image();
img.src = '/imagen/floralis.png'; 
img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
