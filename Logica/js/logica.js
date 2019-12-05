var matrix = [];
var acabei = false;

var p = 0;
var q = 0;
var solucoes = 0;
var fileInput = document.getElementById('fileInput');
var button = document.getElementById('Solucionar');
var button2 = document.getElementById('Solucionar2');
var fileDisplayArea = document.getElementById('fileDisplayArea');
var res = document.getElementById('resultado');

fileInput.addEventListener('change', function(e) {
  var file = fileInput.files[0];
  var textType = /text.*/;

  resetMatrix();

  if (file.type.match(textType)) {
    var reader = new FileReader();

    reader.onload = function(e) {
      fileDisplayArea.innerText = reader.result;
      var numeros = (reader.result).split(/[\s\n]+/);
      for (var i = 0; i < numeros.length; i++) {
        if(numeros[i].trim() != ""){
          var l = numeros[i].substring(0,1);
          var c = numeros[i].substring(1,2);
          var n = numeros[i].substring(2,3);
          document.getElementById('cell-'+l+c).setAttribute('value',n);
          document.getElementById('cell-'+l+c).value = n;
          matrix[l-1][c-1][n] = true;
          matrix[l-1][c-1][0] = true;
        }
      }
    }

    reader.readAsText(file);    
  } else {
      fileDisplayArea.innerText = "File not supported!"
  }
});

const iniMatrix = function(){
  acabei = false;
  solucoes = 0;
  for(var linha = 0; linha < 9; linha += 1) {
    matrix[linha] = [];
    for(var coluna = 0; coluna < 9; coluna += 1) {
      matrix[linha][coluna] = [];
      for(var num = 0; num <= 9; num++) {
        if(document.getElementById('cell-'+(linha+1)+(coluna+1)).value == num){
          if(num != 0)
            setTrueMatrix(linha,coluna,num);
        }
        else{
          matrix[linha][coluna][num] = false;
        }
      }
    }
  }
}


const resetMatrix = function(){
  acabei = false;
  solucoes = 0;
  for(var linha = 0; linha < 9; linha += 1) {
    matrix[linha] = [];
    for(var coluna = 0; coluna < 9; coluna += 1) {
      matrix[linha][coluna] = [];
      for(var num = 0; num <= 9; num++) {
        matrix[linha][coluna][num] = false;
      }
      document.getElementById('cell-'+(linha+1)+(coluna+1)).disabled = false;
      // document.getElementById('cell-'+(linha+1)+(coluna+1)).setAttribute('value',"");
      document.getElementById('cell-'+(linha+1)+(coluna+1)).value = "";
    }
  }
}

const setTrueMatrix = function(l,c,n){
    document.getElementById('cell-'+(l+1)+(c+1)).setAttribute('value',n);
    document.getElementById('cell-'+(l+1)+(c+1)).value = n;
    matrix[l][c][n] = true;
}

const setFalseMatrix = function(l,c,n){
  document.getElementById('cell-'+(l+1)+(c+1)).setAttribute('value',"");
  document.getElementById('cell-'+(l+1)+(c+1)).value = "";
  matrix[l][c][n] = false;
}

const setValMatrix = function(n,l,c){
  for(var num = 0; num <= 9; num++) {
    matrix[l][c][num] = false;
  }
  if(n != ""){
    if(n>9){
      n = 9;
    } else if(n<1){
      n = 1;
    }
    setTrueMatrix(parseInt(l),parseInt(c),n);
    matrix[l][c][0] = true;
  }
}

const infinito = function(){
  const continuar = function(){
    var Atest = A(matrix);
    var Btest = B(matrix);
    var Ctest = C(matrix);
    var Dtest = D(matrix);
    var Etest = E(matrix);

    if(Atest && Btest){
      if(Ctest && Dtest && Etest){
        console.log("Achei solução")
        alert("Solução achada"),
        acabei = true;
      }
      else{
        setTimeout(function() {aumentarUltimoNumeroMatrix();}, 1);
      }
    }
    else{
      setTimeout(function() {adicionrUltimoNumeroMatrix();}, 1);
    }
    setTimeout(function() {
      if(!acabei)
        continuar()
      else{
        console.log("Acabei");
      }

    },3);
  }

  for(var linha = 0; linha < 9; linha += 1) {
    for(var coluna = 0; coluna < 9; coluna += 1) {          
      if(matrix[linha][coluna][0] == true){
        document.getElementById('cell-'+(linha+1)+(coluna+1)).disabled = true;
      }
    }
  }

  var Atest = A(matrix);
  var Btest = B(matrix);
  var Ctest = C(matrix);
  var Dtest = D(matrix);
  var Etest = E(matrix);

  if(Ctest && Dtest && Etest){
    continuar();
  }
  else{
    fileDisplayArea.innerText = "Sudoku Errado"
  }
}

const curta = function(){
  var continuar = function(){
    var Atest = A(matrix);
    var Btest = B(matrix);
    var Ctest = C(matrix);
    var Dtest = D(matrix);
    var Etest = E(matrix);

    if(Ctest && Dtest && Etest){
      if(Atest && Btest){
          console.log("Achei solução")
          alert("Solução achada"),
          acabei = true;
        }
        else{
          setTimeout(function() {adicionrUltimoNumeroMatrix();}, 1);
      }
    }
  else{
        setTimeout(function() {aumentarUltimoNumeroMatrix();}, 1);
    }
      setTimeout(function() {
        if(!acabei)
          continuar()
        else{
          console.log("Acabei");
          // console.log("O sudoku tem "+solucoes+" Soluções");
          // res.innerText = "O sudoku tem "+solucoes+" Soluções";
        }

      },3);
  }


  for(var linha = 0; linha < 9; linha += 1) {
    for(var coluna = 0; coluna < 9; coluna += 1) {          
      if(matrix[linha][coluna][0] == true){
        document.getElementById('cell-'+(linha+1)+(coluna+1)).disabled = true;
      }
    }
  }

  var Atest = A(matrix);
  var Btest = B(matrix);
  var Ctest = C(matrix);
  var Dtest = D(matrix);
  var Etest = E(matrix);

  if(Ctest && Dtest && Etest){
    continuar();
  }
  else{
    fileDisplayArea.innerText = "Sudoku Errado"
  }

  // if(Atest)
  //   console.log("(A) Pelo Menos 1 dig True")
  // else
  //   console.log("(A) Pelo Menos 1 dig False")
  // if(Btest)
  //   console.log("(B) No Max 1 dig True")
  // else
  //   console.log("(B) No Max 1 dig False")
  // if(Ctest)
  //   console.log("(C) Linhas True")
  // else
  //   console.log("(C) Linhas False")
  // if(Dtest)
  //   console.log("(D) Colunas True")
  // else
  //   console.log("(D) Colunas False")
  // if(Etest)
  //   console.log("(E) Subgrid True")
  // else
  //   console.log("(E) Subgrid False")   
}

const adicionrUltimoNumeroMatrix = function () {
  for(var linha = 0; linha < 9; linha += 1) {
    for(var coluna = 0; coluna < 9; coluna += 1) {          
      if(matrix[linha][coluna][0] != true){
        var a = false;
        for (var i = 1; i <= 9; i++) {
          a = a || matrix[linha][coluna][i];
        }
        if(!a){
          setTrueMatrix(linha,coluna,1);
          p = linha;
          q = coluna;
          return;
        }
      }
    }
  }
}

const aumentarUltimoNumeroMatrix = function () {
  var a = false;
  if(!matrix[p][q][0]){
  for (var i = 1; i <= 9; i++) {
      if(!a){
        a = matrix[p][q][i];
        matrix[p][q][i] = false;
      }
      else{
        setTrueMatrix(p,q,i)
        return;
      }
    }
    setFalseMatrix(p,q,9)
  }
  q--;
  if(q<0){
    p--;
    q = 8;
    if(p<0){
      acabei = true;
      return;
    }
  }
  aumentarUltimoNumeroMatrix();      
}

iniMatrix();