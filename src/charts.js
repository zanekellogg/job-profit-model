import { getGroupedMonthlyProfitData } from "./data";

const ctx = document.getElementById('myChart');
var chart;

export function buildCharts(data) {
    console.log("Build charts called");
    const profitBI = getGroupedMonthlyProfitData(data);

    console.log(profitBI);

    if (chart)
    {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: profitBI.map(e => e.dateLabel),
            datasets: [{
                label: 'Profit Percent',
                data: profitBI.map(e => e.average),
                borderWidth: 1,
                yAxisID: 'y-left'
            },
            {
                label: 'Total Profit',
                data: profitBI.map(e => e.total),
                borderWidth: 1,
                yAxisID: 'y-right'
            }]
        },
        options: {
            scales: {
                'y-left': {
                    position: 'left',
                    title: { display: true, text: 'Profit Percent'},
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                'y-right': {
                    position: 'right',
                    title: { display: true, text: 'Total Profit'},
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString(); // Format numbers with commas
                        }
                    }
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