const favoriteWrapper = document.getElementsByClassName(
  "tweet-favorite-wrapper"
);

const errorMessage = document.getElementsByClassName("error-message")[0];
const ajaxMessage = document.getElementsByClassName("ajax-message")[0];
const favoriteCheckBoxes = [];
const favoriteCounts = [];
for (let i = 1; i <= favoriteWrapper.length; i++) {
  // document.getElementById(`favorite-count-${i}`).innerHTML = 0;
  favoriteCheckBoxes.push(document.getElementById(`tweet-favorite-${i}`));
  favoriteCounts.push(document.getElementById(`favorite-count-${i}`));
}
console.log(document.getElementById(`favorite-count-3`).innerText);
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
        xhr.open("POST", "/ajax", true);
        xhr.setRequestHeader("csrf-token", csrfToken);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(JSON.stringify(json));
        //関数が実行されている理由が不明
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const userFavoriteCount = parseInt(xhr.responseText);
              document.getElementById(`favorite-count-${i}`).innerText =
                userFavoriteCount;
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
  console.log("load...");
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/ajax", true);
  xhr.send(null);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        errorMessage.innerText = "";
        const response = JSON.parse(xhr.responseText);
        const userFavorites = response[0];
        const userFavoriteCounts = response[1];

        //繰り返し処理が多いため、パフォーマンスが低いコード
        userFavorites.forEach((userFavorite) => {
          favoriteCheckBoxes.forEach((favoriteCheck) => {
            //idだけで比較できない
            if (
              `tweet-favorite-${userFavorite.UserTweetId}` === favoriteCheck.id
            ) {
              favoriteCheck.checked = userFavorite.isFavorite;
            }
          });
        });
        userFavoriteCounts.forEach((userFavoriteCount) => {
          console.log(userFavoriteCount);
          favoriteCounts.forEach((favoriteCount) => {
            //idだけで比較できない
            console.log(favoriteCount);
            if (
              `favorite-count-${userFavoriteCount.UserTweetId}` ===
              favoriteCount.id
            ) {
              favoriteCount.innerText = userFavoriteCount.favoriteCounts;
            }
            if (favoriteCount.innerText === "") {
              favoriteCount.innerText = 0;
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
