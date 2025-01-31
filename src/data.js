export function transformData(data)
{                
    var highestLabor = 0;
    data.forEach(e => {
        const labor = parseFloat(e["Labor"]);
        highestLabor = (labor > highestLabor) ? labor : highestLabor;
    });
    const laborDivider = highestLabor / 3;
    
    return data.map(entry => {
        const jobDateUtc = Date.parse(entry["Job Date"]);
        const jobDate = new Date(jobDateUtc);
        const description = entry.Description;
        const labor = parseFloat(entry["Labor"] || 0);
        const materials = parseFloat(entry["Materials"] || 0);
        const overhead = parseFloat(entry["Overhead"] || 0);
        const amountRecieved = parseFloat(entry["Amount Received"] || 0);
        const originalEstimate = parseFloat(entry["Original Estimate"] || 0);

        // Profit
        var profit = amountRecieved - labor - materials - overhead;
        profit = parseFloat(profit.toFixed(2));

        // Profit Percent
        var profitPercent = (profit / amountRecieved) * 100;
        profitPercent = parseFloat(profitPercent.toFixed(4));

        // Estimate Variance
        var variance = amountRecieved - originalEstimate;
        variance = parseFloat(variance.toFixed(2));

        // Estimate Variance Percent
        var variancePercent = (variance / originalEstimate) * 100;
        variancePercent = parseFloat(variancePercent.toFixed(4));

        // Month & Year
        const monthNumber = jobDate.getMonth() + 1;
        const year = jobDate.getFullYear();
        const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthLabel = monthLabels[jobDate.getMonth()];
        const dateLabel = monthLabel + "-" + year;

        // Labor Group
        var laborGroup = "S";
        if (labor >= laborDivider && labor < (laborDivider * 2)) {
            laborGroup = "M";
        } else if (labor >= (laborDivider * 2)) {
            laborGroup = "L";
        }

        return {
            jobDate,
            description,
            labor,
            materials,
            overhead,
            amountRecieved,
            originalEstimate,
            profit,
            profitPercent,
            variance,
            variancePercent,
            monthNumber,
            year,
            monthLabel,
            dateLabel,
            laborGroup
        }
    });
}

export function getGroupedMonthlyIntelligenceData(data)
{
    // Step 1: Group data by month
    const groupedData = {};
    data.forEach(entry => {
        const dateLabel = entry.dateLabel;
        if (!groupedData[dateLabel]) {
            groupedData[dateLabel] = [];
        }
        groupedData[dateLabel].push({
            profitPercent: entry.profitPercent,
            profit: entry.profit,
            variance: entry.variance
        });
    });

    // Step 2: Calculate grouped vectors
    const monthlyAverages = [];
    for (const key of Object.keys(groupedData))
    {
        const entry = groupedData[key];

        // Calculate Avg. Profit Percentage
        const sumPP = entry.reduce((acc, pp) => acc + pp.profitPercent, 0);
        const avgPP = (sumPP / entry.length).toFixed(2);
        const variance = entry.reduce((total, entry) => total + entry.variance, 0).toFixed(2);

        // Calculate Sum Profit
        const sumP = entry.reduce((acc, p) => acc + p.profit, 0);

        monthlyAverages.push({
            "total": parseFloat(sumP),
            "average": parseFloat(avgPP),
            "variance": parseFloat(variance),
            "dateLabel": key
        })
    }

    return monthlyAverages;
}

export function getAverageProfitPercent(data)
{
    const sum = data.reduce((total, entry) => total += entry.profitPercent, 0);
    return getAverage(sum, data.length);
}

export function getAverageVariance(data)
{
    // data.map(e => console.log(e.variance));
    var sum = data.reduce((total, entry) => total += entry.variance, 0);
    return getAverage(sum, data.length);
}

function getAverage(sum, total)
{
    const avg = sum / total;
    return avg.toFixed(2);
}
