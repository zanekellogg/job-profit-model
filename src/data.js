export function transformData(data)
{                
    var highestLabor = 0;
    data.forEach(e => {
        const labor = parseFloat(e["Labor"]);
        highestLabor = (labor > highestLabor) ? labor : highestLabor;
    });
    const laborDivider = highestLabor / 3;
    
    return data.map(entry => {
        const jobDateUtc = new Date(entry["Job Date"]);
        //const jobDate = new Date(jobDateUtc);
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
        const monthNumber = jobDateUtc.getUTCMonth() + 1;
        const year = jobDateUtc.getUTCFullYear();
        const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthLabel = monthLabels[jobDateUtc.getUTCMonth()];
        const dateLabel = monthLabel + "-" + year;

        // Labor Group
        var laborGroup = "S";
        if (labor >= laborDivider && labor < (laborDivider * 2)) {
            laborGroup = "M";
        } else if (labor >= (laborDivider * 2)) {
            laborGroup = "L";
        }

        return {
            jobDateUtc,
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

        const smallProfit = getSum(smallEntries, 'profit');
        const medProfit = getSum(medEntries, 'profit');
        const largeProfit = getSum(largeEntries, 'profit');

        // Calculate Sum Profit
        const sumP = getSum(entries, 'profit');

        monthlyAverages.push({
            "total": sumP,
            "average": avgPP,
            "variance": variance,
            "smallLaborAvgProfit": smallAvgPP,
            "mediumLaborAvgProfit": medAvgPP,
            "largeLaborAvgProfit": largeAvgPP,
            "smallLaborProfit": smallProfit,
            "mediumLaborProfit": medProfit,
            "largeLaborProfit": largeProfit,
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

export function getLaborGroupings(data)
{
    const smalls = data.filter(e => e.laborGroup == 'S');
    const smallAvg = getAverage(getSum(smalls, 'profitPercent'), smalls.length);
    const meds = data.filter(e => e.laborGroup == 'M');
    const medAvg = getAverage(getSum(meds, 'profitPercent'), meds.length);
    const larges = data.filter(e => e.laborGroup == 'L');
    const largeAvg = getAverage(getSum(larges, 'profitPercent'), larges.length);
    const highestLabor = data.reduce((current, entry) => (entry.labor > current) ? entry.labor : current, 0);

    var avgsArray = [
        { size: 'Small', avg: smallAvg },
        { size: 'Medium', avg: medAvg },
        { size: 'Large', avg: largeAvg }
    ];
    avgsArray.sort((a,b) => b.avg - a.avg);

    return {
        avgs: avgsArray,
        highestLabor: highestLabor
    }
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

    return parseFloat(data.reduce((total, entry) => total += entry[field], 0));
}

export function sumArray(array)
{
    return array.reduce((a, b) => a + b, 0);
}

function getAverage(sum, total)
{
    const avg = sum / total;
    return avg.toFixed(2);
}