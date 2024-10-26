Chart.register(ChartjsAdapterDateFns); // Register the date adapter

function createLinePlot(predData, hechoData) {
    const ctx = document.getElementById('line-chart2').getContext('2d');

    const predDates = predData.map(d => d.Fecha);
    const predValues = predData.map(d => d['Predicción de Delitos']);

    const hechoDates = hechoData.map(d => d.fecha_hecho);
    const hechoValues = hechoData.map(d => 1); // Usar 1 como valor arbitrario

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...predDates, ...hechoDates],
            datasets: [
                {
                    label: 'Predicción de Delitos',
                    data: predValues,
                    borderColor: 'blue',
                    fill: false,
                },
                {
                    label: 'Hechos',
                    data: hechoValues,
                    borderColor: 'red',
                    fill: false,
                },
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cantidad'
                    }
                }
            }
        }
    });
}

// Datos de ejemplo
const predData = [
    { Alcaldía: 'CUAUHTEMOC', Fecha: '2024-01-01', 'Predicción de Delitos': 59 },
    // Más datos...
];

const hechoData = [
    { fecha_hecho: '2024-05-03', hora_hecho: '02:00:00', categoria_delito: 'DELITO DE BAJO IMPACTO', colonia_hecho: 'CENTRO DE AZCAPOTZALCO', alcaldia_catalogo: 'Azcapotzalco', latitud: 19.4812541059562, longitud: -99.186331915711 },
    // Más datos...
];

createLinePlot(predData, hechoData);
