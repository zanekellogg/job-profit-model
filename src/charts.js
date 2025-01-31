import { getAverageProfitPercent, getGroupedMonthlyProfitData } from "./data";

const profitCtx = document.getElementById('profitCtx');
const profitCard = document.getElementById('profitCard');

var chart;

export function buildCharts(data) {
    console.log("Build charts called");

    // Profit Charts
    const profitBI = getGroupedMonthlyProfitData(data);
    const avgProfitPercent = getAverageProfitPercent(data);
    chart = new Chart(profitCtx, getProfitBIConfiguration(profitBI));
    profitCard.innerText = avgProfitPercent + '%';
}

function getProfitBIConfiguration(profitBI)
{
    if (chart) { chart.destroy(); }

    return {
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
                    ticks: PercentScaleTickConfig()
                },
                'y-right': {
                    position: 'right',
                    title: { display: true, text: 'Total Profit'},
                    beginAtZero: true,
                    ticks: DollarScaleTickConfig()
                }
            }
        }
    };
}

function PercentScaleTickConfig()
{
    return {
        callback: function(value) {
            return value + '%';
        }
    };
}

function DollarScaleTickConfig()
{
    return {
        callback: function(value) {
            return '$' + value.toLocaleString(); // Format numbers with commas
        }
    };
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