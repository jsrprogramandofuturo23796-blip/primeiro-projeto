
function sortear() {
    const min = Math.ceil(document.querySelector('.input1').value);
    const max = Math.floor(document.querySelector('.input2').value);
const result = Math.floor(Math.random() * (max - min + 1)) + min;

let resultadoElemento = document.querySelector('.resultadop');
resultadoElemento.textContent = `O número sorteado é: ${result}`;
}




/*function adicionarGasto() {
const inportaorigem = document.querySelector(`.valordogasto`).value



console.log(inportaorigem)






}






const inptOrigem = document.querySelector('.valordogasto');
const inptDestino = document.querySelector('.descrisaodogasto');
if (inptOrigem && inptDestino) {
    inptDestino.value = inptOrigem.value;}*/


function adicionarGasto() {
const inptOrigem = document.querySelector('.valordogasto');
const inptDestino = document.querySelector('.descrisaodogasto');
if (inptOrigem && inptDestino) {
    inptDestino.value = inptOrigem.value;}
}








/*function calculargasto() {
const inputValorMensal = document.querySelector(`.descrisaodogasto`);
const novoGastoDiario = parseFloat
const valorAtualMensal = parseFloat
const novoTotal = valorAtualMensal
inputValorMensal.value = novoTotal
}



