// :Adicionando uma transação
const Modal = {
  open() {
    // abre o modal
    document
      .querySelector(".modal-overlay") // usa a seleção do CSS para colocar o que ele encontra em um objeto
      .classList // ativa a class
      .add("active");
  },
  close() {
    // fecha o modal
    // remove a class active do modal
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

// :Calculo das transações
const Transaction = {
  // :transações
  all: [
    {
      id: 1,
      description: "Luz",
      amount: -50000,
      date: "23/01/2021",
    },
    {
      id: 2,
      description: "WebSite",
      amount: 500000,
      date: "23/01/2021",
    },
    {
      id: 3,
      description: "Internet",
      amount: -20000,
      date: "23/01/2021",
    },
  ],

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    // ?somar as entradas
    let income = 0;

    // para cada transação pegada
    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });

    return income;
  },
  expenses() {
    // !somar as saídas
    let expense = 0;

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });

    return expense;
  },
  total() {
    // *entradas - saídas

    return Transaction.incomes() + Transaction.expenses();
  },
};

// :Substituir os dados do HTML com os dados do JS
// DOM manipula o HTML
const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  // *Cria a tag HTML
  addTransaction(transaction, index) {
    const tr = document.createElement("tr"); // criando uma tag HTML
    tr.innerHTML = DOM.innerHTMLTransaction(transaction); // adicionando um HTML nessa tag

    DOM.transactionsContainer.appendChild(tr);
  },

  // *Pega os dados
  innerHTMLTransaction(transaction) {
    // ?substitui o HTML
    const CSSclass = transaction.amount > 0 ? "income" : "expense"; // verificando se o dado é maior que

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${CSSclass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img src="./assets/minus.svg" alt="Remover Transação" />
    </td>
    `;

    return html;
  },

  // *mostrar os valores
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expensesDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

// :Formanto o número para um valor
const Utils = {
  formatAmount(value) {
    value = Number(value.replace(/\,\./g, "")) * 100;

    return value;
  },

  formatDate(date) {
    const splittedDate = date.split("-"); // faz separações, para isso usa um marcador

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    // ?formatando para moeda
    value = String(value).replace(/\D/g, "");
    // '/\D/' ache tudo que não é número

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

// :Pegando os Dados
const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    // trim lipa o que tem espaço vazio
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os compos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return { 
      description, 
      amount, 
      date 
    };
  },

  saveTransaction(transaction) {
    Transaction.add(transaction);
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault(); // interrompe o comportamento padrão do HTML

    try {
      // :verficar as informações (ver se esá preenchida)
      Form.validateFields();

      // :formatar os dados para
      const transaction = Form.formatValues();

      // :salvar o formulário
      Form.saveTransaction();

      // :apagar os dados do Formulários
      Form.clearFields();

      // :fechar o modal
      Modal.close();
    } catch (error) {
      alert(error.message);
      console.log(Form.description.value, Form.amount.value, Form.date.value);
    }
  },
};

// !O que roda o progrma
const App = {
  init() {
    // 'forEach' serve para quanto temos um Array, que executa para cada elemeneto uma função
    Transaction.all.forEach((transaction) => {
      DOM.addTransaction(transaction);
    });

    DOM.updateBalance();
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();
