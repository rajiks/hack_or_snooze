"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let updateStoryId;
/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  hidePageComponents(); 
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showBtn = false) {
  // console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();

  return $(`
      <li id="${story.storyId}">
      ${showBtn ? getBtnHTML() : ""}
      ${(currentUser !== undefined) ? getStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


/** Make delete button HTML for story */

function getBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>&nbsp
      </span>  <span class="update-icon">
      <i class="fas fa-edit"></i>&nbsp
    </span>`;
}


/** show favorite star for story */

function getStar(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}


/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);


/** Handle updating a story. */

async function updateStory(evt) {
 
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  const story = await Story.getStory(currentUser,storyId);

  $("#update-author").attr("value",story.author);
  $("#update-title").attr("value",story.title);
  $("#update-url").attr("value",story.url);
  updateStoryId = story.storyId;
  $updateForm.show();
 
}

$ownStories.on("click", ".update-icon", updateStory);

async function updateStoryClick(){
  console.debug("updateStory");
  const title = $("#update-title").val();
  const url = $("#update-url").val();
  const author = $("#update-author").val();
  const storyData = {title, url, author};
  await storyList.editStory(currentUser,updateStoryId, storyData);
  hidePageComponents();
  // re-generate story list
  putUserStoriesOnPage();
}

$updateForm.on("submit", updateStoryClick);

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** submitting new story form. */

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username
  const storyData = {title, url, author, username };
  const story = await storyList.addStory(currentUser, storyData);
  
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $allStoriesList.show();
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", submitNewStory);


/** favorite/un-favorite a story */
 async function addRemoveFavorite(evt) {
  console.debug("addRemoveFavorite");
  
  const $check = $(evt.target);
  const $closestLi = $check.closest("li");
  
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId );

  if ($check.hasClass("fas")){
    await currentUser.removeFavoriteStory(story);
    $check.toggleClass("fas far");
  }else{
    await currentUser.addFavoriteStory(story);
    $check.toggleClass("fas far");  }


}

$storiesLists.on("click", ".star", addRemoveFavorite);


/** List all the favorites  */

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");
  $favoritedStories.empty();
  if (currentUser.favorites.length === 0){
    $favoritedStories.append("<h5>No favorites added!</h5>");
  }else{
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}


/** list all the stories of the current user */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();
  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story,true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}