const ctx = document.getElementById('myChart');

export function buildCharts(data) {
    console.log("Build charts called");
    const profitBI = getProfitBI(data);
    console.log(profitBI);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: profitBI.map(e => e.monthLabel),
            datasets: [{
                label: 'Profit Percent',
                data: profitBI.map(e => e.average),
                borderWidth: 1
            },
            {
                label: 'Total Profit',
                data: profitBI.map(e => e.sum),
                borderWidth: 1}]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getProfitBI(data) {
    // Step 1: Group data by month
    const groupedData = {};
    data.forEach(entry => {
        const month = entry.monthNumber;
        if (!groupedData[month]) {
            groupedData[month] = [];
        }
        groupedData[month].push(entry.profitPercent);
    });

    console.log(groupedData);
    
    // Step 2: Calculate averages
    const monthlyAverages = [];
    for (const [month, profits] of Object.entries(groupedData)) {
        const sum = profits.reduce((acc, profit) => acc + profit, 0);
        const avg = (sum / profits.length).toFixed(2);

        monthlyAverages.push({
            "month": parseInt(month),
            "total": sum,
            "average": parseFloat(avg),
            "monthLabel": data.find(entry => entry.monthNumber == month).monthLabel
        });
    }

    return monthlyAverages;
}

// function reduceDistinct(data, field)
// {
//     const distinct = [];
//     data.forEach(entry => {
//         if (!distinct.includes(entry[field]))
//         {
//             distinct.push(entry[field]);
//         }
//     });

//     return distinct;
// }