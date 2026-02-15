const expenseTable = document.getElementById("expense-table");
const totalExpense = document.getElementById("total-expense");
const categoryFilter = document.getElementById("cetegory-filter");
const addExpenseButton = document.getElementById("add-expense");

const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("category");
const expenseDate = document.getElementById("expense-date");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editingExpenseId = null;
let deletingExpenseId = null;


function updateUI(list = expenses) {
    expenseTable.innerHTML = "";
    let total = 0;

    if(list.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="5" class="empty-table-msg">
                No expenses recorded.
            </td>`;
        expenseTable.appendChild(row);
    } 
    else{
        list.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" onclick="openEditModal(${expense.id})">Edit</button>
                    <button class="delete-btn" onclick="openDeleteModal(${expense.id})">Delete</button>
                </td>
            `;

            expenseTable.appendChild(row);
            total += expense.amount;
        });
    }

    totalExpense.textContent = total.toFixed(2);
}



function checkInputs() {
    if(
        expenseName.value.trim() &&
        expenseAmount.value &&
        expenseCategory.value &&
        expenseDate.value
    ) {
        addExpenseButton.disabled = false;
    } 
    else{
        addExpenseButton.disabled = true;
    }
}

[expenseName, expenseAmount, expenseCategory, expenseDate].forEach(input => {
    input.addEventListener("input", checkInputs);
});


addExpenseButton.addEventListener("click", () => {

    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    if(!name || isNaN(amount) || !date) {
        alert("Please fill in all fields");
        return;
    }

    const expense = {
        id: Date.now(),
        name,
        amount,
        category,
        date
    };

    expenses.push(expense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    expenseName.value = "";
    expenseAmount.value = "";
    expenseCategory.value = "";
    expenseDate.value = "";

    addExpenseButton.disabled = true;

    updateUI();
    updateChart();
    updateChart2()
});


function openEditModal(id) {

    const expense = expenses.find(e => e.id === id);
    if(!expense) return;

    document.getElementById("edit-expense-name").value = expense.name;
    document.getElementById("edit-expense-amount").value = expense.amount;
    document.getElementById("edit-category").value = expense.category;
    document.getElementById("edit-expense-date").value = expense.date;

    editingExpenseId = id;

    openModal("edit-modal");
}

document.getElementById("confirm-edit").addEventListener("click", () => {

    const name = document.getElementById("edit-expense-name").value.trim();
    const amount = parseFloat(document.getElementById("edit-expense-amount").value);
    const category = document.getElementById("edit-category").value;
    const date = document.getElementById("edit-expense-date").value;

    if(!name || isNaN(amount) || !date) {
        alert("Please fill in all fields");
        return;
    }

    const index = expenses.findIndex(e => e.id === editingExpenseId);

    if(index > -1) {
        expenses[index] = {
            id: editingExpenseId,
            name,
            amount,
            category,
            date
        };

        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    updateUI();
    updateChart();
    updateChart2()
    closeModal("edit-modal");
});


function openDeleteModal(id) {
    deletingExpenseId = id;
    openModal("delete-modal");
}

document.getElementById("confirm-delete").addEventListener("click", () => {

    expenses = expenses.filter(e => e.id !== deletingExpenseId);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    updateUI();
    updateChart2()
    updateChart()
    closeModal("delete-modal");
});


function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}


categoryFilter.addEventListener("change", () => {

    const value = categoryFilter.value;

    if(value === "all") {
        updateUI(expenses);
        updateChart();
        updateChart2()
        updateChart()
    } 
    else{
        const filtered = expenses.filter(e => e.category === value);
        updateUI(filtered);
        updateChart();
        updateChart2()
    }
});

let chart2;

function updateChart2() {

    const ctx = document.getElementById("expense-Chart").getContext("2d");

    const categoryTotals = {};

    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chart2) {
        chart2.destroy();
    }

    chart2 = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses by Category",
                data: data,
                backgroundColor: [
                    "#4CAF50",
                    "#2196F3",
                    "#FF9800",
                    "#E91E63"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

let chart;

function updateChart() {
    const bar = document.getElementById("expenseChart").getContext("2d");

    const categoryTotals = {};

    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(bar, {
        type: "bar", 
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses by Category",
                data: data,
                backgroundColor: [
                    "#4CAF50",
                    "#2196F3",
                    "#FF9800",
                    "#E91E63"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
};
updateChart();
updateChart2()
updateUI();
