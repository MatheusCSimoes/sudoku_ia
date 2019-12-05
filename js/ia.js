let matrix = [];
let quantidade = [0,0,0,0,0,0,0,0,0,0];
let faltantes = [];
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

const hillClimbing = () => {
	funcObjetivo = 0;
	funcObjetivoPre = 0
	contarNumeros()
	crearFaltantes()

	inicializarDatos()
	console.log("Começo:",funcObjetivo)
	console.log("Individuo:",individuo)
	job()
}

const inicializarDatos = () => {
	timeLap = new Date()
	iteracaoHill = 0
	individuo = []
	inicializarMatriz()
	preencherSudoku()
	calFuncObjetivo()
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
	inicializarMatriz()
	atualizarSudoku()
	calFuncObjetivo()

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

const inicializarMatriz = () => {
	for(let linha = 1; linha < 10; linha += 1) {
		matrix[linha] = [];
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(document.getElementById('cell-'+(linha)+(coluna)).disabled == true)
				matrix[linha][coluna] = sudoku(linha,coluna);
			else
				matrix[linha][coluna] = 0;
    }
  }
}

const calFuncObjetivo = () => {
	// let f = 0
	funcObjetivo += contarNumerosRepetidosColuna();
	funcObjetivo += contarNumerosRepetidosLinha();
	funcObjetivo += contarNumerosRepetidosBloco();
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
 	// return f
}

const contarNumerosRepetidosColuna = () => {
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

const contarNumerosRepetidosLinha = () => {
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

const contarNumerosRepetidosBloco = () => {
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
	for(let numero = 1; numero < 10; numero++) {
		for(let vezes = 1; vezes < 10; vezes++) {
			if(quantidade[numero] > 0){
				quantidade[numero]--
			}
			else{
				faltantes.push(numero)
			}
    }
  }
	console.log("faltantes:")
	console.log(faltantes)
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

const preencherSudoku = () => {
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
}

const atualizarSudoku = () => {
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
}

const sudoku = (l,c) =>{
	let n = document.getElementById('cell-'+(l)+(c)).value;
	if(n != "")
		return parseInt(n)
	else
		return 0

}

const setSudoku = (l,c,n) =>{
	document.getElementById('cell-'+(l)+(c)).value = n;
}

const disableSudoku = (l,c) =>{
	document.getElementById('cell-'+(l)+(c)).style.color = "blue";
	document.getElementById('cell-'+(l)+(c)).disabled = true;
}

// const clone = (obj) => {
//     if (null == obj || "object" != typeof obj) return obj;
//     var copy = obj.constructor();
//     for (var attr in obj) {
//         if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
//     }
//     return copy;
// }

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

fixarNumeros()
//hillClimbing()
