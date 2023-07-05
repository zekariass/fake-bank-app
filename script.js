'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Zekarias Semegnew',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Abel Alemayehu',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Solomon Yohannes',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Meaza Belete',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movs, sorted=false){

  containerMovements.innerHTML = ""

  const movements = sorted ? movs.slice().sort((a,b)=> a - b): movs

  movements.forEach((mov, i) => {
    const type = mov > 0? "deposit": "withdrawal"

    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">
                    ${i} ${type}
                  </div>  
                  <div class="movements__date">24/01/2037</div>
                  <div class="movements__value">${mov}€</div>
              </div>` 
    
              containerMovements.insertAdjacentHTML("afterbegin", html)
              // containerMovements.innerHTML = html
              // containerMovements.insertAdjacentElement("afterbegin")
  });
}


const calcDisplayBalance = function(acc){

  const balance = acc.movements.reduce((acc, cur)=> acc + cur, 0)
  labelBalance.textContent = `${balance} €`

  acc.balance = balance


}

// calcDisplayBalance(account1.movements)


const calcDisplaySummary = function(acct){
  const deposits = acct.movements.filter(deposit=>deposit > 0)
                            .reduce((acc, cur)=> acc += cur)
  labelSumIn.textContent = `${deposits} €`

  const withdrawals = acct.movements.filter(withdrawal=> withdrawal < 0)
                                .reduce((acc, cur)=>acc += Math.abs(cur))
  labelSumOut.textContent = `${withdrawals} €`

  const interest = acct.movements.filter(movemonet=> movemonet>0)
                  .map(deposit=> deposit * acct.interestRate/100)
                  .filter(interest => interest >=1)
                  .reduce((acc, int)=>acc += int)

  labelSumInterest.textContent = `${interest} €`

}

// calcDisplaySummary(account1.movements)


function createUsername (accs){

  accs.forEach(acct=>{
                      acct.username = acct.owner
                        .toLowerCase()
                        .split(" ")
                        .map(subname=> subname[0])
                        .join("")
  })
}

createUsername(accounts)

const updateUI = function(acc){
  //Display movements
  displayMovements(acc.movements)

  //Display balance
  calcDisplayBalance(acc)

  //Display account summary
  calcDisplaySummary(acc)
}

let currentAccount;

btnLogin.addEventListener("click", function(e){

  //Stop UI reload on login click
  e.preventDefault()

  currentAccount = accounts.find(account => account.username === inputLoginUsername.value)

  if(currentAccount?.pin === Number(inputLoginPin.value)){


  //Display UI and Message
  containerApp.style.opacity = 100;
  labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(" ")[0]}`

  //Clear Input Fields
  inputLoginPin.value = inputLoginUsername.value = ""

  //Unfocus Input Fields
  inputLoginPin.blur()

  updateUI(currentAccount)
  
}

})

//ACCOUNT TRANSFER
btnTransfer.addEventListener("click", function(e){
  e.preventDefault()
  let amount = Number(inputTransferAmount.value)
  let recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value)

  // console.log(amount, recieverAcc, currentAccount)
  inputTransferAmount.value = inputTransferTo.value = ""
  inputTransferAmount.blur()
  inputTransferTo.blur()

  if(amount > 0 && 
    amount < currentAccount.balance && 
    recieverAcc &&
    recieverAcc?.username !== currentAccount?.username){
      recieverAcc.movements.push(amount)
      currentAccount.movements.push(-amount)

      updateUI(currentAccount)

    }

})

//CLOSE ACCOUNT
btnClose.addEventListener("click", function(e){
  e.preventDefault()
  let user = inputCloseUsername.value
  let pin = Number(inputClosePin.value)
  console.log(user, pin)
  console.log(currentAccount.username, currentAccount.pin)
  if(currentAccount.username === user && currentAccount.pin === pin){
    let accountIndex = accounts.findIndex(acc=>acc.username === user)
    accounts.splice(accountIndex, 1)
    console.log("deleted.....")
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ""

})

//LOAN
btnLoan.addEventListener("click", function(e){
  e.preventDefault()
  let loanAmount = Number(inputLoanAmount.value)

if(loanAmount > 0 && 
  currentAccount.movements.some(mov => mov >= loanAmount * 0.1)){
    currentAccount.movements.push(loanAmount)
    inputLoanAmount.value = ""
  }
  updateUI(currentAccount)
})

//SORT MOVEMENTS
let sorted = false

btnSort.addEventListener("click", function(e){
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted;

})

/////////////////////////////////////////////////
/////////////////////////////////////////////////

