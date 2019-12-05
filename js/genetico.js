// var populationSize = 2000;
// var elitism = true;
// var crossProb = 0.9;
// var mutationProb = 0.05;
// var maxNumGenerations = 500;

// chegou em 9
// var populationSize = 2000;
// var elitism = true;
// var crossProb = 0.9;
// var mutationProb = 0.15;
// var maxNumGenerations = 600;
var testsCount = 0;

var populationSize = 10;
var elitism = true;
var crossProb = 0.8;
var mutationProb = 0.05;
var maxNumGenerations = 50;

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

var historyTests = [];

const genetico = () => {
  testsCount += 1;
  objectiveFunc = 0;
	countNumbers() //conta quantos numeros ja estao no tabuleiro
	createMissing() //cria array com numeros missing

	initData()

	// console.log("Começo:",clone(populationObjectiveFuncSum))
  // console.log("População:")
	// console.table(clone(population))

  // console.log("New genetic population test:")
  // console.log("elistim:",elitism)
  // console.log("populationSize:",populationSize)
  // console.log("crossProb:",crossProb)
  // console.log("mutationProb:",mutationProb)
  // console.log("maxNumGenerations:",maxNumGenerations)

  initializeMatrix();
  let index = getBestIndividualIndex();
  updateSudoku(clone(population[index].individual), false);

  nextGeneration()

  while(generation < maxNumGenerations) {
    nextGeneration();
    console.log("População:")
  	console.table(clone(population))
  }

  initializeMatrix();
  index = getBestIndividualIndex();
  // updateSudoku(clone(population[index].individual), true);
  updateSudoku(clone(population[index].individual), false);

  console.log("TestsCount = ", testsCount, " AdaptFunc -> ", clone(population[index].objectiveFunc));

  historyTests.push({
    elitism: elitism,
    populationSize: populationSize,
    crossProb: crossProb,
    mutationProb: mutationProb,
    maxNumGenerations: maxNumGenerations,
    foundSolution: false,
    resultAdaptFunc: clone(population[index].objectiveFunc),
    bestIndividual: clone(population[index].individual)
  });
}

const nextGeneration = () => {
  selection();
  crossover();
  mutation();

  populationObjectiveFuncForMax = 0
  populationObjectiveFuncSum = 0

  //recalculate objective function
  for(let i = 0; i < populationSize; i++) {
    initializeMatrix();
    individual = clone(population[i].individual);
    updateSudoku(clone(population[i].individual), false);

    objectiveFunc = 0;
    objectiveFunc = calcObjectiveFunc();
    population[i].objectiveFunc = clone(objectiveFunc);
    population[i].objectiveFuncForMax = 1 / (clone(objectiveFunc) + 1);

    populationObjectiveFuncForMax += (1 / (clone(objectiveFunc) + 1))
    populationObjectiveFuncSum += clone(objectiveFunc)
  }

  generation = generation + 1;
  console.log("Geração:",clone(generation))
  // console.log("Começo:",clone(populationObjectiveFuncSum))

  // console.log("População:")
  // console.table(clone(population));

  initializeMatrix();
  let index = getBestIndividualIndex();
  updateSudoku(clone(population[index].individual), false);
  // console.log("bestIndividual: ",clone(population[index].individual))

  console.log("bestIndividualObjectiveFunc: ",clone(population[index].objectiveFunc));

  if(population[index].objectiveFunc <= 0) {
    console.log("População:")
    console.table(clone(population));

    console.log("Solution found!!!");
    updateSudoku(clone(population[index].individual), true);
    // console.log("Solution individual:",clone(population[index].individual));
    historyTests.push({
      elitism: elitism,
      populationSize: populationSize,
      crossProb: crossProb,
      mutationProb: mutationProb,
      maxNumGenerations: maxNumGenerations,
      foundSolution: true,
      resultAdaptFunc: clone(population[index].objectiveFunc),
      bestIndividual: clone(population[index].individual)
    });
    return;
  }

  // if(generation <= maxNumGenerations) {
  //   // nextGeneration();
  // }
  // else {
  //   // console.log("Result best individual:",clone(population[index].individual))
  //   // console.log("Result => adaptFunc:",clone(population[index].objectiveFunc));
  //   // console.log("População:")
  //   // console.log(clone(population));
  //
  //   initializeMatrix();
  //   updateSudoku(clone(population[index].individual), true);
  //
  //   historyTests.push({
  //     elitism: elitism,
  //     populationSize: populationSize,
  //     crossProb: crossProb,
  //     mutationProb: mutationProb,
  //     maxNumGenerations: maxNumGenerations,
  //     foundSolution: false,
  //     resultAdaptFunc: clone(population[index].objectiveFunc),
  //     bestIndividual: clone(population[index].individual)
  //   });
  // }
}

const selection = () => {
  //pelo slide 32 de algoritmo genetico da aula, se ao fazer a seleção fatarem individuos, complete com o melhor. (fazendo um elitismo)

  intermediatePopulation = [];

  if(elitism) {
    let index = getBestIndividualIndex();
    // console.log("On selection = ", index);
    // console.table(clone(population));
    intermediatePopulation.push(clone(population[index]));
  }

  let considerElitism = elitism ? 1 : 0;

  for(let i = 0; i < populationSize - considerElitism; i++) {
    let prob = Math.random();
    let sumProbs = 0;
    for(let j = 0; j < populationSize; j++) {
      sumProbs += clone(population[j].objectiveFuncForMax) / clone(populationObjectiveFuncForMax);
      if(sumProbs >= prob) {
        intermediatePopulation.push(clone(population[j]));
        break;
      }
      if(j == populationSize -1) {
        // console.log(sumProbs);
        intermediatePopulation.push(clone(population[j]));
      }
    }
  }

  if(intermediatePopulation.length < populationSize) {
    throw new Error("Popolation size error, less individuals");
  }

  if(intermediatePopulation.length != populationSize) {
    throw new Error("Popolation size error");
  }

  // console.log("After selection:")
  // console.table(clone(intermediatePopulation));
}

const crossover = () => {
  population = []

  // let test = true;

  // for(let i = 0; i < populationSize / 2; i++) {
  while(intermediatePopulation.length > 1) {
    let pos1 = Math.floor((Math.random() * intermediatePopulation.length));
    let pos2 = Math.floor((Math.random() * intermediatePopulation.length));
    while(pos1 == pos2 && intermediatePopulation.length >= 2) { pos2 = Math.floor((Math.random() * intermediatePopulation.length)); }

    // if(test) console.log(pos1, " - pos -  " , pos2);

    if(Math.random() < crossProb) {
      let posCross = Math.floor((Math.random() * intermediatePopulation[0].individual.length));

      // if(test) console.log("posCross ", posCross);
      // test = false;

      // console.log("trying cross")
      // console.log(intermediatePopulation[pos1].individual)
      // console.log(intermediatePopulation[pos2].individual)

      let removed1 = intermediatePopulation[pos1].individual.splice(posCross, 64);
      let removed2 = intermediatePopulation[pos2].individual.splice(posCross, 64);

      intermediatePopulation[pos1].individual = intermediatePopulation[pos1].individual.concat(removed2);
      intermediatePopulation[pos2].individual = intermediatePopulation[pos2].individual.concat(removed1);

      // console.log(intermediatePopulation[pos1].individual)
      // console.log(intermediatePopulation[pos2].individual)
    }

    //just to know that the individual is new but its objective function isn't calculated
    intermediatePopulation[pos1].objectiveFunc = -1;
    intermediatePopulation[pos2].objectiveFunc = -1;

    population.push(clone(intermediatePopulation[pos1]));
    population.push(clone(intermediatePopulation[pos2]));

    intermediatePopulation.splice(pos1, 1);
    pos1 > pos2 ? intermediatePopulation.splice(pos2, 1) : intermediatePopulation.splice(pos2 - 1, 1);
   }

  if(populationSize % 2) {
    population.push(clone(intermediatePopulation[0]));
  }

  if(population.length != populationSize) {
    throw new Error("Popolation size error");
  }

  // console.log("After crossover")
  // console.table(clone(population))
}

const mutation = () => {
  for(let i = 0; i < populationSize; i++) {
    if(Math.random() < mutationProb) {
      let individualSize = population[i].individual.length;
      let pos = Math.floor((Math.random() * individualSize));
      let change = Math.floor((Math.random() * (individualSize - pos)))

      //console.log("mutation on individual ", i);
      population[i].individual[pos] = change;
    }
  }

  // console.log("After mutation");
  // console.table(clone(population));
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
    // preencherSudoku() //just if this individual is the best on his generation
    populationObjectiveFuncForMax += (1 / (clone(objectiveFunc) + 1))
    populationObjectiveFuncSum += clone(objectiveFunc)
    population.push({
      individual: clone(individual),
      objectiveFunc: clone(objectiveFunc),
      objectiveFuncForMax: 1 / (clone(objectiveFunc) + 1)
    })
  }
}

const countNumbers = () => {
	for(let linha = 1; linha < 10; linha++) {
		for(let coluna = 1; coluna < 10; coluna++) {
			if(sudoku(linha,coluna) != 0){
				amount[sudoku(linha,coluna)]++;
			}
    }
  }
  //console.log("numeros:",amount);
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
	//console.log("missing:")
	//console.log(missing)
}

const calcIndividual = () => {
	let falt = clone(missing);
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
				sudokuMatrix[linha][coluna] = clone(sudokuCell(linha,coluna));
			else
				sudokuMatrix[linha][coluna] = 0;
    }
  }
}

const updateSudoku = (bestIndividual, show) => {
	let falt = clone(missing);
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
