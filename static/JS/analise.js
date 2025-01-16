
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const performanceChart = new Chart(ctx, {
        type: 'line', // Ou 'bar' para barras
        data: {
            labels: {{ simulados | map(attribute='nome') | list | tojson }},
            datasets: [{
                label: 'Performance (%)',
                data: {{ simulados | map(attribute='porcentagem') | list | tojson }},
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.raw + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Porcentagem de Acertos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Simulados'
                    }
                }
            }
        }
    });
</script>
