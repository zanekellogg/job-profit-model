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
            variance: entry.variance,
            laborGroup: entry.laborGroup
        });
    });

    // console.log("Grouped", groupedData);

    // Step 2: Calculate grouped vectors
    const monthlyAverages = [];
    for (const key of Object.keys(groupedData))
    {
        const entries = groupedData[key];

        // Calculate Avg. Profit Percentage
        const avgPP = getAverage(getSum(entries, 'profitPercent'), entries.length);
        
        // Calculate Variance
        const variance = getSum(entries, 'variance').toFixed(2);

        // Calculate Labor Group Variance
        const smallEntries = entries.filter(item => item.laborGroup == 'S');
        const smallSumPP = getSum(smallEntries, 'profitPercent');
        const smallAvgPP = getAverage(smallSumPP, smallEntries.length);
        const medEntries = entries.filter(item => item.laborGroup == 'M');
        const medSumPP = getSum(medEntries, 'profitPercent');
        const medAvgPP = getAverage(medSumPP, medEntries.length);
        const largeEntries = entries.filter(item => item.laborGroup == 'L');
        const largeSumPP = getSum(largeEntries, 'profitPercent');
        const largeAvgPP = getAverage(largeSumPP, largeEntries.length);

        // Calculate Sum Profit
        const sumP = getSum(entries, 'profit');

        monthlyAverages.push({
            "total": sumP,
            "average": avgPP,
            "variance": variance,
            "smallLaborAvgProfit": smallAvgPP,
            "mediumLaborAvgProfit": medAvgPP,
            "largeLaborAvgProfit": largeAvgPP,
            "dateLabel": key
        })
    }

    return monthlyAverages;
}

export function getAverageProfitPercent(data)
{
    const sum = getSum(data, 'profitPercent');
    return getAverage(sum, data.length);
}

export function getAverageVariance(data)
{
    var sum = getSum(data, 'variance');
    return getAverage(sum, data.length);
}

function getSum(data, field)
{
    if (data == 0)
    {
        return 0;
    }

    if (data.length < 2)
    {
        return parseFloat(data[0][field]);
    }

    return data.reduce((total, entry) => total += entry[field], 0);
}

function getAverage(sum, total)
{
    const avg = sum / total;
    return avg.toFixed(2);
}

function getLaborGroupAverage(laborGroup)
{
    const entries = entry.filter(item => item.laborGroup == laborGroup);
    const smallSumPP = smallEntries.reduce((acc, pp) => acc + pp.profitPercent, 0);
    const smallAvgPP = (smallEntries.length > 0) ? (smallSumPP / smallEntries.length).toFixed(2) : 0;
}