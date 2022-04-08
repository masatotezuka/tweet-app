const checkBox = document.getElementById("tweet-favorite-33");
const favoriteWrapper = document.getElementsByClassName(
  "tweet-favorite-wrapper"
);
const favoriteCheckBoxes = [];

for (let i = 1; i <= favoriteWrapper.length; i++) {
  let score = 0;
  document.getElementById(`favorite-count-${i}`).innerHTML = score;
}

for (let i = 1; i <= favoriteWrapper.length; i++) {
  favoriteCheckBoxes.push(document.getElementById(`tweet-favorite-${i}`));
}

favoriteCheckBoxes.forEach((favoriteCheckBox) => {
  favoriteCheckBox.addEventListener("change", (event) => {
    console.log(event.currentTarget.id);
    for (let i = 0; i <= favoriteWrapper.length; i++) {
      if (event.currentTarget.id === `tweet-favorite-${i}`) {
        let score = parseInt(
          document.getElementById(`favorite-count-${i}`).innerText
        );
        if (event.currentTarget.checked === true) {
          score++;
        } else {
          score--;
        }
        document.getElementById(`favorite-count-${i}`).innerText = score;
      }
    }
  });
});
