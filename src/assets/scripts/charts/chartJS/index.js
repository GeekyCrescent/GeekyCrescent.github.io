import Chart from 'chart.js/auto';
import { COLORS } from '../../constants/colors';


export default (function () {
  // ------------------------------------------------------
  // @Line Charts
  // ------------------------------------------------------

  const lineChartBox = document.getElementById('line-chart');

  if (lineChartBox) {
    const lineCtx = lineChartBox.getContext('2d');
    lineChartBox.height = 80;

    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label                : 'Series A',
          backgroundColor      : 'rgba(237, 231, 246, 0.5)',
          borderColor          : COLORS['deep-purple-500'],
          pointBackgroundColor : COLORS['deep-purple-700'],
          borderWidth          : 2,
          data                 : [60, 50, 70, 60, 50, 70, 60],
        }, {
          label                : 'Series B',
          backgroundColor      : 'rgba(232, 245, 233, 0.5)',
          borderColor          : COLORS['blue-500'],
          pointBackgroundColor : COLORS['blue-700'],
          borderWidth          : 2,
          data                 : [70, 75, 85, 70, 75, 85, 70],
        }],
      },

      options: {
        legend: {
          display: false,
        },
      },

    });
  }

  // ------------------------------------------------------
  // @Bar Charts
  // ------------------------------------------------------

  const barChartBox = document.getElementById('bar-chart');
  const yearFilter = document.getElementById('year-filter');
  
  if (barChartBox && yearFilter) {
      const barCtx = barChartBox.getContext('2d');
      let chart; // Store chart instance for future updates
  
      // Load data from CSV and initialize the chart
      d3.csv("nombre_archivo_ord.csv").then(data => {
          // Extract unique years from 'fecha_hecho' column
          const years = Array.from(new Set(data.map(d => new Date(d.fecha_hecho).getFullYear())));
          years.sort().forEach(year => {
              const option = document.createElement("option");
              option.value = year;
              option.textContent = year;
              yearFilter.appendChild(option);
          });
  
          // Initial chart load with all data
          updateChart("all");
  
          // Event listener for year filter
          yearFilter.addEventListener("change", (event) => {
              updateChart(event.target.value);
          });
  
          function updateChart(selectedYear) {
              // Filter data by selected year
              const filteredData = selectedYear === "all" 
                  ? data 
                  : data.filter(d => new Date(d.fecha_hecho).getFullYear() === parseInt(selectedYear));
  
              // Group data by 'alcaldia_catalogo' and count cases
              const labels = [];
              const alcaldiaData = [];
              const groupData = d3.rollup(filteredData, v => v.length, d => d.alcaldia_catalogo);
  
              // Format data for the chart
              groupData.forEach((count, alcaldia) => {
                  labels.push(alcaldia);
                  alcaldiaData.push(count);
              });
  
              // Define colors
              const COLORS = {
                  'deep-purple-500': 'rgba(103, 58, 183, 0.5)',
                  'deep-purple-800': 'rgba(74, 20, 140, 0.8)',
              };
  
              // Destroy old chart if it exists, then create a new one
              if (chart) chart.destroy();
              chart = new Chart(barCtx, {
                  type: 'bar',
                  data: {
                      labels: labels,
                      datasets: [
                          {
                              label: 'Casos por Alcaldía',
                              backgroundColor: COLORS['deep-purple-500'],
                              borderColor: COLORS['deep-purple-800'],
                              borderWidth: 1,
                              data: alcaldiaData,
                          },
                      ],
                  },
                  options: {
                      responsive: true,
                      plugins: {
                          legend: {
                              position: 'bottom',
                          },
                      },
                      scales: {
                          x: {
                              ticks: {
                                  autoSkip: false,
                                  maxRotation: 45,
                                  minRotation: 45,
                              }
                          }
                      }
                  },
              });
          }
      });
  }
  
  

  // ------------------------------------------------------
  // @Area Charts
  // ------------------------------------------------------

  const barChartBox2 = document.getElementById('bar-chart2');
const yearFilter2 = document.getElementById('year-filter'); // Ensure this is the correct filter ID
const alcaldiaFilter2 = document.getElementById('alcaldia-filter');

if (barChartBox2 && yearFilter2 && alcaldiaFilter2) {
    const barCtx = barChartBox2.getContext('2d');
    let chart; // Store chart instance for future updates

    // Load data from CSV and initialize the chart
    d3.csv("nombre_archivo_ord.csv").then(data => {
        // Extract unique alcaldías from 'alcaldia_catalogo' column
        const alcaldias = Array.from(new Set(data.map(d => d.alcaldia_catalogo)));
        alcaldias.sort().forEach(alcaldia => {
            const option = document.createElement("option");
            option.value = alcaldia;
            option.textContent = alcaldia;
            alcaldiaFilter2.appendChild(option); // Add options to alcaldiaFilter2
        });

        // Initial chart load with all data
        updateChart("all", "all"); // Add default value for alcaldía filter

        // Event listener for year filter
        yearFilter2.addEventListener("change", (event) => {
            updateChart(event.target.value, alcaldiaFilter2.value);
        });

        // Event listener for alcaldía filter
        alcaldiaFilter2.addEventListener("change", (event) => {
            updateChart(yearFilter2.value, event.target.value);
        });

        function updateChart(selectedYear, selectedAlcaldia) {
            // Filter data by selected year
            const filteredData = selectedYear === "all" 
                ? data 
                : data.filter(d => new Date(d.fecha_hecho).getFullYear() === parseInt(selectedYear));

            // Further filter by selected alcaldía
            const finalData = selectedAlcaldia === "all" 
                ? filteredData 
                : filteredData.filter(d => d.alcaldia_catalogo === selectedAlcaldia);

            // Group data by 'categoria_delito' and count occurrences
            const groupData = d3.rollup(finalData, v => v.length, d => d.categoria_delito);

            // Convert grouped data to an array and sort by count
            const sortedGroupData = Array.from(groupData)
                .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                .slice(0, 6); // Limit to the top 6 categories

            // Prepare labels and data for the chart
            const labels = sortedGroupData.map(([categoria]) => categoria);
            const delitoData = sortedGroupData.map(([, count]) => count);

            // Define colors
            const COLORS = {
                'deep-purple-500': 'rgba(103, 58, 183, 0.5)',
                'deep-purple-800': 'rgba(74, 20, 140, 0.8)',
            };

            // Destroy old chart if it exists, then create a new one
            if (chart) chart.destroy();
            chart = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Casos por Categoría de Delito',
                            backgroundColor: COLORS['deep-purple-500'],
                            borderColor: COLORS['deep-purple-800'],
                            borderWidth: 1,
                            data: delitoData,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    indexAxis: 'y', // Set indexAxis to 'y' for horizontal bars
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                    },
                    scales: {
                        x: {
                            beginAtZero: true, // Ensure the x-axis starts at 0
                        },
                        y: {
                            ticks: {
                                autoSkip: false,
                            },
                        },
                    },
                },
            });
        }
    });
}

  // ------------------------------------------------------
  // @Scatter Charts
  // ------------------------------------------------------



// Cargar el archivo CSV

// Cargar el archivo CSV


}())
