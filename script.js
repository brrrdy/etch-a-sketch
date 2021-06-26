// constants and globals/defaults
const ETCH_GRID_MAX = 128;
const ETCH_PIXEL_WIDTH = 864;
const GRID_ROW_DEFAULT = 16;
let GRID_ROW_COUNT;


function main() {
    const etchPixelWidth = ETCH_PIXEL_WIDTH;

    const resetButton = document.querySelector(".button-reset");
    resetButton.addEventListener("click", function () {
        eraseEtchAndChangeResolution(GRID_ROW_COUNT);
    });

    buildEtchASketch(etchPixelWidth, GRID_ROW_DEFAULT);
}

// build the etch a sketch with given pixel width and row count
function buildEtchASketch(etchPixelWidth, rowCount) {
    // update row count global to persist between erases and rebuilds
    GRID_ROW_COUNT = rowCount;

    const etchContainer = document.querySelector(".etch-container");
    etchContainer.style.width = `${etchPixelWidth}px`;
    etchContainer.appendChild(createEtchGrid(etchPixelWidth, rowCount));
}

// Erase etch and rebuild with new row count (referred to as resolution here. (why did I do that?))
function eraseEtchAndChangeResolution(gridRowCount) {
    // Prompt for new resolution, validate input
    let input = prompt(`Enter new resolution (${ETCH_GRID_MAX} max):`,
                        `${gridRowCount}`); // populate with current grid count
    if (input === null) {
        return; // User canceled prompt
    }
    let newRes = parseInt(input,10);
    if (isNaN(newRes) || newRes > ETCH_GRID_MAX || newRes <= 0 ) {
        alert(`INPUT ERROR: '${input}' is invalid.
Must be a number between 1 and ${ETCH_GRID_MAX}.`);
        return;
    } else if (newRes === 1) {
        alert(`That is valid, but it doesn't make a lot of sense, does it?`);
    }

    // Erase all etched squares by removing css style
    document.querySelectorAll(".etch-square.etched").forEach( (square) => {
        square.classList.remove("etched");
        square.style.backgroundColor = `unset`;
    });

    // Rebuild if new resolution is different
    if (newRes !== gridRowCount) {
        // remove old grid
        let oldGrid = document.querySelector(".etch-grid");
        oldGrid.remove();

        buildEtchASketch(ETCH_PIXEL_WIDTH, newRes);
    }
}

// Initialize the etch grid with given width and return it
function createEtchGrid(pixelWidth, rowCount) {
    const etchGrid = document.createElement("div");
    etchGrid.classList.add("etch-grid");

    // calculate square side length based on pixelWidth and rowCount (plus margins)
    const etchSquarePixelW = calcSquareSideWidth(pixelWidth, rowCount);

    for (let i = 0; i < rowCount; i++) {
        etchGrid.appendChild(createEtchRow(rowCount, etchSquarePixelW, i));
    }

    return etchGrid;
}

// Initialize etch row and return it
function createEtchRow(count, squareSideW, rowNumber) {
    const etchRow = document.createElement("div");
    etchRow.classList.add("etch-row");

    for (let i = 0; i < count; i++) {
        // HINT Use optional contents arg with 'count*(rowNumber)+i'
        // this populates each square with its 0-based row-order index
        etchRow.appendChild(createEtchSquare(squareSideW));
    }

    return etchRow;
}

// Initialize etch square and return it
function createEtchSquare(side, contents = '') {
    const etchSquare = document.createElement("div");
    etchSquare.classList.add("etch-square");
    
    etchSquare.style.width = etchSquare.style.height = `${side}px`;
    etchSquare.textContent = contents;

    etchSquare.addEventListener("mouseover", function (e) {
        etchASquare(e.target);
    });

    return etchSquare;
}

// Darken square rgb if already marked etched, otherwise mark as etched and assign random bg color
function etchASquare(square) {
    if (square.classList.contains("etched")) {
        if (square.style.backgroundColor !== "rgb(0, 0, 0)") {
            square.style.backgroundColor = darkenSquareRgb(square);
        }
    } else {
        square.classList.add("etched");

        let colorRandom = `rgb(${Math.floor(Math.random() * 255)},\
                            ${Math.floor(Math.random() * 255)},\
                            ${Math.floor(Math.random() * 255)})`;
        square.style.backgroundColor = colorRandom;
    }
}

// Problem: the following function uses a magic # 'decrement' which
// results in an inconsistent rate of darkening depending on RGB
//
// Idea: we could have a more gradual darkening by using HSL values
// randomizing hue and saturation and just stepping down Light by 10%...
// This would more closely follow the given spec: 
// "10 passes for the square to be completely black"
//
// To achieve the above spec literally, I believe we could also
// store the original randomized color values in memory or in the
// markup and set the decrement to 10% of the difference between
// original color and 0 (black)

// Darken each rgb value by <decrement> and return rgb string
function darkenSquareRgb(square) {
    const decrement = 20;

    let bgColor = getRgb(square.style.backgroundColor);
    let nc = [];
    bgColor.forEach( (color) => {
        nc.push((color > decrement) ? color-decrement : 0);
    });
    return `rgb(${nc[0]}, ${nc[1]}, ${nc[2]})`;
}

// Return ordered array of RGB values from a given string
// substring stackoverflow cred to diego nunes: https://stackoverflow.com/a/34980846
function getRgb(rgbStr) {
    let values = rgbStr.substring( rgbStr.indexOf(`(`) + 1, rgbStr.length - 1 ).split(', ');
    return values;
}

// Calculate and return size of each etch square (number) in pixels
function calcSquareSideWidth(totalWidthPx, rowCount) {
    let side = totalWidthPx / rowCount;
    return side;
}

main();