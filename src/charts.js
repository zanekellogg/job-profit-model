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
    varianceChart = new Chart(varianceCtx, getVarianceChartConfiguration(biData));
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
                    ticks: percentScaleTickConfig()
                },
                'y-right': {
                    position: 'right',
                    title: { display: true, text: 'Total Profit'},
                    beginAtZero: true,
                    ticks: dollarScaleTickConfig()
                }
            }
        }
    };
}

function getVarianceChartConfiguration(biData)
{
    if (varianceChart) { varianceChart.destroy(); }

    return {
        type: 'line',
        data: {
            labels: biData.map(e => e.dateLabel),
            datasets: [{
                label: 'Total Estimate vs Actual',
                data: biData.map(e => e.variance),
                borderWidth: 1,
                yAxisID: 'y-left'
            }]
        },
        options: {
            scales: {
                'y-left': {
                    position: 'left',
                    title: { display: true, text: 'Estimate vs Actual'},
                    beginAtZero: true,
                    ticks: dollarScaleTickConfig(),
                    grid: {
                        color: (context) => context.tick.value === 0 ? "black" : "rgba(0, 0, 0, 0.1)", // Bold zero line
                        // lineWidth: (context) => context.tick.value === 0 ? 2 : 1 // Thicker zero line
                    },
                }
            }
        }
    };
}

function percentScaleTickConfig()
{
    return {
        callback: function(value) {
            return value + '%';
        }
    };
}

function dollarScaleTickConfig()
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