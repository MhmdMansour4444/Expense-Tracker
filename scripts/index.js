const balance = document.querySelector("#balance");
const trans = document.querySelector("#trans");
const amount = document.querySelector("#amount");
const description = document.querySelector("#desc");

const localStorageTrans = JSON.parse(localStorage.getItem);
let transactions = localStorage.getItem("trans") != null ? localStorage : [];

function updateLocalStorage() {
  localStorage.setItem("trans", JSON.stringify(transactions));
}

function loadTransactionDetails(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction < 0 ? "exp" : "inc");
  item.innerHTML = `
    ${transaction.description}
    <span>${sign} ${Math.abs(transaction.amount)}</span>
    <button class="btn-del" onclick="removeTrans(${
      transaction.id
    })">x</button>`;
  trans.appendChild(item);
}

function config() {
  trans.innerHTML = "";
  transactions.forEach(loadTransactionDetails);
  updateAmount();
}

function removeTrans(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter((transaction) => transaction.id != id);
    config();
    updateLocalStorage();
  } else {
    return;
  }
}
