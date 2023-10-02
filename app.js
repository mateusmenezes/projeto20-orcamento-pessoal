class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados(){
        for(let i in this){
            // podemos acessar o atributo no formato de array
            if(this[i] == undefined || this[i] == "" || this[i] == null){
                return false;
            }
        }
        return true;
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem("id");
        if(id === null){
            localStorage.setItem("id", 0);
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem("id"); // 0

        return parseInt(proximoId) + 1;
    }

    gravar(d){
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem("id", id); // atualizando o id dentro de localstorage
    }

    recuperarTodosRegistros(){
        let tamanho = localStorage.getItem("id");

        // array de despesas
        let registros = [];

        // recuperando todas as despesas cadastradas em localStorage
        for(let i = 1; i <= tamanho; i++){
            let despesa = JSON.parse(localStorage.getItem(i));

            // verifica se foi pulado algum valor de localStorage, se sim, pular o ciclo atual
            if(despesa == null) continue;
            despesa.id = i;
            registros.push(despesa);
        }
        return registros;
    }

    pesquisar(despesa){
        let registros = [];
        registros = this.recuperarTodosRegistros();
        
        // filtrando ano
        if(despesa.ano != ""){
            registros = registros.filter(d => d.ano == despesa.ano);
        }
        // filtrando mes
        if(despesa.mes != ""){
            registros = registros.filter(d => d.mes == despesa.mes);
        }
        // filtrando dia
        if(despesa.dia != ""){
            registros = registros.filter(d => d.dia == despesa.dia);
        }
        // filtrando tipo
        if(despesa.tipo != ""){
            registros = registros.filter(d => d.tipo == despesa.tipo);
        }
        // filtrando descricao
        if(despesa.descricao != ""){
            registros = registros.filter(d => d.descricao == despesa.descricao);
        }
        // filtrando valor
        if(despesa.valor != ""){
            let registros = registros.filter(d => d.valor == despesa.valor);
        }     
        return registros;
    }

    remover(id){
        localStorage.removeItem(id);
    }
}

let bd = new Bd();



function cadastrarDespesa(){
    let ano = document.getElementById("ano");
    let mes = document.getElementById("mes");
    let dia = document.getElementById("dia");
    let tipo = document.getElementById("tipo");
    let descricao = document.getElementById("descricao");
    let valor = document.getElementById("valor");


    let despesa = new Despesa(ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    if(despesa.validarDados()){ // Verificando se os dados são validos
        bd.gravar(despesa);
        alert("Despesa cadastrada com sucesso");
        ano.value = "";
        mes.value = "";
        dia.value = "";
        tipo.value = "";
        descricao.value = "";
        valor.value = "";
    }else{//caso não seja, abrir o alert de erro
        alert("Erro na gravação, corrija os dados ou inclua os dados que estão faltando");
    }
}


// carregando dados na tabela
function carregaListaDespesas(){
    let despesas = [];
    despesas = bd.recuperarTodosRegistros();

    // selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById("listaDespesas");
    listaDespesas.innerHTML = "";
    // percorrendo o array despesas, listando cada uma
    despesas.forEach(function(d){

        // criando uma linha(td)
        let linha = listaDespesas.insertRow();

        // criando uma coluna/célula(td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        switch(parseInt(d.tipo)){
            case 1:
                d.tipo = "Alimentação";
                break;
            case 2:
                d.tipo = "Educação";
                break;
            case 3:
                d.tipo = "Lazer";
                break;
            case 4:
                d.tipo = "Saúde";
                break;
            case 5:
                d.tipo = "Transporte";
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;
        


        // criando botão de exclusao
        let btn = document.createElement("button");
        btn.className = "btn btn-danger";
        btn.innerHTML = "X";
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function(){
            let id = this.id.replace("id_despesa_", "");
            bd.remover(id);
            window.location.reload();
        }
        linha.insertCell(4).append(btn);
    });

}




function pesquisarDespesa(){
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let registros = [];
    registros = bd.pesquisar(despesa);
    let tbody = document.getElementById("listaDespesas");
    tbody.innerHTML = "";
    registros.forEach(function(d){
        let linha = tbody.insertRow();
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        switch(parseInt(d.tipo)){
            case 1:
                d.tipo = "Alimentação";
                break;
            case 2:
                d.tipo = "Educação";
                break;
            case 3:
                d.tipo = "Lazer";
                break;
            case 4:
                d.tipo = "Saúde";
                break;
            case 5:
                d.tipo = "Transporte";
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

    });
}
