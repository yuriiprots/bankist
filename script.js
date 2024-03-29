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
    "2023-01-01T15:00:00.000Z",
    "2023-03-02T11:50:00.000Z",
    "2023-05-05T11:24:00.000Z",
    "2023-06-14T11:15:00.000Z",
    "2023-07-13T12:15:00.000Z",
    "2024-02-22T10:15:00.000Z",
    "2024-02-23T15:15:00.000Z",
    "2024-02-25T13:15:00.000Z",
  ],
  pin: 1111,
  interestRate: 1.2,
  locale: "uk-UA",
  currency: "EUR",
};

const account2 = {
  owner: "Sem Johanson",
  movements: [3000, 345, -1300, 4500, 2345, 1000, 300, -200],
  movementsDates: [
    "2023-01-21T11:00:00.000Z",
    "2023-03-22T11:50:00.000Z",
    "2023-05-25T11:24:00.000Z",
    "2023-06-24T11:15:00.000Z",
    "2023-07-23T11:15:00.000Z",
    "2024-02-02T11:15:00.000Z",
    "2024-02-03T12:15:00.000Z",
    "2024-02-26T13:15:00.000Z",
  ],
  pin: 2222,
  interestRate: 1.5,
  locale: "en-US",
  currency: "USD",
};

const account3 = {
  owner: "Johan Schmidt",
  movements: [3000, 345],
  movementsDates: ["2024-02-15T12:15:00.000Z", "2024-02-23T13:15:00.000Z"],
  pin: 3333,
  interestRate: 2.5,
  locale: "pt-PT",
  currency: "EUR",
};

const accounts = [account1, account2, account3];
let currentAccount = {};
let timer = null;

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  signIn(inputLoginUsername.value, +inputLoginPin.value);
});

const createUsernames = ((accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
})(accounts);

const signIn = (username, pin) => {
  currentAccount = accounts.find((account) => account.username === username);
  if (currentAccount?.pin === pin) {
    displayUI();
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginPin.blur();
};

const displayWelcomeMessage = (owner) => {
  let name = owner.split(" ")[0];

  const now = new Date();
  const greeting = new Map([
    [[6, 7, 8, 9, 10], "Good morning"],
    [[11, 12, 13, 14, 15], "Good afternoon"],
    [[16, 17, 18, 19, 20], "Good evening"],
    [[21, 22, 23, 0, 1, 2, 3, 4, 5], "Good night"],
  ]);

  const arr = [...greeting.keys()].find((key) => key.includes(now.getHours()));
  const greet = greeting.get(arr);
  labelWelcome.textContent = `${greet}, ${name}!`;
};

const displayUI = () => {
  displayWelcomeMessage(currentAccount.owner);
  containerApp.style.opacity = 1;
};
const hideUI = () => {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = "Log in to get started";
};

const updateUI = (account) => {
  updateCurrentDate();
  calcDisplayBalance(account);
  displayMovements(account);
  calcDisplaySummary(account);
};

const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};

const updateCurrentDate = () => {
  const now = new Date();

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);
};

const calculateSum = (movements, type) => {
  return movements.reduce((acc, mov) => (type(mov) ? acc + mov : acc), 0);
};

const calcDisplaySummary = (account) => {
  labelSumIn.textContent = formatCur(
    Math.abs(calculateSum(account.movements, (mov) => mov > 0)),
    account.locale,
    account.currency
  );

  labelSumOut.textContent = formatCur(
    Math.abs(calculateSum(account.movements, (mov) => mov < 0)),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => (int >= 1 ? acc + int : acc), 0);
  labelSumInterest.textContent = formatCur(
    Math.abs(interest),
    account.locale,
    account.currency
  );
};

const formatMovementDate = (date, locale) => {
  const diffDays = Math.round(
    Math.abs(new Date() - date) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = (account, sort = false) => {
  containerMovements.innerHTML = "";

  let dates = account.movementsDates;
  let movs = account.movements;

  if (sort) {
    const movementDatePairs = account.movements.map((mov, i) => {
      return [mov, account.movementsDates[i]];
    });
    movementDatePairs.sort((a, b) => a[0] - b[0]);

    [movs, dates] = movementDatePairs.reduce(
      ([movsAcc, datesAcc], [mov, date]) => [
        movsAcc.concat(mov),
        datesAcc.concat(date),
      ],
      [[], []]
    );
  }

  movs.forEach(function (mov, i) {
    const movDate = new Date(dates[i]);
    const displayDate = formatMovementDate(movDate, account.locale);
    const displayMov = formatCur(mov, account.locale, account.currency);

    const type = mov > 0 ? "deposit" : "withdrawal";
    const row = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${displayMov}</div> 
        </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", row);
  });
};

let isSorted = false;
btnSort.addEventListener("click", () => {
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});

const doTransfer = (currentAccount, receiverAccount, amount) => {
  if (
    amount >= 0.01 &&
    amount <= currentAccount.balance &&
    currentAccount.username !== receiverAccount.username
  ) {
    receiverAccount.movements.push(amount);
    currentAccount.movements.push(-amount);

    const date = new Date().toISOString();
    receiverAccount.movementsDates.push(date);
    currentAccount.movementsDates.push(date);
  }
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  updateUI(currentAccount);

  clearInterval(timer);
  timer = startLogOutTimer();
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

const requestLoan = (currentAccount, amount) => {
  currentAccount.movements.push(amount);
  currentAccount.movementsDates.push(new Date().toISOString());
  updateUI(currentAccount);

  clearInterval(timer);
  timer = startLogOutTimer();
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

const closeAccount = (currentAccount) => {
  const index = accounts.findIndex(
    (acc) => acc.username === currentAccount.username
  );
  accounts.splice(index, 1);
};

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

const startLogOutTimer = () => {
  let durationInSeconds = 10 * 60;

  const updateTimer = () => {
    const minutes = String(Math.trunc(durationInSeconds / 60)).padStart(2, "0");
    const seconds = String(durationInSeconds % 60).padStart(2, "0");

    labelTimer.textContent = `${minutes}:${seconds}`;

    if (durationInSeconds === 0) {
      clearInterval(timerInterval);
      hideUI();
    }
    durationInSeconds--;
  };

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);

  return timerInterval;
};
