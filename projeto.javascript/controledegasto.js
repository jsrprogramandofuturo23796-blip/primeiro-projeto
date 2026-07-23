document.addEventListener('DOMContentLoaded', init);

function init() {
	// Elementos
	const btnAddGasto = document.getElementById('btn-add-gasto');
	const btnAddEntrada = document.getElementById('btn-add-entrada');
	const btnSendReport = document.getElementById('btn-send-report');
	const reportChannel = document.getElementById('report-channel');

	btnAddGasto.addEventListener('click', adicionarGasto);
	btnAddEntrada.addEventListener('click', adicionarEntrada);
	btnSendReport.addEventListener('click', enviarRelatorio);
	reportChannel.addEventListener('change', atualizarCamposRelatorio);

	atualizarCamposRelatorio();
	renderTudo();
}

function getGastos() {
	return JSON.parse(localStorage.getItem('gastos') || '[]');
}

function getEntradas() {
	return JSON.parse(localStorage.getItem('entradas') || '[]');
}

function salvarGastos(gastos) {
	localStorage.setItem('gastos', JSON.stringify(gastos));
}

function salvarEntradas(entradas) {
	localStorage.setItem('entradas', JSON.stringify(entradas));
}

function adicionarGasto() {
	const desc = document.getElementById('gasto-desc').value.trim();
	const valor = parseFloat(document.getElementById('gasto-valor').value);
	const data = document.getElementById('gasto-data').value;
	const pagamento = document.getElementById('gasto-pagamento').value;

	if (!desc || !data || Number.isNaN(valor)) {
		alert('Preencha descrição, valor e data do gasto.');
		return;
	}

	const gastos = getGastos();
	gastos.push({ desc, valor: Number(valor), data, pagamento, id: Date.now() });
	salvarGastos(gastos);

	document.getElementById('gasto-desc').value = '';
	document.getElementById('gasto-valor').value = '';
	document.getElementById('gasto-data').value = '';

	renderTudo();
}

function adicionarEntrada() {
	const desc = document.getElementById('entrada-desc').value.trim();
	const valor = parseFloat(document.getElementById('entrada-valor').value);
	const tipo = document.getElementById('entrada-tipo').value;

	if (!desc || Number.isNaN(valor)) {
		alert('Preencha a descrição e o valor da entrada.');
		return;
	}

	const entradas = getEntradas();
	entradas.push({ desc, valor: Number(valor), tipo, data: new Date().toISOString(), id: Date.now() });
	salvarEntradas(entradas);

	document.getElementById('entrada-desc').value = '';
	document.getElementById('entrada-valor').value = '';

	renderTudo();
}

function renderTudo() {
	renderGastos();
	renderEntradas();
	calcularTotais();
}

function renderGastos() {
	const lista = document.getElementById('lista-gastos');
	lista.innerHTML = '';
	const gastos = getGastos();
	if (gastos.length === 0) {
		lista.innerHTML = '<li>Sem gastos registrados.</li>';
		return;
	}

	gastos.forEach(g => {
		const li = document.createElement('li');
		li.textContent = `${g.data} — ${g.desc} — R$ ${g.valor.toFixed(2)} — ${g.pagamento}`;
		const btn = document.createElement('button');
		btn.textContent = 'Remover';
		btn.style.marginLeft = '8px';
		btn.addEventListener('click', () => {
			removerGasto(g.id);
		});
		li.appendChild(btn);
		lista.appendChild(li);
	});
}

function renderEntradas() {
	const lista = document.getElementById('lista-entradas');
	lista.innerHTML = '';
	const entradas = getEntradas();
	if (entradas.length === 0) {
		lista.innerHTML = '<li>Sem entradas registradas.</li>';
		return;
	}

	entradas.forEach(e => {
		const li = document.createElement('li');
		const d = new Date(e.data).toLocaleString();
		li.innerHTML = `<span>${d} — ${e.desc} — R$ ${e.valor.toFixed(2)} — ${e.tipo}</span>`;
		const btn = document.createElement('button');
		btn.textContent = 'Remover';
		btn.addEventListener('click', () => {
			removerEntrada(e.id);
		});
		li.appendChild(btn);
		lista.appendChild(li);
	});
}

function removerGasto(id) {
	const gastos = getGastos().filter(g => g.id !== id);
	salvarGastos(gastos);
	renderTudo();
}

function removerEntrada(id) {
	const entradas = getEntradas().filter(e => e.id !== id);
	salvarEntradas(entradas);
	renderTudo();
}

function calcularTotais() {
	const gastos = getGastos();
	const entradas = getEntradas();

	// Total gasto na semana (últimos 7 dias)
	const hoje = new Date();
	const seteDiasAtras = new Date();
	seteDiasAtras.setDate(hoje.getDate() - 7);

	const totalSemana = gastos.reduce((sum, g) => {
		const d = new Date(g.data);
		if (d >= seteDiasAtras && d <= hoje) return sum + Number(g.valor);
		return sum;
	}, 0);

	// Total entradas PIX + Cartão
	const totalPixCartao = entradas.reduce((sum, e) => {
		if (e.tipo === 'pix' || e.tipo === 'cartao') return sum + Number(e.valor);
		return sum;
	}, 0);

	document.getElementById('total-gasto').textContent = totalSemana.toFixed(2);
	document.getElementById('total-entradas-pix-cartao').textContent = totalPixCartao.toFixed(2);
	renderReportStatus();
}

function atualizarCamposRelatorio() {
	const canal = document.getElementById('report-channel').value;
	document.getElementById('report-phone').style.display = canal === 'whatsapp' ? 'block' : 'none';
	document.getElementById('report-email').style.display = canal === 'email' ? 'block' : 'none';
}

function gerarRelatorioSemanal() {
	const hoje = new Date();
	const seteDiasAtras = new Date();
	seteDiasAtras.setDate(hoje.getDate() - 7);

	const gastos = getGastos().filter(g => {
		const d = new Date(g.data);
		return d >= seteDiasAtras && d <= hoje;
	});
	const entradas = getEntradas().filter(e => {
		const d = new Date(e.data);
		return d >= seteDiasAtras && d <= hoje;
	});

	const totalGastos = gastos.reduce((sum, g) => sum + Number(g.valor), 0);
	const totalEntradas = entradas.reduce((sum, e) => sum + Number(e.valor), 0);

	const periodo = `${seteDiasAtras.toLocaleDateString()} - ${hoje.toLocaleDateString()}`;
	let texto = `Relatório semanal de gastos e entradas\nPeríodo: ${periodo}\n\n`;

	texto += 'Gastos:\n';
	if (gastos.length === 0) texto += 'Nenhum gasto registrado.\n';
	else {
		gastos.forEach(g => {
			texto += `- ${g.data} | ${g.desc} | R$ ${g.valor.toFixed(2)} | ${g.pagamento}\n`;
		});
	}
	texto += `Total de gastos: R$ ${totalGastos.toFixed(2)}\n\n`;

	texto += 'Entradas:\n';
	if (entradas.length === 0) texto += 'Nenhuma entrada registrada.\n';
	else {
		entradas.forEach(e => {
			const d = new Date(e.data).toLocaleString();
			texto += `- ${d} | ${e.desc} | R$ ${e.valor.toFixed(2)} | ${e.tipo}\n`;
		});
	}
	texto += `Total de entradas: R$ ${totalEntradas.toFixed(2)}\n`;

	return texto;
}

function enviarRelatorio() {
	const canal = document.getElementById('report-channel').value;
	const texto = gerarRelatorioSemanal();

	if (canal === 'whatsapp') {
		const telefone = document.getElementById('report-phone').value.replace(/\D/g, '');
		if (!telefone) {
			alert('Informe um número de WhatsApp válido.');
			return;
		}
		const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(texto)}`;
		window.open(url, '_blank');
	} else {
		const email = document.getElementById('report-email').value.trim();
		if (!email) {
			alert('Informe o email do destinatário.');
			return;
		}
		const subject = encodeURIComponent('Relatório semanal de gastos');
		const body = encodeURIComponent(texto);
		const url = `mailto:${email}?subject=${subject}&body=${body}`;
		window.location.href = url;
	}

	const hoje = new Date().toISOString();
	localStorage.setItem('lastReportSent', hoje);
	renderReportStatus();
}

function renderReportStatus() {
	const status = document.getElementById('last-report');
	const data = localStorage.getItem('lastReportSent');
	if (!data) {
		status.textContent = 'Nenhum';
		return;
	}
	const d = new Date(data);
	status.textContent = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
	const hoje = new Date();
	const seteDiasAtras = new Date();
	seteDiasAtras.setDate(hoje.getDate() - 7);
	const aviso = document.querySelector('.report-note');
	if (d <= seteDiasAtras) {
		aviso.textContent = 'Já passou 7 dias desde o último relatório. Envie outra vez.';
	} else {
		aviso.textContent = 'Gera um relatório dos últimos 7 dias e abre o envio por WhatsApp ou email.';
	}
}
