var App = (() => {
  // src/sample-data.js
  var sampleData = [
    {
      "Job Date": "2024-10-01",
      "Description": "Smith, Basic electric work",
      "Labor": "2340",
      "Materials": "1781",
      "Overhead": "412.1",
      "Amount Received": "5084.34",
      "Original Estimate": "4867.36"
    },
    {
      "Job Date": "2024-10-10",
      "Description": "Williams, Building a deck",
      "Labor": "1170",
      "Materials": "320",
      "Overhead": "149",
      "Amount Received": "2065.32",
      "Original Estimate": "2112.93"
    },
    {
      "Job Date": "2024-10-28",
      "Description": "Garcia, Kitchen remodel",
      "Labor": "850",
      "Materials": "893",
      "Overhead": "206.3",
      "Amount Received": "2179.16",
      "Original Estimate": "2355"
    },
    {
      "Job Date": "2024-10-18",
      "Description": "Jones, Floor installation",
      "Labor": "1755",
      "Materials": "1869",
      "Overhead": "362.4",
      "Amount Received": "4576.73",
      "Original Estimate": "5367.54"
    },
    {
      "Job Date": "2024-11-01",
      "Description": "Martinez, Plumbing repair",
      "Labor": "1755",
      "Materials": "1932",
      "Overhead": "368.7",
      "Amount Received": "5329.24",
      "Original Estimate": "4337.2"
    },
    {
      "Job Date": "2024-11-11",
      "Description": "Wilson, Kitchen remodel",
      "Labor": "1755",
      "Materials": "1812",
      "Overhead": "356.7",
      "Amount Received": "4771.68",
      "Original Estimate": "5653.69"
    },
    {
      "Job Date": "2024-11-18",
      "Description": "Taylor, Plumbing repair",
      "Labor": "2340",
      "Materials": "1789",
      "Overhead": "412.9",
      "Amount Received": "5612.3",
      "Original Estimate": "5435.59"
    },
    {
      "Job Date": "2024-11-28",
      "Description": "White, Bathroom remodel",
      "Labor": "1755",
      "Materials": "501",
      "Overhead": "225.6",
      "Amount Received": "3331.97",
      "Original Estimate": "3451.03"
    },
    {
      "Job Date": "2024-12-09",
      "Description": "Martin, Bathroom remodel",
      "Labor": "1755",
      "Materials": "209",
      "Overhead": "196.4",
      "Amount Received": "2387.84",
      "Original Estimate": "2180.07"
    },
    {
      "Job Date": "2024-12-23",
      "Description": "Young, Basic electric work",
      "Labor": "2925",
      "Materials": "1416",
      "Overhead": "434.1",
      "Amount Received": "5779.8",
      "Original Estimate": "5385.17"
    },
    {
      "Job Date": "2025-01-10",
      "Description": "Franks, Kitchen sink repair",
      "Labor": "1300",
      "Materials": "400",
      "Overhead": "45.50",
      "Amount Received": "1950",
      "Original Estimate": "2250"
    },
    {
      "Job Date": "2025-01-15",
      "Description": "Brantley, Bedroom paint and repair",
      "Labor": "2575",
      "Materials": "1500",
      "Overhead": "150",
      "Amount Received": "4500",
      "Original Estimate": "4500"
    },
    {
      "Job Date": "2025-01-20",
      "Description": "Craft, Shed construction",
      "Labor": "2300",
      "Materials": "1500",
      "Overhead": "250",
      "Amount Received": "5000",
      "Original Estimate": "4700"
    },
    {
      "Job Date": "2025-01-28",
      "Description": "Dickons, Wall repair",
      "Labor": "200",
      "Materials": "50",
      "Overhead": "50",
      "Amount Received": "350",
      "Original Estimate": "250"
    },
    {
      "Job Date": "2025-2-15",
      "Description": "Carter, Clog removal",
      "Labor": "500",
      "Materials": "45",
      "Overhead": "50",
      "Amount Received": "700",
      "Original Estimate": "700"
    },
    {
      "Job Date": "2025-2-1",
      "Description": "Edwards, Deck replacement",
      "Labor": "2000",
      "Materials": "1800",
      "Overhead": "500",
      "Amount Received": "5160",
      "Original Estimate": "4500"
    },
    {
      "Job Date": "2025-2-20",
      "Description": "Franklin, Garden sprinkler",
      "Labor": "1250",
      "Materials": "750",
      "Overhead": "100",
      "Amount Received": "2352",
      "Original Estimate": "2500"
    }
  ];

  // src/data.js
  function transformData(data) {
    var highestLabor = 0;
    data.forEach((e) => {
      const labor = parseFloat(e["Labor"]);
      highestLabor = labor > highestLabor ? labor : highestLabor;
    });
    const laborDivider = highestLabor / 3;
    return data.map((entry) => {
      const jobDateUtc = new Date(entry["Job Date"]);
      const description = entry.Description;
      const labor = parseFloat(entry["Labor"] || 0);
      const materials = parseFloat(entry["Materials"] || 0);
      const overhead = parseFloat(entry["Overhead"] || 0);
      const amountRecieved = parseFloat(entry["Amount Received"] || 0);
      const originalEstimate = parseFloat(entry["Original Estimate"] || 0);
      var profit = amountRecieved - labor - materials - overhead;
      profit = parseFloat(profit.toFixed(2));
      var profitPercent = profit / amountRecieved * 100;
      profitPercent = parseFloat(profitPercent.toFixed(4));
      var variance = amountRecieved - originalEstimate;
      variance = parseFloat(variance.toFixed(2));
      var variancePercent = variance / originalEstimate * 100;
      variancePercent = parseFloat(variancePercent.toFixed(4));
      const monthNumber = jobDateUtc.getUTCMonth() + 1;
      const year = jobDateUtc.getUTCFullYear();
      const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthLabel = monthLabels[jobDateUtc.getUTCMonth()];
      const dateLabel = monthLabel + "-" + year;
      var laborGroup = "S";
      if (labor >= laborDivider && labor < laborDivider * 2) {
        laborGroup = "M";
      } else if (labor >= laborDivider * 2) {
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
      };
    });
  }
  function getGroupedMonthlyIntelligenceData(data) {
    const groupedData = {};
    data.forEach((entry) => {
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
    const monthlyAverages = [];
    for (const key of Object.keys(groupedData)) {
      const entries = groupedData[key];
      const avgPP = getAverage(getSum(entries, "profitPercent"), entries.length);
      const variance = getSum(entries, "variance").toFixed(2);
      const smallEntries = entries.filter((item) => item.laborGroup == "S");
      const smallSumPP = getSum(smallEntries, "profitPercent");
      const smallAvgPP = getAverage(smallSumPP, smallEntries.length);
      const medEntries = entries.filter((item) => item.laborGroup == "M");
      const medSumPP = getSum(medEntries, "profitPercent");
      const medAvgPP = getAverage(medSumPP, medEntries.length);
      const largeEntries = entries.filter((item) => item.laborGroup == "L");
      const largeSumPP = getSum(largeEntries, "profitPercent");
      const largeAvgPP = getAverage(largeSumPP, largeEntries.length);
      const smallProfit = getSum(smallEntries, "profit");
      const medProfit = getSum(medEntries, "profit");
      const largeProfit = getSum(largeEntries, "profit");
      const sumP = getSum(entries, "profit");
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
      });
    }
    return monthlyAverages;
  }
  function getAverageProfitPercent(data) {
    const sum = getSum(data, "profitPercent");
    return getAverage(sum, data.length);
  }
  function getAverageVariance(data) {
    var sum = getSum(data, "variance");
    return getAverage(sum, data.length);
  }
  function getLaborGroupings(data) {
    const smalls = data.filter((e) => e.laborGroup == "S");
    const smallAvg = getAverage(getSum(smalls, "profitPercent"), smalls.length);
    const meds = data.filter((e) => e.laborGroup == "M");
    const medAvg = getAverage(getSum(meds, "profitPercent"), meds.length);
    const larges = data.filter((e) => e.laborGroup == "L");
    const largeAvg = getAverage(getSum(larges, "profitPercent"), larges.length);
    const highestLabor = data.reduce((current, entry) => entry.labor > current ? entry.labor : current, 0);
    var avgsArray = [
      { size: "Small", avg: smallAvg },
      { size: "Medium", avg: medAvg },
      { size: "Large", avg: largeAvg }
    ];
    avgsArray.sort((a, b) => b.avg - a.avg);
    return {
      avgs: avgsArray,
      highestLabor
    };
  }
  function getSum(data, field) {
    if (data == 0) {
      return 0;
    }
    if (data.length < 2) {
      return parseFloat(data[0][field]);
    }
    return parseFloat(data.reduce((total, entry) => total += entry[field], 0));
  }
  function sumArray(array) {
    return array.reduce((a, b) => a + b, 0);
  }
  function getAverage(sum, total) {
    const avg = sum / total;
    return avg.toFixed(2);
  }

  // src/charts.js
  var profitCtx = document.getElementById("profitCtx");
  var profitCard = document.getElementById("profitCard");
  var profitChart;
  var varianceCtx = document.getElementById("varianceCtx");
  var varianceCard = document.getElementById("varianceCard");
  var varianceChart;
  var laborCtx = document.getElementById("laborCtx");
  var smallLaborRange = document.getElementById("smallLaborRange");
  var mediumLaborRange = document.getElementById("mediumLaborRange");
  var largeLaborRange = document.getElementById("largeLaborRange");
  var laborProfitCtx = document.getElementById("laborProfitCtx");
  var laborChart;
  var laborProfitChart;
  function buildCharts(data) {
    console.log("Build charts called");
    const biData = getGroupedMonthlyIntelligenceData(data);
    console.log("BI Data", biData);
    const avgProfitPercent = getAverageProfitPercent(data);
    const avgVariance = getAverageVariance(data);
    const laborData = getLaborGroupings(data);
    profitChart = new Chart(profitCtx, getProfitChartConfiguration(biData));
    profitCard.innerText = avgProfitPercent + "%";
    if (avgVariance > 0) {
      varianceCard.innerText = "$" + avgVariance;
      varianceCard.classList.add("text-success");
    } else {
      varianceCard.innerText = "-$" + avgVariance * -1;
      varianceCard.classList.add("text-danger");
    }
    varianceChart = new Chart(varianceCtx, getVarianceChartConfiguration(biData));
    laborChart = new Chart(laborCtx, getLaborChartConfiguration(biData));
    const smallLaborSum = sumArray(biData.map((e) => e.smallLaborProfit));
    const mediumLaborSum = sumArray(biData.map((e) => e.mediumLaborProfit));
    const largeLaborSum = sumArray(biData.map((e) => e.largeLaborProfit));
    laborProfitChart = new Chart(laborProfitCtx, getLaborProfitChartConfiguration(smallLaborSum, mediumLaborSum, largeLaborSum));
    smallLaborRange.innerText = getLaborRangeLabel("Small", laborData.highestLabor);
    mediumLaborRange.innerText = getLaborRangeLabel("Medium", laborData.highestLabor);
    largeLaborRange.innerText = getLaborRangeLabel("Large", laborData.highestLabor);
  }
  function getLaborRangeLabel(size, highestLabor) {
    const divider = highestLabor / 3;
    if (size == "Small") {
      return "$" + divider.toFixed(2);
    } else if (size == "Medium") {
      return "$" + (divider + 1).toFixed(2) + " - $" + (divider * 2).toFixed(2);
    } else {
      return "$" + (divider * 2 + 1).toFixed(2);
    }
  }
  function getProfitChartConfiguration(biData) {
    if (profitChart) {
      profitChart.destroy();
    }
    return {
      type: "bar",
      data: {
        labels: biData.map((e) => e.dateLabel),
        datasets: [
          {
            label: "Profit Percent",
            data: biData.map((e) => e.average),
            yAxisID: "y-left",
            backgroundColor: "rgb(88, 0, 165)",
            borderWidth: 0
          },
          {
            label: "Total Profit",
            data: biData.map((e) => e.total),
            yAxisID: "y-right",
            backgroundColor: "rgb(23, 253, 164)",
            borderWidth: 0
          }
        ]
      },
      options: {
        scales: {
          "y-left": {
            position: "left",
            title: { display: true, text: "Profit Percent" },
            beginAtZero: true,
            ticks: percentScaleTickConfig()
          },
          "y-right": {
            position: "right",
            title: { display: true, text: "Total Profit" },
            beginAtZero: true,
            ticks: dollarScaleTickConfig()
          }
        }
      }
    };
  }
  function getVarianceChartConfiguration(biData) {
    if (varianceChart) {
      varianceChart.destroy();
    }
    return {
      type: "line",
      data: {
        labels: biData.map((e) => e.dateLabel),
        datasets: [{
          label: "Total Estimate vs Actual",
          data: biData.map((e) => e.variance),
          yAxisID: "y-left",
          backgroundColor: "rgb(0, 255, 255)",
          borderColor: "rgb(0, 255, 255)",
          borderWidth: 1.5
        }]
      },
      options: {
        scales: {
          "y-left": {
            position: "left",
            title: { display: true, text: "Estimate vs Actual" },
            beginAtZero: true,
            ticks: dollarScaleTickConfig(),
            grid: {
              color: (context) => context.tick.value === 0 ? "black" : "rgba(0, 0, 0, 0.1)"
              // Bold zero line
              // lineWidth: (context) => context.tick.value === 0 ? 2 : 1 // Thicker zero line
            }
          }
        }
      }
    };
  }
  function getLaborChartConfiguration(biData) {
    if (laborChart) {
      laborChart.destroy();
    }
    return {
      type: "line",
      data: {
        labels: biData.map((e) => e.dateLabel),
        datasets: [
          {
            label: "Small",
            data: biData.map((e) => e.smallLaborAvgProfit),
            borderWidth: 1,
            yAxisID: "y-left",
            spanGaps: true
            // backgroundColor: 'rgb(0, 255, 255)',
            // borderColor: 'rgb(0, 255, 255)',
            // borderWidth: 1.5
          },
          {
            label: "Medium",
            data: biData.map((e) => e.mediumLaborAvgProfit),
            borderWidth: 1,
            yAxisID: "y-left",
            spanGaps: true
            // backgroundColor: 'rgb(88, 0, 165)',
            // borderColor: 'rgb(88, 0, 165)',
            // borderWidth: 1.5
          },
          {
            label: "Large",
            data: biData.map((e) => e.largeLaborAvgProfit),
            borderWidth: 1,
            yAxisID: "y-left",
            spanGaps: true
            // backgroundColor: 'rgb(57, 255, 20)',
            // borderColor: 'rgb(57, 255, 20)',
            // borderWidth: 1.5
          }
        ]
      },
      options: {
        scales: {
          "y-left": {
            position: "left",
            title: { display: true, text: "Profit %" },
            beginAtZero: true,
            ticks: percentScaleTickConfig()
          }
        }
      }
    };
  }
  function getLaborProfitChartConfiguration(smallProfit, medProfit, largeProfit) {
    if (laborProfitChart) {
      laborProfitChart.destroy();
    }
    return {
      type: "doughnut",
      data: {
        labels: [
          "Small",
          "Medium",
          "Large"
        ],
        datasets: [{
          data: [smallProfit, medProfit, largeProfit],
          hoverOffset: 4
        }]
      }
    };
  }
  function percentScaleTickConfig() {
    return {
      callback: function(value) {
        return value + "%";
      }
    };
  }
  function dollarScaleTickConfig() {
    return {
      callback: function(value) {
        return "$" + value.toLocaleString();
      }
    };
  }

  // src/main.js
  var { fromEvent } = rxjs;
  var { switchMap, map, tap } = rxjs.operators;
  var fileInput = document.getElementById("file");
  var output = document.getElementById("output");
  var modal = document.getElementById("csvInstructionsModal");
  var modalInstance = bootstrap.Modal.getInstance(modal);
  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(modal);
  }
  var fileInputChange$ = fromEvent(fileInput, "change");
  function launch() {
    initEventStreams();
    var transformedData = transformData(sampleData);
    console.log("Transformed", transformedData);
    showData(transformedData);
  }
  function showData(transformedData) {
    output.textContent = JSON.stringify(transformedData, null, 2);
    buildCharts(transformedData);
  }
  function initEventStreams() {
    fileInputChange$.pipe(
      // Step 1: Read the file
      switchMap((event) => {
        const file = event.target.files[0];
        if (!file) {
          return rxjs.EMPTY;
        }
        return new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            // Convert rows to objects using the headers as keys
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error)
          });
        });
      }),
      // Step 2: Transform
      map((parsedData) => {
        return transformData(parsedData);
      })
    ).subscribe({
      next: (transformedData) => {
        showData(transformedData);
        modalInstance.hide();
      },
      error: (err) => console.error("Error Processing File: ", err),
      complete: () => console.log("Processing File Complete")
    });
  }
  window.launch = launch;
})();
