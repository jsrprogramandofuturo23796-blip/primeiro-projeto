
function sorteadorjsbotao() {
        const min = Math.ceil(document.querySelector(`.sorteador4input1min`).value)
        const max = Math.floor(document.querySelector(`.sorteador4input12max`).value)
        const resultado = Math.floor(Math.random() * (max - min + 1)) + min

}


let p = document.querySelector(`p`)
let input = document.querySelector(`input`)
let resultadoElemento = document.querySelector('.resultadop');
resultadoElemento.textContent = `O número sorteado é: ${result}`;






const contacts = [
        { name: `joão`, number: `(45) 998063120` },
        { name: `jose`, number: `45 998063120` },
        { name: `jorge`, number: `45 998063120` },
        { name: `maria`, number: `(45)998063120` },
        { name: `miria`, number: `(45) 998063120` },
]


function search() {
        for (let i = 0; i < contacts.length; i++) {
                if (input.value === contacts[i].name) {
                        p.innerHTML = `contato encontrado name ${contacts[i].name} tel: ${contacts[i].number}`
                        break
                }
                 else {
                        p.innerHTML = "contato não encomtrado, tente novamente"
                }
        }
}






function adicionarGasto() {
        const inputOrigem7 = document.querySelector('.valordogasto7')
        const inputOrigem6 = document.querySelector('.valordogasto6')
        const inputOrigem5 = document.querySelector('.valordogasto5')
        const inputOrigem4 = document.querySelector('.valordogasto4')
        const inputOrigem3 = document.querySelector('.valordogasto3')
        const inputOrigem2 = document.querySelector('.valordogasto2');
        const inptOrigem = document.querySelector('.valordogasto');
        const inptDestino = document.querySelector('.descrisaodogasto2');

        if (inputOrigem7 && inputOrigem6 && inputOrigem5 && inputOrigem4 && inputOrigem3 && inputOrigem2 && inptOrigem && inptDestino) {
                const valor7 = Number(inputOrigem7.value) || 0;
                const valor6 = Number(inputOrigem6.value) || 0;
                const valor5 = Number(inputOrigem5.value) || 0;
                const valor4 = Number(inputOrigem4.value) || 0;
                const valor3 = Number(inputOrigem3.value) || 0;
                const valor2 = Number(inputOrigem2.value) || 0;
                const valor1 = Number(inptOrigem.value) || 0;
                const soma = valor1 + valor2 + valor3 + valor4 + valor5 + valor6 + valor7;

                inptDestino.value = soma;
        }
}


