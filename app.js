document.getElementById('calculateBtn').addEventListener('click', function() {
    const exercise = document.getElementById('exerciseSelect').value;
    const method = document.getElementById('methodSelect').value;
    let n = parseInt(document.getElementById('subintervals').value);

    let f, a, b;

    switch(exercise) {
        case '19':
            f = x => x * Math.exp(2 * x);
            a = 0; b = 1;
            break;
        case '20':
            f = x => 1 / (1 + x * x);
            a = 0; b = 1;
            break;
        case '21':
            f = x => Math.sqrt(1 + Math.pow(x, 3));
            a = 0; b = 2;
            break;
        case '22':
            f = x => Math.sin(x) / x;
            a = 0.1; b = 1.0;
            break;
        case '23':
            f = x => Math.log(x);
            a = 1; b = 3;
            break;
        case '25':
            f = x => Math.exp(-x * x);
            a = 0; b = 1;
            break;
        case '27':
            f = x => Math.cos(x * x);
            a = 0; b = Math.sqrt(Math.PI / 2);
            break;
    }

    if (method === 'simpson13' && n % 2 !== 0) n++;
    if (method === 'simpson38' && n % 3 !== 0) n += (3 - (n % 3));

    const h = (b - a) / n;
    let xValues = [];
    let yValues = [];

    for (let i = 0; i <= n; i++) {
        let xi = a + i * h;
        xValues.push(xi.toFixed(4));
        yValues.push(f(xi));
    }

    let result = 0;
    let methodTitle = '';

    if (method === 'trapezoidal') {
        let sum = yValues[0] + yValues[n];
        for (let i = 1; i < n; i++) sum += 2 * yValues[i];
        result = (h / 2) * sum;
        methodTitle = 'Regla del Trapecio Compuesto';
    } else if (method === 'simpson13') {
        let sum = yValues[0] + yValues[n];
        for (let i = 1; i < n; i++) sum += (i % 2 === 0 ? 2 : 4) * yValues[i];
        result = (h / 3) * sum;
        methodTitle = 'Regla de Simpson 1/3';
    } else if (method === 'simpson38') {
        let sum = yValues[0] + yValues[n];
        for (let i = 1; i < n; i++) sum += (i % 3 === 0 ? 2 : 3) * yValues[i];
        result = ((3 * h) / 8) * sum;
        methodTitle = 'Regla de Simpson 3/8';
    }

    let htmlOutput = `
        <p><strong>Método Aplicado:</strong> ${methodTitle}</p>
        <p><strong>Intervalos (n):</strong> ${n} | <strong>Tamaño de paso (h):</strong> ${h.toFixed(4)}</p>
        <p><strong>Valor Integral Aproximado:</strong> <span style="font-size: 1.3em; color: #16a34a; font-weight: bold;">${result.toFixed(6)}</span></p>
    `;

    document.getElementById('outputResults').innerHTML = htmlOutput;
    document.getElementById('resultsSection').style.display = 'block';

    renderChart(xValues, yValues);
});

let myChart = null;
function renderChart(xData, yData) {
    const ctx = document.getElementById('integrationChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xData,
            datasets: [{
                label: 'Comportamiento de f(x)',
                data: yData,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { font: { family: 'Inter' } } }
            }
        }
    });
}
