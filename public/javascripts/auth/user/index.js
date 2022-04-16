const favoriteWrapper = document.getElementsByClassName(
  "tweet-favorite-wrapper"
);

const errorMessage = document.getElementsByClassName("error-message")[0];
const ajaxMessage = document.getElementsByClassName("ajax-message")[0];
const favoriteCheckBoxes = [];
const favoriteCounts = [];

for (let i = 1; i <= favoriteWrapper.length; i++) {
  favoriteCheckBoxes.push(document.getElementById(`tweet-favorite-${i}`));
  favoriteCounts.push(document.getElementById(`favorite-count-${i}`));
}

favoriteCheckBoxes.forEach((favoriteCheck) => {
  favoriteCheck.addEventListener("change", (event) => {
    for (let i = 0; i <= favoriteWrapper.length; i++) {
      if (event.currentTarget.id === `tweet-favorite-${i}`) {
        const csrfToken = document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content");
        let json = {
          isFavorite: event.currentTarget.checked,
          tweetId: i,
        };

        const xhr = new XMLHttpRequest();

        if (json.isFavorite === true) {
          xhr.open("POST", "/api/auth/users", true);
        } else {
          xhr.open("DELETE", "/api/auth/users", true);
        }
        xhr.setRequestHeader("csrf-token", csrfToken);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify(json));

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const userFavoriteCount = parseInt(xhr.responseText);
              console.log(userFavoriteCount);
              if (!userFavoriteCount) {
                document.getElementById(`favorite-count-${i}`).innerText = 0;
              } else {
                document.getElementById(`favorite-count-${i}`).innerText =
                  userFavoriteCount;
              }
            } else if (xhr.status == 500) {
              errorMessage.innerText = "サーバーエラーが発生しました";
            } else {
              errorMessage.innerText = "予期せぬエラーが発生しました";
            }
          } else {
            ajaxMessage.innerText === "通信中";
            return;
          }
        };
      }
    }
  });
});

window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/auth/users", true);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        errorMessage.innerText = "";
        const response = JSON.parse(xhr.responseText);
        const userFavorites = response[0];
        const userFavoriteCounts = response[1];

        console.log(response);
        userFavorites.forEach((userFavorite) => {
          favoriteCheckBoxes.forEach((favoriteCheck) => {
            if (
              `tweet-favorite-${userFavorite.UserTweetId}` === favoriteCheck.id
            ) {
              favoriteCheck.checked = true;
            } else {
              favoriteCheck.checked = false;
            }
          });
        });
        userFavoriteCounts.forEach((userFavoriteCount) => {
          favoriteCounts.forEach((favoriteCount) => {
            console.log(favoriteCount);
            if (
              `favorite-count-${userFavoriteCount.UserTweetId}` ===
              favoriteCount.id
            ) {
              favoriteCount.innerText = userFavoriteCount.favoriteCounts;
            }
          });
        });
      } else if (xhr.status == 500) {
        errorMessage.innerText = "サーバーエラーが発生しました";
      } else {
        errorMessage.innerText = "予期せぬエラーが発生しました";
      }
    } else {
      ajaxMessage.innerText === "通信中";
      return;
    }
  };
};
