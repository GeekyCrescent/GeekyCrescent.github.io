import Chart from 'chart.js/auto';
import { COLORS } from '../../constants/colors';


export default (function () {
  // ------------------------------------------------------
  // @Line Charts
  // ------------------------------------------------------

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
                'deep-red-500': 'rgba(255, 0, 0, 0.5)',
                'deep-red-800': 'rgba(139, 0, 0, 0.8)',
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
                              backgroundColor: COLORS['deep-red-500'],
                              borderColor: COLORS['deep-red-800'],
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
                'deep-red-500': 'rgba(255, 0, 0, 0.5)',
                'deep-red-800': 'rgba(139, 0, 0, 0.8)',
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
                            backgroundColor: COLORS['deep-red-500'],
                            borderColor: COLORS['deep-red-800'],
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


const lineChartBox = document.getElementById('line-chart');
const yearFilter3 = document.getElementById('year-filter');
const delitoFilter3 = document.getElementById('delito-filter');
const alcaldiaFilter3 = document.getElementById('alcaldia-filter');

if (lineChartBox && yearFilter3 && delitoFilter3 && alcaldiaFilter3) {
    const lineCtx = lineChartBox.getContext('2d');
    let chart; // Almacena la instancia del gráfico para futuras actualizaciones

    // Cargar datos desde CSV e inicializar el gráfico
    d3.csv("nombre_archivo_ord.csv").then(data => {
        // Extraer tipos únicos de delito de la columna 'categoria_delito'
        const delitos = Array.from(new Set(data.map(d => d.categoria_delito)));
        delitos.sort().forEach(delito => {
            const option = document.createElement("option");
            option.value = delito;
            option.textContent = delito;
            delitoFilter3.appendChild(option); // Añadir opciones al filtro de delito
        });

        // Cargar gráfico inicial con todos los datos
        updateChart("all", "all");

        // Evento para el filtro de año
        yearFilter3.addEventListener("change", (event) => {
            updateChart(event.target.value, delitoFilter3.value, alcaldiaFilter3.value);
        });

        // Evento para el filtro de delito
        delitoFilter3.addEventListener("change", (event) => {
            updateChart(yearFilter3.value, event.target.value, alcaldiaFilter3.value);
        });

        // Evento para el filtro de alcaldía
        alcaldiaFilter3.addEventListener("change", (event) => {
            updateChart(yearFilter3.value, delitoFilter3.value, event.target.value);
        });

        function updateChart(selectedYear, selectedDelito, selectedAlcaldia) {
          // Filtrar datos por año seleccionado
          const filteredData = selectedYear === "all"
              ? data
              : data.filter(d => new Date(d.fecha_hecho).getFullYear() === parseInt(selectedYear));
      
          // Filtrar adicionalmente por tipo de delito seleccionado
          const delitoData = selectedDelito === "all"
              ? filteredData
              : filteredData.filter(d => d.categoria_delito === selectedDelito);
      
          // Filtrar adicionalmente por alcaldía seleccionada
          const finalData = selectedAlcaldia === "all"
              ? delitoData
              : delitoData.filter(d => d.alcaldia_catalogo === selectedAlcaldia);
          
          // Agrega un log para revisar finalData
          console.log("Final Data:", finalData); // Verifica qué datos están aquí
      
          // Agrupar datos por hora y contar ocurrencias
          const groupData = d3.rollup(finalData, v => v.length, d => parseInt(d.hora_hecho.split(':')[0]));
          
          // Agrega un log para revisar groupData
          console.log("Grouped Data:", Array.from(groupData)); // Verifica los datos agrupados
      
          // Convertir datos agrupados a un array y ordenar por hora
          const sortedGroupData = Array.from(groupData).sort((a, b) => a[0] - b[0]);
          
          // Asegurarse de que todas las horas están presentes en las etiquetas
          const labels = Array.from({length: 24}, (_, i) => `${i}:00`);
          const countData = labels.map(label => {
              const hour = parseInt(label.split(":")[0]);
              const dataItem = sortedGroupData.find(([h]) => h === hour);
              return dataItem ? dataItem[1] : 0;
          });
      
          // Asegúrate de que countData tenga los valores esperados
          console.log("Count Data:", countData); // Verifica el conteo por hora
      
          // Definir colores
          const COLORS = {
              'deep-red-500': 'rgba(255, 0, 0, 0.5)',
              'deep-red-800': 'rgba(139, 0, 0, 0.8)',
          };
      
          // Destruir gráfico viejo si existe, luego crear uno nuevo
          if (chart) chart.destroy();
          chart = new Chart(lineCtx, {
              type: 'line', // Tipo de gráfico de líneas
              data: {
                  labels: labels,
                  datasets: [
                      {
                          label: 'Casos por Hora',
                          backgroundColor: COLORS['deep-red-500'],
                          borderColor: COLORS['deep-red-800'],
                          borderWidth: 2,
                          data: countData,
                          fill: false, // Deshabilitar relleno bajo la línea
                          tension: 0.1, // Suavizar la línea
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
                          title: {
                              display: true,
                              text: 'Hora',
                          },
                      },
                      y: {
                          beginAtZero: true, // Asegurar que el eje y comience en 0
                          title: {
                              display: true,
                              text: 'Número de Casos',
                          },
                      },
                  },
              },
          });
      }
      
    });
}


// ------------------------------------------------------
// @Hour Charts
// ------------------------------------------------------




}())
