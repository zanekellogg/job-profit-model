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
