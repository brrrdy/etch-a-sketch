function main() {
    etchGridWidth = 16;
    
    const etchContainer = document.querySelector(".etch-container");

    etchContainer.appendChild(createEtchGrid(etchGridWidth));
}

// Initialize the etch grid with given width and return it
function createEtchGrid(width) {
    const etchGrid = document.createElement("div");
    etchGrid.classList.add("etch-grid");

    for (let i = 0; i < width; i++) {
        etchGrid.appendChild(createEtchRow(width, i));
    }

    return etchGrid;
}

// Initialize etch row and return it
function createEtchRow(width, number) {
    const etchRow = document.createElement("div");
    etchRow.classList.add("etch-row");

    for (let i = 0; i < width; i++) {
        etchRow.appendChild(createEtchSquare(width*(number)+i));
    }

    return etchRow;
}

// Initialize etch square and return it
function createEtchSquare(contents = '') {
    const etchSquare = document.createElement("div");
    etchSquare.classList.add("etch-square");
    etchSquare.textContent=contents;

    return etchSquare;
}

main();