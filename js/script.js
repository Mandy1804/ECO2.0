// Aguarda o documento estar pronto para executar o script
$(document).ready(function() {
    // Animação do header ao rolar a página
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.main_header').addClass('scrolled');
        } else {
            $('.main_header').removeClass('scrolled');
        }
    });

    // Inicialização da biblioteca Lightbox para a galeria
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });

    // --- Simulação de Backend com LocalStorage ---
    // Os dados serão armazenados no navegador do usuário

    // Variáveis para armazenar os dados (simulando um banco de dados)
    let pontosDescarte = [];
    let agendamentos = [];

    // Função para carregar os dados do LocalStorage
    function carregarDados() {
        const storedPontos = localStorage.getItem('pontosDescarte');
        if (storedPontos) {
            // Se houver dados, parseia a string JSON de volta para um array de objetos
            pontosDescarte = JSON.parse(storedPontos);
        }

        const storedAgendamentos = localStorage.getItem('agendamentos');
        if (storedAgendamentos) {
            // Se houver dados, parseia a string JSON de volta para um array de objetos
            agendamentos = JSON.parse(storedAgendamentos);
        }
    }

    // Função para salvar os dados no LocalStorage
    function salvarDados() {
        // Converte o array de objetos para uma string JSON antes de salvar
        localStorage.setItem('pontosDescarte', JSON.stringify(pontosDescarte));
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    }

    // --- Gerenciamento de Pontos de Descarte ---

    // Referências aos elementos HTML do formulário e lista de pontos
    const formAddPonto = document.getElementById('form-add-ponto');
    const listaPontos = document.getElementById('lista-pontos');

    // Carrega os dados e exibe os pontos de descarte ao carregar a página
    carregarDados();
    exibirPontosDescarte();

    // Adiciona um listener para o evento de submit do formulário de adicionar ponto
    if (formAddPonto) { // Verifica se o formulário existe na página
        formAddPonto.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o recarregamento da página

            // Pega os valores dos campos do formulário
            const nome = document.getElementById('ponto-nome').value;
            const endereco = document.getElementById('ponto-endereco').value;
            const horario = document.getElementById('ponto-horario').value;
            // Divide a string de tipos por vírgula e remove espaços em branco
            const tipos = document.getElementById('ponto-tipos').value.split(',').map(item => item.trim());

            // Cria um novo objeto para o ponto de descarte
            const novoPonto = {
                id: Date.now(), // Gera um ID único baseado no timestamp atual
                nome,
                endereco,
                horario,
                tipos
            };

            // Adiciona o novo ponto ao array
            pontosDescarte.push(novoPonto);
            salvarDados(); // Salva os dados atualizados no LocalStorage
            exibirPontosDescarte(); // Atualiza a lista exibida na tela
            formAddPonto.reset(); // Limpa os campos do formulário
            alert('Ponto de descarte adicionado com sucesso!');
        });
    }

    // Função para exibir os pontos de descarte na lista HTML
    function exibirPontosDescarte() {
        if (!listaPontos) return; // Se o elemento da lista não existir, sai da função

        listaPontos.innerHTML = ''; // Limpa o conteúdo atual da lista

        // Se não houver pontos cadastrados, exibe uma mensagem
        if (pontosDescarte.length === 0) {
            listaPontos.innerHTML = '<p>Nenhum ponto de descarte cadastrado ainda.</p>';
            return;
        }

        // Itera sobre cada ponto e cria o elemento HTML correspondente
        pontosDescarte.forEach(ponto => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item'); // Adiciona a classe 'item' para estilização
            itemDiv.innerHTML = `
                <div>
                    <p><strong>Nome:</strong> ${ponto.nome}</p>
                    <p><strong>Endereço:</strong> ${ponto.endereco}</p>
                    <p><strong>Horário:</strong> ${ponto.horario || 'Não informado'}</p>
                    <p><strong>Tipos Aceitos:</strong> ${ponto.tipos.join(', ') || 'Não informado'}</p>
                </div>
                <button data-id="${ponto.id}">Remover</button>
            `;
            listaPontos.appendChild(itemDiv); // Adiciona o item à lista na página
        });

        // Adiciona listeners de evento para os botões "Remover" de cada item
        listaPontos.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                const idParaRemover = parseInt(this.dataset.id); // Pega o ID do botão
                // Filtra o array, removendo o ponto com o ID correspondente
                pontosDescarte = pontosDescarte.filter(ponto => ponto.id !== idParaRemover);
                salvarDados(); // Salva os dados atualizados
                exibirPontosDescarte(); // Reexibe a lista
                alert('Ponto de descarte removido.');
            });
        });
    }

    // --- Gerenciamento de Agendamentos ---

    // Referências aos elementos HTML do formulário e lista de agendamentos
    const formAgendamento = document.getElementById('form-agendamento');
    const listaAgendamentos = document.getElementById('lista-agendamentos');

    // Exibe os agendamentos ao carregar a página
    exibirAgendamentos();

    // Adiciona um listener para o evento de submit do formulário de agendamento
    if (formAgendamento) { // Verifica se o formulário existe na página
        formAgendamento.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o recarregamento da página

            // Pega os valores dos campos do formulário
            const nome = document.getElementById('ag-nome').value;
            const email = document.getElementById('ag-email').value;
            const telefone = document.getElementById('ag-telefone').value;
            const endereco = document.getElementById('ag-endereco').value;
            const data = document.getElementById('ag-data').value;
            const hora = document.getElementById('ag-hora').value;
            const observacoes = document.getElementById('ag-observacoes').value;

            // Cria um novo objeto para o agendamento
            const novoAgendamento = {
                id: Date.now(), // Gera um ID único
                nome,
                email,
                telefone,
                endereco,
                data,
                hora,
                observacoes
            };

            // Adiciona o novo agendamento ao array
            agendamentos.push(novoAgendamento);
            salvarDados(); // Salva os dados atualizados
            exibirAgendamentos(); // Atualiza a lista exibida na tela
            formAgendamento.reset(); // Limpa os campos do formulário
            alert('Agendamento realizado com sucesso! Em breve entraremos em contato.');
        });
    }

    // Função para exibir os agendamentos na lista HTML
    function exibirAgendamentos() {
        if (!listaAgendamentos) return; // Se o elemento da lista não existir, sai da função

        listaAgendamentos.innerHTML = ''; // Limpa o conteúdo atual da lista

        // Se não houver agendamentos, exibe uma mensagem
        if (agendamentos.length === 0) {
            listaAgendamentos.innerHTML = '<p>Nenhum agendamento realizado ainda.</p>';
            return;
        }

        // Itera sobre cada agendamento e cria o elemento HTML correspondente
        agendamentos.forEach(agendamento => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item'); // Adiciona a classe 'item' para estilização
            itemDiv.innerHTML = `
                <div>
                    <p><strong>Nome:</strong> ${agendamento.nome}</p>
                    <p><strong>Email:</strong> ${agendamento.email}</p>
                    <p><strong>Telefone:</strong> ${agendamento.telefone}</p>
                    <p><strong>Endereço:</strong> ${agendamento.endereco}</p>
                    <p><strong>Data/Hora:</strong> ${agendamento.data} às ${agendamento.hora}</p>
                    <p><strong>Observações:</strong> ${agendamento.observacoes || 'Nenhuma'}</p>
                </div>
                <button data-id="${agendamento.id}">Remover</button>
            `;
            listaAgendamentos.appendChild(itemDiv); // Adiciona o item à lista na página
        });

        // Adiciona listeners de evento para os botões "Remover" de cada item
        listaAgendamentos.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                const idParaRemover = parseInt(this.dataset.id); // Pega o ID do botão
                // Filtra o array, removendo o agendamento com o ID correspondente
                agendamentos = agendamentos.filter(ag => ag.id !== idParaRemover);
                salvarDados(); // Salva os dados atualizados
                exibirAgendamentos(); // Reexibe a lista
                alert('Agendamento removido.');
            });
        });
    }
});