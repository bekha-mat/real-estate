document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("button[onclick='calculate()']").addEventListener("click", calculate);
    document.querySelector("button[onclick='exportToExcel()']").addEventListener("click", exportToExcel);
});

function calculate() {
    let propertyPrice = parseFloat(document.getElementById('propertyPrice').value) || 0;
    let downPaymentPercent = parseFloat(document.getElementById('downPayment').value) || 0;
    let mortgageRate = parseFloat(document.getElementById('mortgageRate').value) || 0;
    let loanTenure = parseFloat(document.getElementById('loanTenure').value) || 0;
    let rentalIncome = parseFloat(document.getElementById('rentalIncome').value) || 0;
    let serviceCharge = parseFloat(document.getElementById('serviceCharge').value) || 0;
    let adminFee = parseFloat(document.getElementById('adminFee').value) || 0;
    let timePeriod = parseFloat(document.getElementById('timePeriod').value) || 0;
    let appreciationRate = parseFloat(document.getElementById('appreciationRate').value) || 0;

    let downPayment = (downPaymentPercent / 100) * propertyPrice;
    let mortgageAmount = propertyPrice - downPayment;
    let dldFee = propertyPrice * 0.04;
    let monthlyRate = (mortgageRate / 100) / 12;
    let numPayments = loanTenure * 12;
    let monthlyMortgage = (mortgageAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
    let annualMortgageCost = monthlyMortgage * 12;

    document.getElementById('dldFee').value = dldFee.toFixed(2);

    let totalRentalIncome = rentalIncome * timePeriod;
    let potentialCapitalAppreciation = propertyPrice * (Math.pow(1 + appreciationRate / 100, timePeriod) - 1);
    let totalExpenses = dldFee + adminFee + (serviceCharge * timePeriod) + (annualMortgageCost * timePeriod);
    let netProfit = totalRentalIncome + potentialCapitalAppreciation - totalExpenses;

    let roi = (netProfit / (downPayment + dldFee + adminFee)) * 100;
    let roe = (netProfit / downPayment) * 100;

    let results = [
        { name: "Total Down Payment", value: `AED ${downPayment.toFixed(2)}` },
        { name: "Mortgage Amount", value: `AED ${mortgageAmount.toFixed(2)}` },
        { name: "Annual Mortgage Cost", value: `AED ${annualMortgageCost.toFixed(2)}` },
        { name: "DLD Fee (4%)", value: `AED ${dldFee.toFixed(2)}` },
        { name: "Total Rental Income (" + timePeriod + " years)", value: `AED ${totalRentalIncome.toFixed(2)}` },
        { name: "Potential Capital Appreciation", value: `AED ${potentialCapitalAppreciation.toFixed(2)}` },
        { name: "Total Expenses", value: `AED ${totalExpenses.toFixed(2)}` },
        { name: "Net Profit", value: `AED ${netProfit.toFixed(2)}` },
        { name: "ROI (%)", value: `${roi.toFixed(2)}%` },
        { name: "ROE (%)", value: `${roe.toFixed(2)}%` },
    ];

    let resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";
    results.forEach(row => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.name}</td><td>${row.value}</td>`;
        resultsBody.appendChild(tr);
    });
}

function exportToExcel() {
    let table = document.getElementById("resultsTable");
    let rows = [];
    
    for (let i = 0, row; row = table.rows[i]; i++) {
        let rowData = [];
        for (let j = 0, col; col = row.cells[j]; j++) {
            rowData.push(col.innerText);
        }
        rows.push(rowData.join(","));
    }
    
    let csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "real_estate_calculations.csv");
    document.body.appendChild(link);
    link.click();
}
