import { getAverageProfitPercent, getAverageVariance, getGroupedMonthlyIntelligenceData } from "./data";


// Profit 
const profitCtx = document.getElementById('profitCtx');
const profitCard = document.getElementById('profitCard');
var profitChart;

// Variance
const varianceCtx = document.getElementById('varianceCtx');
const varianceCard = document.getElementById('varianceCard');
var varianceChart;

export function buildCharts(data) {
    console.log("Build charts called");

    // Get Data
    const biData = getGroupedMonthlyIntelligenceData(data);
    console.log(biData);
    const avgProfitPercent = getAverageProfitPercent(data);
    const avgVariance = getAverageVariance(data);

    // Profit Charts
    profitChart = new Chart(profitCtx, getProfitChartConfiguration(biData));
    profitCard.innerText = avgProfitPercent + '%';

    // Variance Charts
    if (avgVariance > 0) {
        varianceCard.innerText = '$' + avgVariance;
        varianceCard.classList.add('text-success');
    } else {
        varianceCard.innerText = '-$' + (avgVariance * -1);
        varianceCard.classList.add('text-danger');
    }
}

function getProfitChartConfiguration(biData)
{
    if (profitChart) { profitChart.destroy(); }

    return {
        type: 'bar',
        data: {
            labels: biData.map(e => e.dateLabel),
            datasets: [{
                label: 'Profit Percent',
                data: biData.map(e => e.average),
                borderWidth: 1,
                yAxisID: 'y-left'
            },
            {
                label: 'Total Profit',
                data: biData.map(e => e.total),
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