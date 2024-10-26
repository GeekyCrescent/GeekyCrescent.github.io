import Chart from 'chart.js/auto';

const lineChartBox = document.getElementById('line-chart2');

if (lineChartBox) {
  const lineCtx = lineChartBox.getContext('2d');
  let chart;

  // Cargar los datos de ambos CSV
  Promise.all([
    d3.csv("Predicciones_finales.csv"),
    d3.csv("nombre_archivo_ord.csv")
  ]).then(([prediccionesData, nombreData]) => {
    
    // Procesar datos de Predicciones_finales
    const prediccionesPorFecha = d3.rollup(
      prediccionesData,
      v => d3.sum(v, d => +d['Predicción de Delitos']),
      d => d.Fecha
    );
    
    // Procesar datos de nombre_archivo_ord
    const casosPorFecha = d3.rollup(
      nombreData,
      v => v.length,
      d => d.fecha_hecho
    );
    
    // Convertir datos a formato de Chart.js
    const labels = Array.from(new Set([...prediccionesPorFecha.keys(), ...casosPorFecha.keys()])).sort();
    const prediccionesDataset = labels.map(label => prediccionesPorFecha.get(label) || 0);
    const casosDataset = labels.map(label => casosPorFecha.get(label) || 0);

    // Colores
    const COLORS = {
      'deep-red': 'rgba(255, 99, 132, 0.5)',
      'deep-blue': 'rgba(54, 162, 235, 0.5)',
    };

    // Crear gráfico de líneas
    if (chart) chart.destroy();
    chart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Predicción de Delitos',
            backgroundColor: COLORS['deep-red'],
            borderColor: COLORS['deep-red'],
            borderWidth: 2,
            fill: false,
            data: prediccionesDataset,
          },
          {
            label: 'Casos Reportados',
            backgroundColor: COLORS['deep-blue'],
            borderColor: COLORS['deep-blue'],
            borderWidth: 2,
            fill: false,
            data: casosDataset,
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
              text: 'Fecha',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad de Delitos',
            },
          },
        },
      },
    });
  });
}