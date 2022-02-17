"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.trigger("reset");
  $("#error-message").empty();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** show profile on click on "user" on NAV bar */


function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);

/** Show story submit form on clicking story "submit" */
function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $submitForm.show();
  

}

$navSubmitStory.on("click", navSubmitStoryClick);

/** Shows all the favorite stories  */
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
}


$body.on("click", "#nav-favorites", navFavoritesClick);

/** Show My Stories on clicking */

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  
}

$body.on("click", "#nav-my-stories", navMyStories);