'use strict';

// TODO: Render the cinema (7x15 with middle path)
// TODO: implement the Seat selection flow
// TODO: Popup shows the seat identier - e.g.: 3-5 or 7-15
// TODO: Popup should contain seat price (for now 4$ to all) 
// TODO: allow booking the seat ('S', 'X', 'B')
// TODO: Uplift your model - each seat should have its own price... 
// TODO: in seat details, show available seats around 
// TODO: Upload to GitHub Pages

var gElSelectedSeat = null;
var gCinema = createCinema();
renderCinema();

function createCinema() {
    var cinema = [];
    for (var i = 0; i < 7; i++) {
        cinema[i] = [];
        for (var j = 0; j < 15; j++) {
            var cell = {
                type: (j === 7) ? 'X' : 'S',
                isBooked: false,
                price: 2 + 10 * i
            }
            cinema[i][j] = cell
        }
    }
    cinema[4][4].isBooked = true
    return cinema;
}
function renderCinema() {
    var strHTML = '';
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            var cell = gCinema[i][j];
            var title = `Seat: ${i}, ${j}`
            // for cell of type SEAT add seat class
            var className = (cell.type === 'S') ? 'seat' : ''
            // for cell that is booked add booked class
            if (cell.isBooked) {
                className += ' booked'
                title += '-Booked'
            }
            // Add a seat title: `Seat: ${i}, ${j}`
            strHTML += `\t<td title="${title}" class="cell ${className}" 
                            onclick="cellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    var elSeats = document.querySelector('.cinema-seats');
    elSeats.innerHTML = strHTML;
}
function cellClicked(elCell, i, j) {
    var cell = gCinema[i][j]
    // TODO: ignore none seats and booked
    if (cell.type !== 'S' || cell.isBooked) return;
    console.log('Cell clicked: ', elCell, i, j);

    // Support selecting a seat

    elCell.classList.toggle('selected')
    // console.log('elCell.classList.toogle', elCell.classList)
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
        unMarkNeighbors()
    }
    gElSelectedSeat = (elCell !== gElSelectedSeat) ? elCell : null
    // Only a single seat should be selected
    // Support Unselecting a seat
    // TODO: When seat is selected a popup is shown
    if (gElSelectedSeat) {
        showSeatDetails({ i: i, j: j })
    }
}

function showSeatDetails(pos) {
    var emptyNeighbors = findNeighbors(pos); // array 
    markNeighbors(emptyNeighbors);
    var elPopup = document.querySelector('.popup');
    var seat = gCinema[pos.i][pos.j];
    elPopup.querySelector('h2 span').innerText = `${pos.i}-${pos.j}`
    elPopup.querySelector('h3 span').innerText = `$${seat.price}`
    const elBtn = elPopup.querySelector('button')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false;

}
function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function bookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn.dataset);
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j
    gCinema[i][j].isBooked = true
    renderCinema()
    unSelectSeat()
}

function unSelectSeat() {
    hideSeatDetails();
    // TODO: remove 'selected' class and reset el
}


function findNeighbors(pos) {
    var res = [];
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue;
        // console.log('pos i', i)
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gCinema[i].length) continue;
            if (i === pos.i && j === pos.j) continue;
            if (j === 7) continue
            // console.log('pos j', j)
            if (gCinema[i][j].isBooked) continue
            res.push({ i: i, j: j })
        }
    }
    return res;
}

function markNeighbors(positions) {
    for (var idx = 0; idx < positions.length; idx++) {
        // console.log('i', positions[i])
        var elSeat = document.querySelector(`[title="Seat: ${positions[idx].i}, ${positions[idx].j}"]`)
        elSeat.classList.add('empty')
    }
}


function unMarkNeighbors() {
    var elSeat = Array.from(document.querySelectorAll('.empty'));
    var seat;
    elSeat.forEach(seat => seat.classList.remove('empty'));
}

// var ddd = Array.from(document.querySelectorAll('.empty'));
// console.log(ddd)
// ddd.forEach(cell => {
//     cell.classList.remove('empty');
// });
// console.log(ddd)