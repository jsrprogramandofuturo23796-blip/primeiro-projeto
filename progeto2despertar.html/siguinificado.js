const convertbutton = document.querySelector("#convertbutton")

function convertValues(){

const inputValor = document.querySelector("#valordogasto").value
const displayDescricao = document.querySelector("#descrisaodogasto")

displayDescricao.value = inputValor

}

convertbutton.addEventListener("click", convertValues)//ouvinte espera do clik do botão//


