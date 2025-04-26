let myChart = null;
    
        function formatarMoeda(valor) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        }
    
        function calcular() {
            const capital = parseFloat(document.getElementById('capital').value) || 0;
            const contribuicao = parseFloat(document.getElementById('contribuicao').value) || 0;
            const taxaAnual = parseFloat(document.getElementById('taxa').value) / 100;
            const anos = parseInt(document.getElementById('tempo').value);
    
            if (anos < 1 || isNaN(anos)) {
                alert('Por favor insira um período válido (mínimo 1 ano)');
                return;
            }
    
            const taxaMensal = Math.pow(1 + taxaAnual, 1/12) - 1;
            const meses = anos * 12;
    
            let montante = capital;
            const historico = [];
    
            for(let i = 0; i < meses; i++) {
                montante = (montante + contribuicao) * (1 + taxaMensal);
                if ((i + 1) % 12 === 0) {
                    historico.push(montante);
                }
            }
    
            const jurosTotal = montante - (capital + (contribuicao * meses));
            
            document.getElementById('montante').textContent = formatarMoeda(montante);
            document.getElementById('juros').textContent = formatarMoeda(jurosTotal);
            document.getElementById('rentabilidade').textContent = `${(taxaAnual * 100).toFixed(2)}% a.a.`;
    
            // Atualizar gráfico
            const ctx = document.getElementById('grafico').getContext('2d');
            if(myChart) myChart.destroy();
    
            const styles = getComputedStyle(document.documentElement);
            const accentColor = styles.getPropertyValue('--accent');
    
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: anos}, (_, i) => i + 1),
                    datasets: [{
                        label: 'Evolução Patrimonial',
                        data: historico,
                        borderColor: accentColor,
                        backgroundColor: 'rgba(0,191,165,0.05)',
                        borderWidth: 3,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: (context) => 'Valor: ' + formatarMoeda(context.parsed.y)
                            }
                        }
                    },
                    scales: {
                        x: { 
                            title: { 
                                display: true, 
                                text: 'Anos',
                                color: '#666'
                            }
                        },
                        y: { 
                            title: { 
                                display: true, 
                                text: 'Valor Acumulado',
                                color: '#666'
                            },
                            ticks: { 
                                callback: (value) => formatarMoeda(value),
                                color: '#666'
                            },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        }
                    }
                }
            });
        
            // Scroll suave para os resultados
    document.getElementById('resultados').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
        }