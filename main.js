let listaDeItens = []   //criação de uma array que irá conter os itens
let itemAEditar

const form = document.getElementById('form-itens')   //guarda o elemento form
const itensInput = document.getElementById('receber-item')  //guarda o elemento input
const ulItens = document.getElementById('lista-de-itens')   //guardadndo o elemento ul que irá conter os itens a comprar
const ulItensComprados = document.getElementById('itens-comprados')   //guarda o elemento ul que irá conter os itens já comprados
const listaRecuperada = localStorage.getItem('listaDeItens')

function atualizarLocalStorage() {
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}

if(listaRecuperada) {
    listaDeItens = JSON.parse(listaRecuperada)
    mostrarItem()
} else {
    listaDeItens = []
}

form.addEventListener('submit', (e) => {   //adicionando um ouvidor de evento para o caso de submit ao form
    e.preventDefault()   //retirando as ações padrões do submit
    salverItem()
    mostrarItem()
    itensInput.focus   //Dar foco no input após o submit
})

function salverItem() {
    const comprasItem = itensInput.value   //guarda o valor que está no input
    const checarDuplicado = listaDeItens.some((elemento) =>   //guardando o valor booleano do teste feito pelo .some
        elemento.valor.toUpperCase() === comprasItem.toUpperCase()   //comparação se o valor do input é igual ao valor de algum elemento da lista
    )  //o uso do .toUpperCase é para deixar os dois valores a serem comparados em letra maiúscula

    if(!checarDuplicado) {   //Se teste retornar false
        listaDeItens.push(   //cria um objeto com o valor do input e adiciona-o na lista de itens
            {
                valor: comprasItem,   //valor será o nome do item
                checar: false   //está chave se refere ao checkbox, que ao ser criado estará desmarcado
            }
        )
    } else {   //caso o teste retorne true
        alert('Esse item já faz parte da lista!')   //cria um pop up alert avisando ao usuário
    }
    itensInput.value = ""   //limpa o input
}

function mostrarItem() {
    ulItens.innerHTML = ""   //limpa ao elemento ul que contém os itens adicionados
    ulItensComprados.innerHTML = ""   //limpa o elemento ul que contém os itens já comprados

    listaDeItens.forEach((elemento, index) => {   //executa uma função para cada elemento da lista de itens, passando o elemento e seu index como parâmetro
        if(elemento.checar) {   //se a chave checar do objeto for true, o item será adicionado ao elemento ul que contém os itens já comprados
            ulItensComprados.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" checked class="is-clickable" />  
                    <span class="itens-comprados is-size-5">${elemento.valor}</span>
                </div>
                <div>
                    <i class="fa-solid fa-trash is-clickable deletar"></i>
                </div>
            </li>
            `
        }else{   //se a chave for false, o item será adicionado ao elemento ul que contém os itens para comprar
            ulItens.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" class="is-clickable" />
                    <input type="text" class="is-size-5" value="${elemento.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ""}></input>
                </div>

                <div>
                    ${index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                    <i class="fa-solid fa-trash is-clickable deletar"></i>
                </div>
            </li>
            `
        }
    })
    

    const inputsCheck = document.querySelectorAll('input[type="checkbox"]')   //guarda todos os checkbox
    inputsCheck.forEach(i => {   //executa uma função para cada checkbox
        i.addEventListener('click', (evento) => {   //adiciona um ouvidor de evento para click
            const valorElemento = evento.target.parentElement.parentElement.getAttribute('data-value')   //guarda o index do item referente a lista de itens
            listaDeItens[valorElemento].checar = evento.target.checked   //altera o valor da chave checar para true, pois o elemento estará checked
            mostrarItem()
        })
    })

    const deletarObjetos = document.querySelectorAll('.deletar')
    deletarObjetos.forEach(i => {   //executa uma função para cada checkbox
        i.addEventListener('click', (evento) => {   //adiciona um ouvidor de evento para click
            const valorElemento = evento.target.parentElement.parentElement.getAttribute('data-value')   //guarda o index do item referente a lista de itens
            listaDeItens.splice(valorElemento, 1)   //método para deletar o objeto
            mostrarItem()
        })
    })

    const editarItens = document.querySelectorAll('.editar')
    editarItens.forEach(i => {   //executa uma função para cada checkbox
        i.addEventListener('click', (evento) => {   //adiciona um ouvidor de evento para click
            itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value')   //guarda o index do item referente a lista de itens
            mostrarItem()
        })
    })
    atualizarLocalStorage()
}

function salvarEdicao() {
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)
    listaDeItens[itemAEditar].valor = itemEditado.value   //atualiza no objeto o valor da chave valor para aquela que foi editada
    itemAEditar = -1   //Como não existe index negativo, o itemAEditar não estará referenciando a nenhum objeto, isto se deve pois se formos editar outro item ele iria utilizar o valor da operação antiga
    mostrarItem()
}