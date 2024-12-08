 // Seleciona o modal (div que contém o formulário), o corpo da tabela e os elementos de input do modal
const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');  
const sQtd = document.querySelector('#m-qtd');    
const sData = document.querySelector('#m-data');  
const btnSalvar = document.querySelector('#btnSalvar'); 

// Declara variáveis para armazenar os itens e o id do item que está sendo editado
let itens;
let id;


// Função chamada ao clicar no botão de editar
function editItem(index) {
    openModal(true, index);  // Abre o modal em modo de edição para o item selecionado
}

// Função para abrir o modal (editar ou criar um item)
function openModal(edit = false, index = 0) {
    modal.classList.add('active');  // Torna o modal visível, adicionando a classe 'active'

    // Adiciona um evento de clique ao modal para fechá-lo quando clicar fora da área do conteúdo
    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');  // Fecha o modal ao clicar fora da área interna
        }
    };

  // Se estiver editando, preenche os campos do modal com os dados do item selecionado
    if (edit) {
        sNome.value = itens[index].nome;  //define o valor de sNome como o nome do item no índice index nome.
        sQtd.value = itens[index].qtd;    
        sData.value = formatDateToInput(itens[index].data); // Converte a data para o formato aceito pelo input
        id = index;  // Armazena o índice do item que está sendo editado
    } else {
        // Se não estiver editando, limpa os campos
        sNome.value = '';
        sQtd.value = '';
        sData.value = '';
    }
}

// Onclick no botão de excluir
function deleteItem(index) {
    itens.splice(index, 1);  // Remove o item da lista de itens
    setItensBD();  // Atualiza o armazenamento local
    loadItens();   // Recarrega os itens na tabela
}





// Função para inserir um novo item na tabela
function insertItem(item, index) {
    let tr = document.createElement('tr');  // Cria uma nova linha para a tabela

    // Preenche a linha com os dados do item, incluindo os botões de editar e excluir
    tr.innerHTML = `
        <td>${item.nome}</td>  <!-- Exibe o nome do item -->
        <td>${item.qtd}</td>    <!-- Exibe a quantidade do item -->
        <td>${formatDateToString(item.data)}</td>  <!-- Exibe a data formatada -->
        <td class="acao">
        <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>  <!-- Botão para editar -->
        </td>
        <td class="acao">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>  <!-- Botão para excluir -->
        </td>
    `
    tbody.appendChild(tr);  // Adiciona a nova linha à tabela
}

//  Onclick no botão de "Salvar" 
btnSalvar.onclick = e => {
  // Verifica se todos os campos foram preenchidos
    if (sNome.value == '' || sQtd.value == '' || sData.value == '') {
    return;  // Se algum campo estiver vazio, não faz nada
}

    e.preventDefault();  // Previne o comportamento padrão do formulário (não recarregar a página)

    // Converte a data selecionada para um timestamp (número de milissegundos desde 1970)
    const timestampData = new Date(sData.value).getTime();

  // Se estivermos editando um item existente, atualiza as informações dele
    if (id !== undefined) {
        itens[id].nome = sNome.value; 
        itens[id].qtd = sQtd.value;    
        itens[id].data = timestampData;  
    } else {
        // Se for um novo item, adiciona ele à lista
        itens.push({ 'nome': sNome.value, 'qtd': sQtd.value, 'data': timestampData });
    }

    setItensBD();  // Atualiza os itens no armazenamento local
    modal.classList.remove('active');  // Fecha o modal
    loadItens();  // Recarrega os itens na tabela
    id = undefined;  // Reseta o id, pois o item foi salvo
}





// Função para formatar o timestamp (data em milissegundos) para o formato dd/mm/yyyy
const formatDateToString = (timestamp) => {
    const date = new Date(timestamp);  // Cria um objeto Date a partir do timestamp
    const day = ("0" + date.getDate()).slice(-2);  // Obtém o dia, garantindo que tenha 2 dígitos
    const month = ("0" + (date.getMonth() + 1)).slice(-2);  // Obtém o mês, garantindo que tenha 2 dígitos
    const year = date.getFullYear();  // Obtém o ano
    return `${day}/${month}/${year}`;  // Retorna a data no formato dd/mm/yyyy, com crase
}

// Função para formatar o timestamp para o formato aceito pelo input[type="date"] (yyyy-mm-dd)
const formatDateToInput = (timestamp) => {
    const date = new Date(timestamp);  // Cria um objeto Date a partir do timestamp
    const year = date.getFullYear();  // Obtém o ano
    const month = ("0" + (date.getMonth() + 1)).slice(-2);  // Obtém o mês, garantindo que tenha 2 dígitos
    const day = ("0" + date.getDate()).slice(-2);  // Obtém o dia, garantindo que tenha 2 dígitos
    return `${year}-${month}-${day}`;  // Retorna a data no formato yyyy-mm-dd, com crase
}



// Função para obter os itens armazenados no localStorage
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];

// Função para salvar os itens no localStorage
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));


// Carrega os itens do localStorage e exibe na tabela assim que a página for carregada
loadItens();

// Função para carregar os itens do armazenamento local e exibir na tabela
function loadItens() {
    itens = getItensBD();  // Obtém os itens armazenados no localStorage
    tbody.innerHTML = '';   // Limpa a tabela antes de preenchê-la novamente
    itens.forEach((item, index) => {
    insertItem(item, index);  // Insere cada item na tabela
});
}


// Função de pesquisa
function search() {
    // Obtém o valor da pesquisa
    var input = document.getElementById("searchInput").value.trim().toLowerCase();
    
    // Se a pesquisa estiver vazia, não faz nada
    if (input === "") {
        return;
    }

    // Obtém todas as linhas da tabela
    var rows = document.querySelectorAll("table tbody tr");

    // Variável para verificar se encontramos pelo menos uma correspondência
    let found = false;

    // Itera sobre as linhas da tabela
    rows.forEach(row => {
        var nomeCell = row.cells[0]; // Assume que a pesquisa é no nome (primeira célula)
        var nome = nomeCell.textContent.toLowerCase(); // Pega o nome do item na primeira célula

        // Se o nome contiver o texto da pesquisa
        if (nome.includes(input)) {
            row.style.display = ""; // Exibe a linha
            highlightText(nomeCell, input); // Destaca a palavra na célula
            if (!found) {
                row.scrollIntoView({ behavior: "smooth", block: "center" }); // Rola até o primeiro item encontrado
                found = true; // Só rola até o primeiro item
            }
        } else {
            row.style.display = "none"; // Oculta a linha se não corresponder
        }
    });

    // Limpa a barra de pesquisa após a pesquisa
    document.getElementById("searchInput").value = "";
}

// Função para destacar o texto pesquisado nas células
function highlightText(cell, searchTerm) {
    var text = cell.textContent;
    var regex = new RegExp('(' + searchTerm + ')', 'gi'); // Cria uma expressão regular para encontrar o termo

    // Substitui o termo encontrado pelo mesmo texto, mas com a tag <span> para destaque
    var highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
    
    // Atualiza o conteúdo da célula com o texto destacado
    cell.innerHTML = highlightedText;
}

// Função chamada ao pressionar "Enter"
function checkEnter(event) {
    if (event.key === "Enter") {
        search(); // Chama a função de pesquisa quando "Enter" for pressionado
    }
}
