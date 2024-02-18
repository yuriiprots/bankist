"use strict";

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");

const account1 = {
  owner: "Yurii Prots",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
};

const account2 = {
  owner: "Sem Johanson",
  movements: [],
  pin: 2222,
};

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  signIn(inputLoginUsername.value, inputLoginPin.value);
});

const accounts = [account1, account2];

function signIn(nickname, pin) {
  let user = checkNickname(nickname);
  let result = checkPin(user, pin);

  if (result) {
    containerApp.style.opacity = 1;
    console.log("Login successful!"); // Add this for debugging
  } else {
    console.log("Login failed!"); // Add this for debugging
  }
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
}

function checkNickname(nickname) {
  let resultMain = "";
  accounts.forEach((account) => {
    const match = account.owner.match(/[A-Z]/g);
    const result = match ? match.slice(0, 2).join("").toLowerCase() : "";
    if (nickname === result) {
      resultMain = account.owner;
    }
  });
  return resultMain;
}

function checkPin(user, pin) {
  let result = false;
  accounts.forEach((account) => {
    if (user === account.owner && Number(pin) === account.pin) {
      result = true;
    }
  });
  return result;
}
