function populateUfs(){
	const ufSelect = document.querySelector('select[name=uf]')	
	fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
	.then((res) => { return res.json() })
	// .then(res => res.json())
	.then( states => {
		for( const state of states){
			// console.log(`${states[i].nome}`)
			ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
		}
	})
}

populateUfs()

function getCities(event){
	const citySelect = document.querySelector('select[name=city]')
	const stateInput = document.querySelector('input[name=state]')
	const ufValue = event.target.value
	const indexOfSelectedState = event.target.selectedIndex
	stateInput.value = event.target.options[indexOfSelectedState].text
	console.log(`${ufValue}`)
	const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
	
	fetch(url)
	.then( res => res.json() )
	.then( cities => {
		citySelect.innerHTML = `<option value>Selecione a Cidade</option>`
		citySelect.disabled = true
		for( const city of cities){
			citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
		}
		
		citySelect.disabled = false
	})
}

document
	.querySelector('select[name=uf]')
	.addEventListener("change", getCities)

const itemsToCollect = document.querySelectorAll('.items-grid li')
for( const item of itemsToCollect ){
	item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector('input[name=items]')

let selectedItems = []

function handleSelectedItem(event){
	const itemLi = event.target
	itemLi.classList.toggle("selected")
	const itemId = itemLi.dataset.id
	
	// Verificar se existem itens selecionados, se sim
	// pegar os itens selecionados
	const alreadySelected = selectedItems.findIndex( item => {
		const itemFound = item == itemId
		return itemFound
	})
	
	// Se já estiver selecionado
	if( alreadySelected >= 0){
		
		//Tirar da seleção
		const filteredItems = selectedItems.filter( item => {
			const itemIsDifferent = item != itemId 
			return itemIsDifferent
		})
		
		selectedItems = filteredItems
		
	// Se não estiver selecionado
	}else{
		// Adicionar á seleção
		selectedItems.push(itemId)
	}
	
	// console.log(selectedItems)
	
	// Atualizar o campo escondido com os itens selecionados
	collectedItems.value = selectedItems
}