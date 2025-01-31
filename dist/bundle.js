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
      "Job Date": "2025-10-15",
      "Description": "Carter, Clog removal",
      "Labor": "500",
      "Materials": "45",
      "Overhead": "50",
      "Amount Received": "700",
      "Original Estimate": "700"
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
      const jobDateUtc = Date.parse(entry["Job Date"]);
      const jobDate = new Date(jobDateUtc);
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
      const monthNumber = jobDate.getMonth() + 1;
      const year = jobDate.getFullYear();
      const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthLabel = monthLabels[jobDate.getMonth()];
      const dateLabel = monthLabel + "-" + year;
      var laborGroup = "S";
      if (labor >= laborDivider && labor < laborDivider * 2) {
        laborGroup = "M";
      } else if (labor >= laborDivider * 2) {
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
      };
    });
  }
  function getGroupedMonthlyProfitData(data) {
    const groupedData = {};
    data.forEach((entry) => {
      const dateLabel = entry.dateLabel;
      if (!groupedData[dateLabel]) {
        groupedData[dateLabel] = [];
      }
      groupedData[dateLabel].push({
        ProfitPercent: entry.profitPercent,
        Profit: entry.profit
      });
    });
    const monthlyAverages = [];
    for (const key of Object.keys(groupedData)) {
      const entry = groupedData[key];
      const sumPP = entry.reduce((acc, pp) => acc + pp.ProfitPercent, 0);
      const avgPP = (sumPP / entry.length).toFixed(2);
      const sumP = entry.reduce((acc, p) => acc + p.Profit, 0);
      monthlyAverages.push({
        "total": parseFloat(sumP),
        "average": parseFloat(avgPP),
        "dateLabel": key
      });
    }
    return monthlyAverages;
  }

  // src/charts.js
  var ctx = document.getElementById("myChart");
  var chart;
  function buildCharts(data) {
    console.log("Build charts called");
    const profitBI = getGroupedMonthlyProfitData(data);
    console.log(profitBI);
    if (chart) {
      chart.destroy();
    }
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: profitBI.map((e) => e.dateLabel),
        datasets: [
          {
            label: "Profit Percent",
            data: profitBI.map((e) => e.average),
            borderWidth: 1,
            yAxisID: "y-left"
          },
          {
            label: "Total Profit",
            data: profitBI.map((e) => e.total),
            borderWidth: 1,
            yAxisID: "y-right"
          }
        ]
      },
      options: {
        scales: {
          "y-left": {
            position: "left",
            title: { display: true, text: "Profit Percent" },
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + "%";
              }
            }
          },
          "y-right": {
            position: "right",
            title: { display: true, text: "Total Profit" },
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return "$" + value.toLocaleString();
              }
            }
          }
        }
      }
    });
  }

  // src/main.js
  var { fromEvent } = rxjs;
  var { switchMap, map, tap } = rxjs.operators;
  var fileInput = document.getElementById("file");
  var output = document.getElementById("output");
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
      },
      error: (err) => console.error("Error Processing File: ", err),
      complete: () => console.log("Processing File Complete")
    });
  }
  window.launch = launch;
})();
