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

  if (barChartBox) {
      const barCtx = barChartBox.getContext('2d');
  
      // Cargar datos desde CSV y luego inicializar el gráfico
      d3.csv("nombre_archivo.csv").then(data => {
          // Asumiendo que el CSV tiene columnas como 'alcaldia_hecho', 'delito', y 'anio_inicio'
          const labels = [];
          const alcaldiaData = [];
          const delitoData = [];
  
          // Agrupar datos por 'alcaldia_hecho' y 'delito', y contar los casos
          const groupData = d3.rollup(data, v => v.length, d => d.alcaldia_catalogo, d => d.categoria_delito);
  
          // Convertir los datos agrupados a formato para el gráfico
          groupData.forEach((delitos, alcaldia) => {
              labels.push(alcaldia);
              let count = 0;
              delitos.forEach((delitoCount) => count += delitoCount);
              alcaldiaData.push(count);
          });
  
          // Definir colores
          const COLORS = {
              'deep-purple-500': 'rgba(103, 58, 183, 0.5)',
              'deep-purple-800': 'rgba(74, 20, 140, 0.8)',
          };
  
          // Crear el gráfico de barras
          new Chart(barCtx, {
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
              },
          });
      });
  }
  

  // ------------------------------------------------------
  // @Area Charts
  // ------------------------------------------------------

  const areaChartBox = document.getElementById('area-chart');

  if (areaChartBox) {
    const areaCtx = areaChartBox.getContext('2d');

    new Chart(areaCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          backgroundColor : 'rgba(3, 169, 244, 0.5)',
          borderColor     : COLORS['light-blue-800'],
          data            : [10, 50, 20, 40, 60, 30, 70],
          label           : 'Dataset',
          fill            : 'start',
        }],
      },
    });
  }

  // ------------------------------------------------------
  // @Scatter Charts
  // ------------------------------------------------------

  const scatterChartBox = document.getElementById('scatter-chart');

  if (scatterChartBox) {
    const scatterCtx = scatterChartBox.getContext('2d');

    new Chart(scatterCtx, {
      type: 'scatter',
      data: {
        datasets: [{
          label           : 'My First dataset',
          borderColor     : COLORS['red-500'],
          backgroundColor : COLORS['red-500'],
          data: [
            { x: 10, y: 20 },
            { x: 30, y: 40 },
            { x: 50, y: 60 },
            { x: 70, y: 80 },
            { x: 90, y: 100 },
            { x: 110, y: 120 },
            { x: 130, y: 140 },
          ],
        }, {
          label           : 'My Second dataset',
          borderColor     : COLORS['green-500'],
          backgroundColor : COLORS['green-500'],
          data: [
            { x: 150, y: 160 },
            { x: 170, y: 180 },
            { x: 190, y: 200 },
            { x: 210, y: 220 },
            { x: 230, y: 240 },
            { x: 250, y: 260 },
            { x: 270, y: 280 },
          ],
        }],
      },
    });
  }
}())
