"use strict";

const labelWelcome = document.querySelector(".welcome");
const labelBalance = document.querySelector(".balance__value");
const labelDate = document.querySelector(".date");

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

const accounts = [account1, account2];

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  signIn(inputLoginUsername.value, Number(inputLoginPin.value));
});

const createUsernames = (function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
})(accounts);

function signIn(username, pin) {
  accounts.forEach((account) => {
    if (username === account.username && pin === account.pin) {
      displayWelcomeMessage(account.owner);
      displayUI();
      //updateUI(account);
      console.log("Login successful!");
    }
  });
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
}

const displayWelcomeMessage = function (owner) {
  let name = owner.split(" ")[0];
  labelWelcome.textContent = `Welcome, ${name}!`;
};

const displayUI = () => (containerApp.style.opacity = 1);

const updateUI = function (account) {
  updateCurrentDate();
  calculateUserBalance(account.movements);
  // displayMovements(account.movements);
};

const calculateUserBalance = function (movements) {
  let userBalance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${userBalance} €`;
};

const updateCurrentDate = function () {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const minute = `${now.getMinutes()}`.padStart(2, 0);
  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
};