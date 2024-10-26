import Chart from 'chart.js/auto';

export default (function () {
  const lineChartBox = document.getElementById('line-chart');
  const yearFilter = document.getElementById('year-filter');
  
  if (lineChartBox) {
      const lineCtx = lineChartBox.getContext('2d');
      let chart; // Guarda la instancia del gráfico para actualizaciones futuras

      // Cargar datos desde el CSV y inicializar el gráfico
      d3.csv("predicciones_finales.csv").then(data => {
          // Extraer años únicos de la columna 'Fecha'
          const years = Array.from(new Set(data.map(d => new Date(d.Fecha).getFullYear())));
          years.sort().forEach(year => {
              const option = document.createElement("option");
              option.value = year;
              option.textContent = year;
              yearFilter.appendChild(option);
          });

          // Cargar gráfico inicial con todos los datos
          updateChart("all");

          // Escuchar cambios en el filtro de año
          yearFilter.addEventListener("change", (event) => {
              updateChart(event.target.value);
          });

          function updateChart(selectedYear) {
              // Filtrar datos por año seleccionado
              const filteredData = selectedYear === "all" 
                  ? data 
                  : data.filter(d => new Date(d.Fecha).getFullYear() === parseInt(selectedYear));

              // Agrupar datos por 'Alcaldía' y calcular la predicción total de delitos
              const labels = [];
              const alcaldiaData = [];
              const groupData = d3.rollup(filteredData, 
                  v => d3.sum(v, d => +d['Predicción de Delitos']), 
                  d => d.Alcaldía
              );

              // Formatear datos para el gráfico
              groupData.forEach((prediccion, alcaldia) => {
                  labels.push(alcaldia);
                  alcaldiaData.push(prediccion);
              });

              // Colores
              const COLORS = {
                'deep-blue-500': 'rgba(54, 162, 235, 0.5)',
                'deep-blue-800': 'rgba(54, 162, 235, 0.8)',
              };

              // Destruir el gráfico anterior si existe y crear uno nuevo
              if (chart) chart.destroy();
              chart = new Chart(lineCtx, {
                  type: 'line',
                  data: {
                      labels: labels,
                      datasets: [
                          {
                              label: 'Predicción de Delitos por Alcaldía',
                              backgroundColor: COLORS['deep-blue-500'],
                              borderColor: COLORS['deep-blue-800'],
                              borderWidth: 2,
                              data: alcaldiaData,
                              fill: false,
                              tension: 0.4, // Suavizar las líneas
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
                          },
                          y: {
                              beginAtZero: true,
                              title: {
                                  display: true,
                                  text: 'Predicción de Delitos',
                              }
                          }
                      }
                  },
              });
          }
      });
  }
}());
