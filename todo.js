'use strict';

// Remove the default cards if cards are present in the localStorage object
if (localStorage.cards) {
  $('.cards').children().remove();
  $('.cards').append(JSON.parse(localStorage.getItem('cards')));
}

// Delete the existing cards and add the new cards
// Simpler than pushing/splicing an array
const setStorage = () => {
  localStorage.removeItem('cards');
  localStorage.setItem('cards', JSON.stringify($('.cards').html()));
};

// Wrap or unwrap the card title in del tags for a strikeout effect
// $('.cards').on('click', '#done', () => {
//   if ($(event.target). next().is($('del'))) {
//     $(event.target).next().children().unwrap();
//     setStorage();
//   } else {
//     $(event.target).next().wrap('<del></del>');
//     setStorage();
//   }
// });

// Delete the selected card and update localStorage
$('.delete').on('click',
 () => {
  console.log("-_-")

  //$(event.target).offsetParent().remove();
  //setStorage();
});

// Remove Tile


// Append new card on submit and update localStorage
$('form').on('submit', (event) => {
  event.preventDefault();
  const title = $('input').val();
  const card = `
    <div class="card">
      <div class="card-block">
          <p class="card-title lead">${title}</p>
        <button id="delete" type="button" class="btn btn-link float-right">❌</button>
        <button id="done" type="button" class="btn btn-link float-right mr-3">✔️</button>
      </div>
    </div>
  `;
  $('.cards').append(card);
  // Reset the form input field
  $('form').trigger('reset');
  setStorage();
});

// Append new card on submit button
$('form').on('click', '#submit', () => {
  event.preventDefault();
  const title = $('input').val();
  const card = `
    <div class="card">
      <div class="card-block">
          <p class="card-title lead">${title}</p>
        <button id="delete" type="button" class="btn btn-link float-right">❌</button>
        <button id="done" type="button" class="btn btn-link float-right mr-3">✔️</button>
      </div>
    </div>
  `;
  $('.cards').append(card);
  // Reset the form input field
  $('form').trigger('reset');
  setStorage();
});