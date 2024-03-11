const balance = document.querySelector("#balance");
const trans = document.querySelector("#trans");
const amount = document.querySelector("#amount");
const description = document.querySelector("#desc");
const form = document.querySelector("#form");
const income_amt = document.querySelector("#inc-amt");
const expense_amt = document.querySelector("#exp-amt");
const toggleSwitch = document.querySelector(".switch input");

const localStorageTrans = JSON.parse(localStorage.getItem("trans"));
let transactions = localStorageTrans != null ? localStorageTrans : [];

function updateLocalStorage() {
  localStorage.setItem("trans", JSON.stringify(transactions));
}

function config() {
  trans.innerHTML = "";
  transactions.forEach(loadTransactionDetails);
  updateAmount();
}

function addTransaction(e) {
  e.preventDefault();
  if (description.value.trim() == "" || amount.value.trim() == "") {
    alert("Please Enter Description and amount of transactions!!");
  } else {
    const transaction = {
      id: uniqueId(),
      description: description.value,
      amount: +amount.value,
    };
    transactions.push(transaction);
    loadTransactionDetails(transaction);
    description.value = "";
    amount.value = "";
    updateAmount();
    updateLocalStorage();
  }
}

function removeTrans(id) {
  if (confirm("Are you sure you want to delete Transcation?")) {
    transactions = transactions.filter((transaction) => transaction.id != id);
    config();
    updateLocalStorage();
  } else {
    return;
  }
}

function loadTransactionDetails(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "exp" : "inc");
  item.innerHTML = `
      ${transaction.description}
      <span>${sign} ${Math.abs(transaction.amount)}</span>
      <button class="btn-del" onclick="removeTrans(${
        transaction.id
      })">x</button>`;
  trans.appendChild(item);
}

function updateAmount() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  balance.innerHTML = `$  ${total}`;

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  income_amt.innerHTML = `$  ${income}`;
  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  expense_amt.innerHTML = `$  ${Math.abs(expense)}`;
}

function uniqueId() {
  return Math.floor(Math.random() * 100000);
}

function toggleTransactions() {
    const transactionItems = trans.querySelectorAll("li");
    transactionItems.forEach((item) => {
      if (toggleSwitch.checked) {
        item.style.display = item.classList.contains("exp") ? "flex" : "none";
      } else {
        item.style.display = item.classList.contains("inc") ? "flex" : "none";
      }
    });
  }

console.log("Toggle switch:", toggleSwitch);

toggleSwitch.addEventListener("change", toggleTransactions);

fetch("https://rich-erin-angler-hem.cyclic.app/students/available")
  .then((response) => response.json())
  .then((data) => {
    const selectElement = document.getElementById("currencies");
    data.forEach((currency) => {
      const optionElement = document.createElement("option");
      optionElement.value = currency.code;
      optionElement.textContent = `${currency.name} (${currency.symbol})`;
      selectElement.appendChild(optionElement);
    });
  })
  .catch((error) => console.error("Error fetching currencies:", error));

form.addEventListener("submit", addTransaction);

window.addEventListener("load", function () {
  config();
});
