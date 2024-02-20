"use strict";

const labelWelcome = document.querySelector(".welcome");
const labelBalance = document.querySelector(".balance__value");
const labelDate = document.querySelector(".date");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnSort = document.querySelector(".btn--sort");
const btnTransfer = document.querySelector(".form__btn--transfer");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");

const account1 = {
  owner: "Yurii Prots",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  interestRate: 1.2,
};

const account2 = {
  owner: "Sem Johanson",
  movements: [3000, 345, -1300, 4500, 2345, 1000, 300, -200],
  pin: 2222,
  interestRate: 1.5,
};

const accounts = [account1, account2];
let currentAccount;

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
  currentAccount = accounts.find((account) => account.username === username);

  if (currentAccount?.pin === pin) {
    displayWelcomeMessage(currentAccount.owner);
    displayUI();
    updateUI(currentAccount);
    console.log("Login successful!");
  }
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginPin.blur();
}

// function signIn(username, pin) {
//   accounts.forEach((account) => {
//     if (username === account.username && pin === account.pin) {
//       currentAccount = account;
//       displayWelcomeMessage(currentAccount.owner);
//       displayUI();
//       updateUI(currentAccount);
//       console.log("Login successful!");
//     }
//   });
//   inputLoginUsername.value = "";
//   inputLoginPin.value = "";
// }

const displayWelcomeMessage = function (owner) {
  let name = owner.split(" ")[0];
  labelWelcome.textContent = `Welcome, ${name}!`;
};

const displayUI = () => (containerApp.style.opacity = 1);

const updateUI = function (account) {
  updateCurrentDate();
  calcDisplayBalance(account.movements);
  displayMovements(account.movements);
  calcDisplaySummary(account);
};

const calcDisplayBalance = function (movements) {
  const userBalance = movements.reduce((acc, mov) => acc + mov, 0);
  currentAccount.balance = userBalance;
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

const calcDisplaySummary = function (account) {
  const sumIn = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${sumIn} €`;

  const sumOut = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)} €`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
};

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const row = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} €</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", row);
  });
};

let isSorted = false;
const sortMovements = function (movements) {
  if (!isSorted) {
    const sortedArray = [...movements].sort((a, b) => a - b);
    displayMovements(sortedArray);
    isSorted = true;
    return;
  }
  if (isSorted) {
    console.log("sorted");
    displayMovements(movements);
    isSorted = false;
  }
};

btnSort.addEventListener("click", () => {
  sortMovements(account1.movements);
});

const doTransfer = function (senderAccount, receiverUsername, amount) {
  let receiverAccount = accounts.find(
    (acc) => acc.username === receiverUsername
  );
  console.log(receiverAccount);

  if (receiverAccount && amount >= 0.01 && amount <= senderAccount.balance) {
    receiverAccount.movements.push(amount);
    senderAccount.movements.push(-amount);
  }
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  updateUI(senderAccount);
};

btnTransfer.addEventListener("click", (event) => {
  event.preventDefault();

  let receiverUsername = inputTransferTo.value;
  let amount = Number(inputTransferAmount.value);

  if (receiverUsername && amount)
    doTransfer(currentAccount, receiverUsername, amount);
});
