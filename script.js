"use strict";

const labelWelcome = document.querySelector(".welcome");
const labelBalance = document.querySelector(".balance__value");
const labelDate = document.querySelector(".date");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnSort = document.querySelector(".btn--sort");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const account1 = {
  owner: "Yurii Prots",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    "12/03/2023",
    "15/03/2023",
    "17/03/2023",
    "19/03/2023",
    "20/03/2023",
    "21/03/2023",
    "23/03/2023",
    "25/03/2023",
  ],
  pin: 1111,
  interestRate: 1.2,
};

const account2 = {
  owner: "Sem Johanson",
  movements: [3000, 345, -1300, 4500, 2345, 1000, 300, -200],
  movementsDates: [
    "15/03/2023",
    "16/03/2023",
    "23/03/2023",
    "12/03/2023",
    "15/04/2023",
    "21/05/2023",
    "23/06/2023",
    "07/07/2023",
  ],
  pin: 2222,
  interestRate: 1.5,
};

const account3 = {
  owner: "Johan Schmidt",
  movements: [3000, 345],
  pin: 3333,
  interestRate: 2.5,
};

const accounts = [account1, account2, account3];
let currentAccount;

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  signIn(inputLoginUsername.value, +inputLoginPin.value);
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

const displayWelcomeMessage = function (owner) {
  let name = owner.split(" ")[0];
  labelWelcome.textContent = `Welcome, ${name}!`;
};

const displayUI = () => (containerApp.style.opacity = 1);
const hideUI = () => (containerApp.style.opacity = 0);

const updateUI = function (account) {
  updateCurrentDate();
  calcDisplayBalance(account);
  displayMovements(account);
  calcDisplaySummary(account);
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
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
  labelSumIn.textContent = `${sumIn.toFixed(2)} €`;

  const sumOut = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(sumOut).toFixed(2)} €`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";

  let movs = account.movements;
  let dates = account.movementsDates;
  const movementDatePairs = account.movements.map((mov, i) => {
    return [mov, account.movementsDates[i]];
  });

  (() => {
    if (sort) {
      movementDatePairs.sort((a, b) => a[0] - b[0]);
      movs = movementDatePairs.map((pair) => pair[0]);
      dates = movementDatePairs.map((pair) => pair[1]);
      console.log(dates);
    }
  })();

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const row = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${dates[i]}</div>
          <div class="movements__value">${mov.toFixed(2)} €</div>
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", row);
  });
};

let isSorted = false;
btnSort.addEventListener("click", () => {
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});

const doTransfer = function (currentAccount, receiverAccount, amount) {
  if (
    amount >= 0.01 &&
    amount <= currentAccount.balance &&
    currentAccount.username !== receiverAccount.username
  ) {
    receiverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);

    receiverAccount.movementsDates.push(getCurrentDate());
    currentAccount.movementsDates.push(getCurrentDate());
  }
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  updateUI(currentAccount);
};

const getCurrentDate = function () {
  const date = new Date();
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

btnTransfer.addEventListener("click", (event) => {
  event.preventDefault();

  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  if (receiverAccount && amount)
    doTransfer(currentAccount, receiverAccount, amount);
});

const requestLoan = function (currentAccount, amount) {
  currentAccount.movements.push(amount);
  updateUI(currentAccount);
};

btnLoan.addEventListener("click", (event) => {
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  const loanRequirement = currentAccount.movements.some(
    (mov) => mov >= amount * 0.1
  );
  if (amount > 0 && loanRequirement) requestLoan(currentAccount, amount);

  inputLoanAmount.value = "";
});

function closeAccount(currentAccount) {
  const index = accounts.findIndex(
    (acc) => acc.username === currentAccount.username
  );
  accounts.splice(index, 1);
}

btnClose.addEventListener("click", (event) => {
  event.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    closeAccount(currentAccount);
  }
  inputCloseUsername.value = "";
  inputClosePin.value = "";
  hideUI();
});
