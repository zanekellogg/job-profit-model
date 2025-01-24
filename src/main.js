import { sampleData } from './sample-data.js';
import { transformData } from './data.js';
import { buildCharts } from './charts.js';

const { fromEvent } = rxjs;
const { switchMap, map, tap } = rxjs.operators;

// Init elements
const fileInput = document.getElementById("file");
const output = document.getElementById('output');

// Init event streams
const fileInputChange$ = fromEvent(fileInput, 'change');

function launch()
{
    // Initializers
    initEventStreams();

    // console.log('Imported JSON Data:', sampleData);

    var transformedData = transformData(sampleData);
    console.log('Transformed', transformedData);

    showData(transformedData);
}

function showData(transformedData) {
    console.log(transformedData);
    output.textContent = JSON.stringify(transformedData, null, 2);
    buildCharts(transformedData);
}

function initEventStreams()
{
    // File input changed
    fileInputChange$.pipe(
        // Step 1: Read the file
        switchMap(event => {
            const file = event.target.files[0];
            if (!file) {
                return rxjs.EMPTY;
            }

            return new Promise((resolve, reject) => {
                Papa.parse(file, {
                    header: true, // Convert rows to objects using the headers as keys
                    skipEmptyLines: true,
                    complete: (results) => resolve(results.data),
                    error: (error) => reject(error)
                });                            
            })
        }),
        // Step 2: Transform
        map(parsedData => {
            return transformData(parsedData);
        })
    ).subscribe({
        next: transformedData => {
            showData(transformedData);
        },
        error: err => console.error("Error: ", err),
        complete: () => console.log("Processing Complete")
    });
}

window.launch = launch;