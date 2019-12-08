let faltantes = [];
let quantidade = [0,0,0,0,0,0,0,0,0,0];
let historico = []
let quanitdadeMinimosLocales = 100

const hillClimbingFirstChoice = () => {

	let matrix = [];
	let funcObjetivo = 0;
	let funcObjetivoPre = 0;
	let individuo = []
	let individuoPre = []
	let timeTotal = new Date()
	let timeLap = new Date()
	let mudar = 0;
	let valor = 0;
	//tentantiva para achar a solução
	let tentantivaSol = 0
	//Iteração numa tentativa
	let iteracaoHill = 0
	//No de iterações maximas numa tentativa
	const cicloiteracao = 10000
	let numeroIteracoes = cicloiteracao
	//historico
	let historico = []

	fixarNumeros()
	cellsFixed = true;
	const inicializarDatos = () => {
		timeLap = new Date()
		iteracaoHill = 0
		individuo = []
		matrix = inicializarMatriz()
		let temp = preencherSudoku(matrix,faltantes)
		individuo = temp.individuo
		matrix = temp.matrix
		funcObjetivo = calFuncObjetivo(matrix)
		funcObjetivoPre = clone(funcObjetivo)
		individuoPre = clone(individuo)
	}


	const job = () => {
		setTimeout(() => {
			trabalhar()
		}, 10);
	}

	const trabalhar = () => {
		funcObjetivo = 0;
		iteracaoHill++
		numeroIteracoes--
		melhoraFuncObjetivo()
		matrix = inicializarMatriz()
		matrix = atualizarSudoku(matrix,individuo,faltantes)
		funcObjetivo = calFuncObjetivo(matrix)

		if(funcObjetivo < funcObjetivoPre){

			if(historico[tentantivaSol] == undefined){
				historico[tentantivaSol] = {
					melhorIndividuo:[],
					iteracoes:[],
					tentMax:0,
					tempototal:0,
				}
			}

			numeroIteracoes = cicloiteracao
			funcObjetivoPre = clone(funcObjetivo)
			individuoPre = clone(individuo)
			// console.log(individuoPre)
			// console.log("Pos:",mudar,"Val:",valor, "iteracao:", iteracaoHill)
			let tempotemp = (((new Date()).getTime() - timeLap.getTime())/1000)
			console.log(`Novo F: ${funcObjetivo}, Time: ${tempotemp}, Iteração: ${iteracaoHill}`)
			historico[tentantivaSol].iteracoes.push({
				f:funcObjetivo,
				t:tempotemp,
				i:iteracaoHill
			})
		}
		else{
			individuo = clone(individuoPre)
		}
		if(numeroIteracoes == 0){
			let tempotemp = (((new Date()).getTime() - timeTotal.getTime())/1000)
			const style = 'color: red; font-size: 14px';
			console.log("%c Achei minimo local",style)
			console.log(individuoPre)
			console.log(`Novo F: ${funcObjetivoPre}, Iteração: ${iteracaoHill}, Time: ${(((new Date()).getTime() - timeLap.getTime())/1000)}, Total time: ${tempotemp}`)
			historico[tentantivaSol].tentMax = iteracaoHill
			historico[tentantivaSol].melhorIndividuo = individuoPre
			historico[tentantivaSol].tempototal = tempotemp
			tentantivaSol++;
			inicializarDatos()
		}
		if(funcObjetivoPre != 0)
			job()
	}

	const melhoraFuncObjetivo = () =>{
		// console.log(individuo)
		let pos = Math.floor((Math.random() * individuo.length));
		// console.log("pos",pos)
		let numMax = individuo.length - pos;
		// console.log("max",numMax)
		let rand = Math.floor((Math.random() * numMax));
		// console.log("rand",rand)
		mudar = pos;
		valor = rand
		// if(individuo[pos] == rand)
			// melhoraFuncObjetivo()
		// else
			individuo[pos] = rand;
		// console.log(individuo)
	}

	funcObjetivo = 0;
	funcObjetivoPre = 0
	contarNumeros()
	faltantes = crearFaltantes()

	inicializarDatos()
	console.log("Começo:",funcObjetivo)
	console.log("Individuo:",individuo)
	job()
}

const hillClimbingEstocastico = () => {

	let matrix = [];
	let funcObjetivo = 0;
	let funcObjetivoPre = 0;
	let individuo = []
	let individuoPre = []
	let timeTotal = new Date()
	let timeLap = new Date()
	let mudar = 0;
	let valor = 0;
	//tentantiva para achar a solução
	let tentantivaSol = 0
	//Iteração numa tentativa
	let iteracaoHill = 0
	//No de iterações maximas numa tentativa
	const cicloiteracao = 10
	let numeroIteracoes = cicloiteracao

	fixarNumeros()
	cellsFixed = true;
	const inicializarDatos = () => {
		timeLap = new Date()
		iteracaoHill = 0
		individuo = []
		matrix = inicializarMatriz()
		let temp = preencherSudoku(matrix,faltantes)
		individuo = temp.individuo
		matrix = temp.matrix
		funcObjetivo = calFuncObjetivo(matrix)
		funcObjetivoPre = clone(funcObjetivo)
		individuoPre = clone(individuo)
	}


	const job = () => {
		setTimeout(() => {
			trabalhar()
		}, 10);
	}

	const trabalhar = () => {
		funcObjetivo = 0;
		iteracaoHill++
		numeroIteracoes--

		melhoraFuncObjetivo()

		matrix = inicializarMatriz()
		matrix = atualizarSudoku(matrix,individuo,faltantes)
		funcObjetivo = calFuncObjetivo(matrix)

		if(funcObjetivo < funcObjetivoPre){

			if(historico[tentantivaSol] == undefined){
				historico[tentantivaSol] = {
					melhorIndividuo:[],
					iteracoes:[],
					tentMax:0,
					tempototal:0,
				}
			}

			numeroIteracoes = cicloiteracao
			funcObjetivoPre = clone(funcObjetivo)
			individuoPre = clone(individuo)
			// console.log(individuoPre)
			// console.log("Pos:",mudar,"Val:",valor, "iteracao:", iteracaoHill)
			let tempotemp = (((new Date()).getTime() - timeLap.getTime())/1000)
			console.log(`Novo F: ${funcObjetivo}, Time: ${tempotemp}, Iteração: ${iteracaoHill}`)
			historico[tentantivaSol].iteracoes.push({
				f:funcObjetivo,
				t:tempotemp,
				i:iteracaoHill
			})
		}
		else{
			individuo = clone(individuoPre)
		}
		if(numeroIteracoes == 0){
			let tempotemp = (((new Date()).getTime() - timeTotal.getTime())/1000)
			const style = 'color: red; font-size: 14px';
			console.log("%c Achei minimo local "+(tentantivaSol+1),style)
			console.log(individuoPre)
			console.log(`Novo F: ${funcObjetivoPre}, Iteração: ${iteracaoHill}, Time: ${(((new Date()).getTime() - timeLap.getTime())/1000)}, Total time: ${tempotemp}`)
			historico[tentantivaSol].tentMax = iteracaoHill
			historico[tentantivaSol].melhorIndividuo = individuoPre
			historico[tentantivaSol].tempototal = tempotemp
			tentantivaSol++;
			inicializarDatos()
		}
		if(funcObjetivoPre != 0){
			if(tentantivaSol != quanitdadeMinimosLocales){
				job()
			}
			else{
				const style = 'color: red; font-size: 14px';
				console.log("%c Acabei",style)
			}
		}

	}

	const melhoraFuncObjetivo = () =>{
		// console.log("individuo Velho", individuo)
		let melhor = 100
		let melhorIndividuo = []
		let pos = 100
		let aumento = 1
		for (let i = 0; i < individuo.length; i++) {
			let _individuo = clone(individuo)
			let max = individuo.length - i;
			let value = _individuo[i];
			let valaumento = value + aumento
			_individuo[i] = valaumento%max
			let tent = 10
			while(faltantes[_individuo[i]] == faltantes[value]){
				tent--
				valaumento = valaumento + aumento
				_individuo[i] = valaumento%max
				if(tent == 0)
					break
			}
			let matrixtemp = inicializarMatriz()
			matrixtemp = atualizarSudoku(matrixtemp,_individuo,faltantes)
			_funcObjetivo = calFuncObjetivo(matrixtemp)
			if(_funcObjetivo < melhor){
				// console.log("individuo Novo", _individuo)
				melhor = _funcObjetivo
				melhorIndividuo = clone(_individuo)
				pos = i
			}

			_individuo = clone(individuo)
			value = _individuo[i];
			valaumento = value - aumento
			if(valaumento < 0)
				valaumento = valaumento + max
			_individuo[i] = valaumento
			tent = 10
			while(faltantes[_individuo[i]] == faltantes[value]){
				tent--
				valaumento = valaumento - aumento
				if(valaumento < 0)
					valaumento = valaumento + max
				_individuo[i] = valaumento
				if(tent == 0)
					break
			}
			matrixtemp = inicializarMatriz()
			matrixtemp = atualizarSudoku(matrixtemp,_individuo,faltantes)
			_funcObjetivo = calFuncObjetivo(matrixtemp)
			if(_funcObjetivo < melhor){
				// console.log("individuo Novo", _individuo)
				melhor = _funcObjetivo
				melhorIndividuo = clone(_individuo)
				pos = i
			}
		}

		// console.log(melhor,pos, melhorIndividuo)
			// console.log("individuo Novo", melhorIndividuo)
		individuo = clone(melhorIndividuo);
	}

	funcObjetivo = 0;
	funcObjetivoPre = 0
	contarNumeros()
	faltantes = crearFaltantes()
	// faltantes = shuffle(faltantes)

	inicializarDatos()
	console.log("Começo:",funcObjetivo)
	console.log("Individuo:",individuo)
	job()
}

const inicializarMatriz = () => {
	let m = []
	for(let linha = 1; linha < 10; linha += 1) {
		m[linha] = [];
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(document.getElementById('cell-'+(linha)+(coluna)).disabled == true)
				m[linha][coluna] = sudoku(linha,coluna);
			else
				m[linha][coluna] = 0;
    }
	}
	return m
}

const calFuncObjetivo = (matrix) => {
	let f = 0
	f += contarNumerosRepetidosColuna(matrix);
	f += contarNumerosRepetidosLinha(matrix);
	f += contarNumerosRepetidosBloco(matrix);
	// console.log("funcCalculada",funcObjetivo)

	// for(let linha = 1; linha < 10; linha += 1) {
	// 	for(let coluna = 1; coluna < 10; coluna += 1) {
	// 		let numero = matrix[linha][coluna]
	// 		funcObjetivo += linhaRepetida(numero,linha);
	// 		funcObjetivo += colunaRepetida(numero,coluna);
	// 		// funcObjetivo += blocoRepetido(numero,linha,coluna);
	// 		console.log(funcObjetivo,linha,coluna,numero)
	//    }
	//  }
	//  console.log(funcObjetivo)
 	return f
}

const contarNumerosRepetidosColuna = (matrix) => {
	let quantidadeNumeros = 0
	for(let coluna = 1; coluna < 10; coluna += 1) {
		let feitos = [0,0,0,0,0,0,0,0,0,0]
		let q = 0
		for(let linha = 1; linha < 10; linha += 1) {
			let numero = matrix[linha][coluna]
			feitos[numero]++
    }
	// console.log(feitos)
    q += feitos.reduce((a,b)=>(b==1 || b==0)?a:(a+b-1));
    // console.log("Coluna",coluna,q)
    quantidadeNumeros += q
  }
//   console.log("Repetidos nas Colunas",quantidadeNumeros)
  return quantidadeNumeros
}

const contarNumerosRepetidosLinha = (matrix) => {
	let quantidadeNumeros = 0
	for(let linha = 1; linha < 10; linha += 1) {
		let feitos = [0,0,0,0,0,0,0,0,0,0]
		let q = 0
		for(let coluna = 1; coluna < 10; coluna += 1) {
			let numero = matrix[linha][coluna]
			feitos[numero]++
    }
    // console.log(feitos)
    q += feitos.reduce((a,b)=>(b==1 || b==0)?a:(a+b-1));
    // console.log("Linha",linha,q)
    quantidadeNumeros += q
  }
//   console.log("Repetidos nas Linhas",quantidadeNumeros)
  return quantidadeNumeros
}

const contarNumerosRepetidosBloco = (matrix) => {
	let quantidadeNumeros = 0
	for(let l = 0; l < 3; l += 1) {
		for(let c = 0; c < 3; c += 1) {
			let feitos = [0,0,0,0,0,0,0,0,0,0]
			let q = 0
			for(let linha = 0; linha < 3; linha += 1) {
				for(let coluna = 0; coluna < 3; coluna += 1) {
					// console.log(l*3+linha+1,c*3+coluna+1)
					let numero = matrix[l*3+linha+1][c*3+coluna+1]
					feitos[numero]++
		    }
	    }
	    q += feitos.reduce((a,b)=>(b==1 || b==0)?a:(a+b-1));
	    // console.log("Bloco",l,c,q)
    	quantidadeNumeros += q
    }
  }
//   console.log("Repetidos nos Blocos",quantidadeNumeros)
  return quantidadeNumeros
}

// const linhaRepetida = (numero,linha) => {
// 	let n = 0
// 	for (let i = 1; i < 10; i++) {
// 		if(matrix[linha][i] == numero)
// 			n++
// 	}
// 	return n-1;
// }

// const colunaRepetida = (numero,coluna) => {
// 	let n = 0
// 	for (let i = 1; i < 10; i++) {
// 		if(matrix[i][coluna] == numero)
// 			n++
// 	}
// 	return n-1
// }

const crearFaltantes = () => {
	let falt = []
	for(let numero = 1; numero < 10; numero++) {
		for(let vezes = 1; vezes < 10; vezes++) {
			if(quantidade[numero] > 0){
				quantidade[numero]--
			}
			else{
				falt.push(numero)
			}
    }
	}
	return falt
}

function shuffle(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * array.length);

    // If not already shuffled, move it to the new array.
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }

  return copy;
}

const contarNumeros = () => {
	for(let linha = 1; linha < 10; linha++) {
		for(let coluna = 1; coluna < 10; coluna++) {
			if(sudoku(linha,coluna) != 0){
				quantidade[sudoku(linha,coluna)]++;
			}
    }
  }
	console.log("numeros:",quantidade);
}

const fixarNumeros = () => {
	for(let linha = 1; linha < 10; linha += 1) {
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(document.getElementById('cell-'+(linha)+(coluna)).value != 0){
				disableSudoku(linha,coluna);
			}
		}
	}
}

const preencherSudoku = (matrix,faltantes) => {
	individuo = []
	let falt = clone(faltantes);
	for(let linha = 1; linha < 10; linha += 1) {
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(matrix[linha][coluna] == 0){
				let newNumero = Math.floor((Math.random() * falt.length));
				matrix[linha][coluna] = falt[newNumero]
				setSudoku(linha,coluna,falt[newNumero]);
				individuo.push(newNumero);
				falt.splice(newNumero, 1);
			}
    }
	}
	return {
		matrix:matrix,
		individuo:individuo
	}
}

const atualizarSudoku = (matrix,individuo,faltantes) => {
	let falt = clone(faltantes);
	let c = 0
	for(let linha = 1; linha < 10; linha += 1) {
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(matrix[linha][coluna] == 0){
				let newNumero = individuo[c];
				matrix[linha][coluna] = falt[newNumero]
				setSudoku(linha,coluna,falt[newNumero]);
				falt.splice(newNumero, 1);
				c++
			}
		}
	}
	return matrix
}

const sudoku = (l,c) =>{
	let n = document.getElementById('cell-'+(l)+(c)).value;
	if(n != "")
		return parseInt(n)
	else
		return 0

}

const setSudoku = (l,c,n) =>{
	if(n == undefined)
		debugger
	document.getElementById('cell-'+(l)+(c)).value = n;
}

const disableSudoku = (l,c) =>{
	document.getElementById('cell-'+(l)+(c)).style.color = "blue";
	document.getElementById('cell-'+(l)+(c)).disabled = true;
}

function clone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

const setValMatrix = (v) =>{
	console.log(v)
}

// hillClimbing()

const testIndividuo = (individuo) => {
	let _matrix = inicializarMatriz()
	_matrix = atualizarSudoku(_matrix,individuo,faltantes)
	console.log(_matrix)
	console.log(calFuncObjetivo(_matrix))
}
