Parse.initialize('jFc8weoj0ooJf9ImqkiTjVg8bkJ1FfPS9nBPjUHS', '1jzfDQ7nCu6UgkoBAwUpqQ3mpg8hpEL5t6auoAAZ');

Parse.serverURL = 'https://parseapi.back4app.com';

async function fetchDataAndDisplay() {
    const TestObject = Parse.Object.extend('censo_inep_2023');
    const query = new Parse.Query(TestObject);
    let allResults = [];

    try {
        let skip = 0; // Começa no início
        const limit = 1000; // Define o limite por consulta (ajuste conforme necessário)
        let results;

        do {
            query.limit(limit);
            query.skip(skip);
            results = await query.find();
            allResults = allResults.concat(results); // Adiciona os resultados à lista completa
            skip += limit; // Avança para a próxima página
        } while (results.length === limit);
    
        console.log(`Total results: ${allResults.length}`);

        // Manipular os dados obtidos
        const quantidadeEscolas = allResults.length;
        const quantidadeComEnergia = allResults.filter(result => result.get('IN_ENERGIA_REDE_PUBLICA') === 1).length;
        const quantidadeComAgua = allResults.filter(result => result.get('IN_AGUA_REDE_PUBLICA') === 1).length;
        const quantidadeComEsgoto = allResults.filter(result => result.get('IN_ESGOTO_REDE_PUBLICA') === 1).length;

        // Atualizar dados no dashboard
        document.getElementById('dado1').textContent = `Quantidade de Escolas: ${quantidadeEscolas}`;
        document.getElementById('dado2').textContent = `Quantidade com energia: ${quantidadeComEnergia}`;
        document.getElementById('dado3').textContent = `Quantidade com água: ${quantidadeComAgua}`;
        document.getElementById('dado4').textContent = `Quantidade de escolas com esgoto: ${quantidadeComEsgoto}`;


        console.log(quantidadeEscolas)

        // Dados para os gráficos
        var data1 = {
            labels: ['Com água', 'Sem água'],
            datasets: [{
                data: [quantidadeComAgua, quantidadeEscolas - quantidadeComAgua],
                backgroundColor: ['blue', 'red']
            }]
        };

        var data2 = {
            labels: ['Com energia', 'Sem energia'],
            datasets: [{
                data: [quantidadeComEnergia, quantidadeEscolas - quantidadeComEnergia],
                backgroundColor: ['green', 'purple']
            }]
        };

        var data3 = {
            labels: ['Com esgoto', 'Sem esgoto'],
            datasets: [{
                data: [quantidadeComEsgoto, quantidadeEscolas - quantidadeComEsgoto],
                backgroundColor: ['gray', 'brown']
            }]
        };

        // Atualizar gráficos
        var options = {
            responsive: true,
            maintainAspectRatio: false
        };

        var ctx1 = document.getElementById('chart1').getContext('2d');
        var chart1 = new Chart(ctx1, {
            type: 'pie',
            data: data1,
            options: options
        });

        var ctx2 = document.getElementById('chart2').getContext('2d');
        var chart2 = new Chart(ctx2, {
            type: 'pie',
            data: data2,
            options: options
        });

        var ctx3 = document.getElementById('chart3').getContext('2d');
        var chart3 = new Chart(ctx3, {
            type: 'pie',
            data: data3,
            options: options
        });

    } catch (error) {
        console.error('Erro ao buscar dados: ', error);
    }
}

window.onload = fetchDataAndDisplay;
