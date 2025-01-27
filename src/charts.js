import { getGroupedMonthlyProfitData } from "./data";

const ctx = document.getElementById('myChart');
var chart;

export function buildCharts(data) {
    console.log("Build charts called");
    const profitBI = getGroupedMonthlyProfitData(data);

    if (chart)
    {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
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