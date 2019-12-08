var populationSize = 1000;
var elitism = true;
var crossProb = 0.8;
var mutationProb = 0.1;
var maxNumGenerations = 1000;

var generation = 0;
var population = []
var populationObjectiveFuncForMax = 0;
var populationObjectiveFuncSum = 0;

var objectiveFunc = 0;
var individual = [];
var missing = [];
var sudokuMatrix = [];
var amount = [0,0,0,0,0,0,0,0,0,0];
var intermediatePopulation = [];
var elite = [];

var historyTests = [];

var cellsFixed = false;

const genetico = () => {
  if(!cellsFixed) {
    fixCells();
    cellsFixed = true;
  }

  objectiveFunc = 0;
	countNumbers() //conta quantos numeros ja estao no tabuleiro
	createMissing() //cria array com numeros missing

	initData()

  initializeMatrix();
  let index = getBestIndividualIndex();
  updateSudoku(cloneObject(population[index].individual), false);

  nextGeneration()

  while(generation < maxNumGenerations) {
    if(population[index].objectiveFunc <= 0) {
      console.log("Solution found!!!");
      initializeMatrix();
      let solution = getBestIndividualIndex();
      updateSudoku(cloneObject(population[solution].individual), true);
      historyTests.push({
        elitism: elitism,
        populationSize: populationSize,
        crossProb: crossProb,
        mutationProb: mutationProb,
        maxNumGenerations: maxNumGenerations,
        foundSolution: true,
        resultAdaptFunc: cloneObject(population[index].objectiveFunc),
        bestIndividual: cloneObject(population[index].individual)
      });

      break;
    }
    else {
      nextGeneration();
    }
  }

  initializeMatrix();
  index = getBestIndividualIndex();
  updateSudoku(cloneObject(population[index].individual), true);

  console.log(" AdaptFunc -> ", cloneObject(population[index].objectiveFunc));

  historyTests.push({
    elitism: elitism,
    populationSize: populationSize,
    crossProb: crossProb,
    mutationProb: mutationProb,
    maxNumGenerations: maxNumGenerations,
    foundSolution: false,
    resultAdaptFunc: cloneObject(population[index].objectiveFunc),
    bestIndividual: cloneObject(population[index].individual)
  });
}

const nextGeneration = () => {
  selection();
  crossover();
  mutation();
  addElite();

  populationObjectiveFuncForMax = 0
  populationObjectiveFuncSum = 0

  //recalculate objective function
  for(let i = 0; i < populationSize; i++) {
    initializeMatrix();
    individual = cloneObject(population[i].individual);
    updateSudoku(cloneObject(population[i].individual), false);

    objectiveFunc = 0;
    objectiveFunc = calcObjectiveFunc();
    population[i].objectiveFunc = cloneObject(objectiveFunc);
    population[i].objectiveFuncForMax = 1 / (cloneObject(objectiveFunc) + 1);

    populationObjectiveFuncForMax += (1 / (cloneObject(objectiveFunc) + 1))
    populationObjectiveFuncSum += cloneObject(objectiveFunc)
  }

  generation = generation + 1;
  console.log("Geração:",cloneObject(generation))
  console.log("Population sum:",cloneObject(populationObjectiveFuncSum))

  initializeMatrix();
  let index = getBestIndividualIndex();
  updateSudoku(cloneObject(population[index].individual), false);

  console.log("bestIndividualObjectiveFunc: ",cloneObject(population[index].objectiveFunc));

  // console.log("Population:");
  // console.table(cloneObject(population));
}

const selection = () => {
  //pelo slide 32 de algoritmo genetico da aula, se ao fazer a seleção fatarem individuos, complete com o melhor. (fazendo um elitismo)

  intermediatePopulation = [];

  if(elitism) {
    let index = getBestIndividualIndex();
    // intermediatePopulation.push(cloneObject(population[index]));
    elite.push(cloneObject(population[index]));
  }

  let considerElitism = elitism ? 1 : 0;

  for(let i = 0; i < populationSize - considerElitism; i++) {
    let prob = Math.random();
    let sumProbs = 0;
    for(let j = 0; j < populationSize; j++) {
      sumProbs += cloneObject(population[j].objectiveFuncForMax) / cloneObject(populationObjectiveFuncForMax);
      if(sumProbs >= prob) {
        intermediatePopulation.push(cloneObject(population[j]));
        break;
      }
      if(j == populationSize -1) {
        intermediatePopulation.push(cloneObject(population[j]));
      }
    }
  }

  if(intermediatePopulation.length + considerElitism < populationSize) {
    throw new Error("Popolation size error, less individuals");
  }

  if(intermediatePopulation.length + considerElitism != populationSize) {
    throw new Error("Popolation size error");
  }
}

const crossover = () => {
  population = []

  while(intermediatePopulation.length > 1) {
    let pos1 = Math.floor((Math.random() * intermediatePopulation.length));
    let pos2 = Math.floor((Math.random() * intermediatePopulation.length));
    while(pos1 == pos2 && intermediatePopulation.length >= 2) { pos2 = Math.floor((Math.random() * intermediatePopulation.length)); }

    if(Math.random() < crossProb) {
      let posCross = Math.floor((Math.random() * intermediatePopulation[0].individual.length));

      let removed1 = intermediatePopulation[pos1].individual.splice(posCross, 64);
      let removed2 = intermediatePopulation[pos2].individual.splice(posCross, 64);

      intermediatePopulation[pos1].individual = intermediatePopulation[pos1].individual.concat(removed2);
      intermediatePopulation[pos2].individual = intermediatePopulation[pos2].individual.concat(removed1);
    }

    //just to know that the individual is new but its objective function isn't calculated
    intermediatePopulation[pos1].objectiveFunc = -1;
    intermediatePopulation[pos2].objectiveFunc = -1;

    population.push(cloneObject(intermediatePopulation[pos1]));
    population.push(cloneObject(intermediatePopulation[pos2]));

    intermediatePopulation.splice(pos1, 1);
    pos1 > pos2 ? intermediatePopulation.splice(pos2, 1) : intermediatePopulation.splice(pos2 - 1, 1);
   }

  if((populationSize - elite.length) % 2) {
    population.push(cloneObject(intermediatePopulation[0]));
  }

  if(population.length + elite.length != populationSize) {
    throw new Error("Popolation size error");
  }
}

const mutation = () => {
  for(let i = 0; i < population.length; i++) {
    if(Math.random() < mutationProb) {
      let individualSize = population[i].individual.length;
      let pos = Math.floor((Math.random() * individualSize));
      let change = Math.floor((Math.random() * (individualSize - pos)))

      population[i].individual[pos] = change;
    }
  }
}

const addElite = () => {
  while(elite.length > 0) {
    population.push(cloneObject(elite[0]));
    elite.splice(0,1);
  }
}

const initData = () => {
	generation = 0
  populationObjectiveFuncForMax = 0
  populationObjectiveFuncSum = 0
  population = []
  for(let i = 0; i < populationSize; i++) {
    individual = []
    objectiveFunc = 0
    initializeMatrix()
    calcIndividual()
    objectiveFunc = calcObjectiveFunc()
    populationObjectiveFuncForMax += (1 / (cloneObject(objectiveFunc) + 1))
    populationObjectiveFuncSum += cloneObject(objectiveFunc)
    population.push({
      individual: cloneObject(individual),
      objectiveFunc: cloneObject(objectiveFunc),
      objectiveFuncForMax: 1 / (cloneObject(objectiveFunc) + 1)
    })
  }
}

const countNumbers = () => {
	for(let linha = 1; linha < 10; linha++) {
		for(let coluna = 1; coluna < 10; coluna++) {
			if(sudokuCell(linha,coluna) != 0 && document.getElementById('cell-'+(linha)+(coluna)).disabled == true){
				amount[sudokuCell(linha,coluna)]++;
			}
    }
  }
}

const createMissing = () => {
	for(let numero = 1; numero < 10; numero++) {
		for(let vezes = 1; vezes < 10; vezes++) {
			if(amount[numero] > 0){
				amount[numero]--
			}
			else{
				missing.push(numero)
			}
    }
  }
}

const calcIndividual = () => {
	let falt = cloneObject(missing);
	for(let linha = 1; linha < 10; linha += 1) {
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(sudokuMatrix[linha][coluna] == 0){
				let newNumero = Math.floor((Math.random() * falt.length));
				sudokuMatrix[linha][coluna] = falt[newNumero]
				individual.push(newNumero);
				falt.splice(newNumero, 1);
			}
    }
  }
}

const calcObjectiveFunc = () => {
  let func = 0;
	func += countRepeatedCol();
	func += countRepeatedLine();
	func += countRepeatedBlock();
  return func;
}

const countRepeatedCol = () => {
	let quantidadeNumeros = 0
	for(let coluna = 1; coluna < 10; coluna += 1) {
		let feitos = [0,0,0,0,0,0,0,0,0,0]
		let q = 0
		for(let linha = 1; linha < 10; linha += 1) {
			let numero = sudokuMatrix[linha][coluna]
			feitos[numero]++
    }
    q += feitos.reduce((a,b)=>(b==1 || b==0)?a:(a+b-1));
    quantidadeNumeros += q
  }
  return quantidadeNumeros
}

const countRepeatedLine = () => {
	let quantidadeNumeros = 0
	for(let linha = 1; linha < 10; linha += 1) {
		let feitos = [0,0,0,0,0,0,0,0,0,0]
		let q = 0
		for(let coluna = 1; coluna < 10; coluna += 1) {
			let numero = sudokuMatrix[linha][coluna]
			feitos[numero]++
    }
    q += feitos.reduce((a,b)=>(b==1 || b==0)?a:(a+b-1));
    quantidadeNumeros += q
  }
  return quantidadeNumeros
}

const countRepeatedBlock = () => {
	let quantidadeNumeros = 0
	for(let l = 0; l < 3; l += 1) {
		for(let c = 0; c < 3; c += 1) {
			let feitos = [0,0,0,0,0,0,0,0,0,0]
			let q = 0
			for(let linha = 0; linha < 3; linha += 1) {
				for(let coluna = 0; coluna < 3; coluna += 1) {
					let numero = sudokuMatrix[l*3+linha+1][c*3+coluna+1]
					feitos[numero]++
		    }
	    }
	    q += feitos.reduce((a,b)=>(b==1 || b==0)?a:(a+b-1));
    	quantidadeNumeros += q
    }
  }
  return quantidadeNumeros
}

const initializeMatrix = () => {
	for(let linha = 1; linha < 10; linha += 1) {
		sudokuMatrix[linha] = [];
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(document.getElementById('cell-'+(linha)+(coluna)).disabled == true)
				sudokuMatrix[linha][coluna] = cloneObject(sudokuCell(linha,coluna));
			else
				sudokuMatrix[linha][coluna] = 0;
    }
  }
}

const updateSudoku = (bestIndividual, show) => {
	let falt = cloneObject(missing);
	let c = 0
	for(let linha = 1; linha < 10; linha += 1) {
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(sudokuMatrix[linha][coluna] == 0){
				let newNumero = bestIndividual[c];
				sudokuMatrix[linha][coluna] = falt[newNumero]
				if(show) { setSudokuCell(linha,coluna,falt[newNumero]); }
				falt.splice(newNumero, 1);
				c++
			}
  	}
	}
}

const setSudokuCell = (l,c,n) =>{
	document.getElementById('cell-'+(l)+(c)).value = n;
}

const sudokuCell = (l,c) =>{
	let n = document.getElementById('cell-'+(l)+(c)).value;
	if(n != "")
		return parseInt(n)
	else
		return 0
}

const getBestIndividualIndex = () => {
  let best = 10000;
  let index = 0;
  for(let i = 0; i < populationSize; i++) {
    if(population[i].objectiveFunc < best) {
      best = population[i].objectiveFunc;
      index = i;
    }
  }

  return index;
}

const sortPopulation = () => {
  population.sort(function(a, b) {
    return a.objectiveFunc - b.objectiveFunc;
  })
}

const fixCells = () => {
	for(let linha = 1; linha < 10; linha += 1) {
		for(let coluna = 1; coluna < 10; coluna += 1) {
			if(document.getElementById('cell-'+(linha)+(coluna)).value != 0){
				disableSudokuCell(linha,coluna);
			}
		}
	}
}

const disableSudokuCell = (l,c) =>{
	document.getElementById('cell-'+(l)+(c)).style.color = "blue";
	document.getElementById('cell-'+(l)+(c)).disabled = true;
}

function cloneObject(obj) {
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
      copy[i] = cloneObject(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = cloneObject(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}
