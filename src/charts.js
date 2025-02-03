import { getAverageProfitPercent, getAverageVariance, getGroupedMonthlyIntelligenceData, getLaborGroupings } from "./data";


// Profit 
const profitCtx = document.getElementById('profitCtx');
const profitCard = document.getElementById('profitCard');
var profitChart;

// Variance
const varianceCtx = document.getElementById('varianceCtx');
const varianceCard = document.getElementById('varianceCard');
var varianceChart;

// Labor
const laborCtx = document.getElementById('laborCtx');
const laborCard = document.getElementById('laborCard');
const labor1 = document.getElementById('labor1');
const labor2 = document.getElementById('labor2');
const labor3 = document.getElementById('labor3');
var laborChart;

export function buildCharts(data) {
    console.log("Build charts called");

    // Get Data
    const biData = getGroupedMonthlyIntelligenceData(data);
    console.log(biData);
    const avgProfitPercent = getAverageProfitPercent(data);
    const avgVariance = getAverageVariance(data);
    const laborData = getLaborGroupings(data);

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

    // Labor Charts
    laborChart = new Chart(laborCtx, getLaborChartConfiguration(biData));
    labor1.innerHTML = "<strong>" + laborData.avgs[0].avg + "%</strong> " + laborData.avgs[0].size + " (" + getLaborRangeLabel(laborData.avgs[0].size, laborData.highestLabor) + ")";
    labor2.innerHTML = "<strong>" + laborData.avgs[1].avg + "%</strong> " + laborData.avgs[1].size + " (" + getLaborRangeLabel(laborData.avgs[1].size, laborData.highestLabor) + ")";
    labor3.innerHTML = "<strong>" + laborData.avgs[2].avg + "%</strong> " + laborData.avgs[2].size + " (" + getLaborRangeLabel(laborData.avgs[2].size, laborData.highestLabor) + ")";
}

function getLaborRangeLabel(size, highestLabor)
{
    const divider = highestLabor / 3;
    if (size == "Small")
    {
        return "Less than $" + divider.toFixed(2);
    } else if (size == "Medium") {
        return "$" + (divider + 1).toFixed(2) + " - $" + (divider * 2).toFixed(2);
    } else {
        return "$" + ((divider * 2) + 1).toFixed(2) + " - $" + (divider * 3).toFixed(2);
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
                yAxisID: 'y-left',
                backgroundColor: 'rgb(88, 0, 165)',
                borderWidth: 0
            },
            {
                label: 'Total Profit',
                data: biData.map(e => e.total),
                borderWidth: 1,
                yAxisID: 'y-right',
                backgroundColor: 'rgb(23, 253, 164)',
                borderWidth: 0
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
                yAxisID: 'y-left',
                backgroundColor: 'rgb(0, 255, 255)',
                borderColor: 'rgb(0, 255, 255)',
                borderWidth: 1.5
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

function getLaborChartConfiguration(biData)
{
    if (laborChart) { laborChart.destroy(); }

    return {
        type: 'line',
        data: {
            labels: biData.map(e => e.dateLabel),
            datasets: [{
                label: 'Small',
                data: biData.map(e => e.smallLaborAvgProfit),
                borderWidth: 1,
                yAxisID: 'y-left',
                spanGaps: true,
                // backgroundColor: 'rgb(0, 255, 255)',
                // borderColor: 'rgb(0, 255, 255)',
                // borderWidth: 1.5
            },
            {
                label: 'Medium',
                data: biData.map(e => e.mediumLaborAvgProfit),
                borderWidth: 1,
                yAxisID: 'y-left',
                spanGaps: true,
                // backgroundColor: 'rgb(88, 0, 165)',
                // borderColor: 'rgb(88, 0, 165)',
                // borderWidth: 1.5
            },
            {
                label: 'Large',
                data: biData.map(e => e.largeLaborAvgProfit),
                borderWidth: 1,
                yAxisID: 'y-left',
                spanGaps: true,
                // backgroundColor: 'rgb(57, 255, 20)',
                // borderColor: 'rgb(57, 255, 20)',
                // borderWidth: 1.5
            }]
        },
        options: {
            scales: {
                'y-left': {
                    position: 'left',
                    title: { display: true, text: '???'},
                    beginAtZero: true,
                    ticks: percentScaleTickConfig()
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