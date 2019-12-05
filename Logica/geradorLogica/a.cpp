#include <bits/stdc++.h>
#include <iostream>
#include <fstream>  

using namespace std;

bool grid[9][9][10];

string checandoPeloMenos1digCasaIJ(int i, int j){
  	bool flag = false;
  	stringstream sstm;
  	sstm << "var A"<<i<<j<<" = (";
  	string texto = "";
	for(int k = 1 ; k <= 9 ; k++){
	  	if(k != 1)
	  		sstm << " || ";
	  	sstm << "lista["<<i<<"]["<<j<<"]["<<k<<"]";	  	
	}   
	texto += sstm.str(); 
	texto += ");\n";
	return texto;
}

string checandoPeloMenos1dig(){   // existe pelo menos 1 digito em cada casa
  	bool resp = true;
  	string texto = "";
  	stringstream stvar;
  	stringstream streturn;
  
  	texto += "var A = function(lista){ \n"; 	
  	streturn << "return ";
  	
  	for(int i = 0 ; i < 9 ; i++){  	
  		if(i != 0)
  			streturn << " && ";
    	for(int j = 0 ; j < 9 ; j++){
    		if(j != 0)
  				streturn << " && ";
  			stvar << checandoPeloMenos1digCasaIJ(i,j);
      		streturn << "A"<<i<<j;      		
    	}
  	}
  	texto += stvar.str(); 
  	texto += streturn.str(); 
  	texto += ";}";
  	return texto;
}

string checandoNoMax1digCasaIJ(int i, int j) {
  	bool flag = true; 
  	stringstream sstm;
  	sstm << "var B"<<i<<j<<" = (";
	string texto = "";
  	for(int k = 1 ; k <= 8 ; k++){  
	  	if(k != 1)
	  		sstm << " && ";
	    for(int d = k+1 ; d <= 9 ; d++){
	    	if(d != k+1)
	  			sstm << " && ";
	  		sstm << "!(lista["<<i<<"]["<<j<<"]["<<k<<"] && lista["<<i<<"]["<<j<<"]["<<d<<"])";
	  		
	  	}    
  	}
  	
  	texto += sstm.str();
  	texto += ");\n";
  	return texto;
}

string checandoNoMax1dig(){   // existe no máximo 1 dígito em cada casa
  	bool resp = true;
  	string texto = "";
  	stringstream stvar;
  	stringstream streturn;
  	
  	texto += "var B = function(lista){ \n";
  	streturn << "return ";
  
  	for(int i = 0 ; i < 9 ; i++){
	  	if(i != 0)
  			streturn << " && ";
    	for(int j = 0 ; j < 9 ; j++){
    		if(j != 0)
  				streturn << " && ";
      		stvar << checandoNoMax1digCasaIJ(i,j);
      		streturn << "B"<<i<<j;   
    	}
  	}
	texto += stvar.str(); 
  	texto += streturn.str(); 
  	texto += ";}";
  	return texto;
}

string checandoLinhaLDigitoK(int l, int k) {
  	bool flag = true;
  	stringstream sstm;
  	sstm << "var C"<<l<<k<<" = (";
	string texto = "";
  	for(int i = 0 ; i < 8 ; i++){
	  	if(i != 0)
	  		sstm << " && ";
	    for(int j = i+1 ; j < 9 ; j++){
	    	if(j != i+1)
	  			sstm << " && ";
	  		sstm << "!(lista["<<l<<"]["<<i<<"]["<<k<<"] && lista["<<l<<"]["<<j<<"]["<<k<<"])";
		}
	}
	      	
	texto += sstm.str();
  	texto += ");\n";
  	return texto;
}

string checandoLinhas(){    // um díg aparece no máx 1 vez em cada linha
  	bool resp = true;
  	string texto = "";
  	stringstream stvar;
  	stringstream streturn;
  	
  	texto += "var C = function(lista){ \n";
  	streturn << "return ";

  	for(int l = 0 ; l < 9 ; l++){
	  	if(l != 0)
  			streturn << " && ";
    	for(int k = 1 ; k <= 9 ; k++){
    		if(k != 1)
  				streturn << " && ";
      		stvar << checandoLinhaLDigitoK(l,k);
      		streturn << "C"<<l<<k;   
    	}
  	}
	texto += stvar.str(); 
  	texto += streturn.str(); 
  	texto += ";}";
  	return texto;
}

string checandoColunaCDigitoK(int c, int k) {
  	bool flag = true;
	stringstream sstm;
  	sstm << "var E"<<c<<k<<" = (";
	string texto = "";
  	for(int i = 0 ; i < 8 ; i++){
  		if(i != 0)
	  		sstm << " && ";
	    for(int j = i+1 ; j < 9 ; j++){
	    	if(j != i+1)
	  			sstm << " && ";
	  		sstm << "!(lista["<<i<<"]["<<c<<"]["<<k<<"] && lista["<<j<<"]["<<c<<"]["<<k<<"])";
      	}
    }
	
	texto += sstm.str();
  	texto += ");\n";
  	return texto;
}

string checandoColunas(){   // um díg aparece no máx 1 vez em cada coluna
  	bool resp = true;
  	string texto = "";
  	stringstream stvar;
  	stringstream streturn;
  	
  	texto += "var E = function(lista){ \n";
  	streturn << "return ";

  	for(int c = 0 ; c < 9 ; c++){
	  	if(c != 0)
	  		streturn << " && ";
	    for(int k = 1 ; k <= 9 ; k++){
			if(k != 1)
	  			streturn << " && ";
	      	//resp &= checandoColunaCDigitoK(c, k);
	      	stvar << checandoColunaCDigitoK(c,k);
	      	streturn << "E"<<c<<k;  
	    }
  	}
	texto += stvar.str(); 
  	texto += streturn.str(); 
  	texto += ";}";
  	return texto;
}

string checandoSubGridIJDigitok(int linha, int coluna, int num) {
  	bool flag = true;
  	stringstream sstm;
  	sstm << "var D"<<linha<<coluna<<num<<" = (";
	string texto = "";

	for(int i = 0; i < 8; i++) {
		if(i != 0)
  			sstm << " && ";
	    for(int ii = i+1; ii < 9; ii++) {
	    	if(ii != i+1)
  				sstm << " && ";
	  		sstm << "!(lista["<<(linha + i/3)<<"]["<<(coluna + i%3)<<"]["<<num<<"] && lista["<<(linha + ii/3)<<"]["<<(coluna + ii%3)<<"]["<<num<<"])";
	    }
	}

	texto += sstm.str();
  	texto += ");\n";
  	return texto;
}

string checandoSubGrid(){    // um díg aparece no máx 1 vez em cada sub-grid
  	bool resp = true;
  	string texto = "";
  	stringstream stvar;
  	stringstream streturn;
  	texto += "var D = function(lista){ \n";	
  	streturn << "return ";
  	for(int linha = 0; linha <= 6; linha += 3) {
  		if(linha != 0)
  			streturn << " && ";
	    for(int coluna = 0; coluna <= 6; coluna += 3) {
	    	if(coluna != 0)
  				streturn << " && ";
	      	for(int num = 1; num <= 9; num++) {
	      		if(num != 1)
  					streturn << " && ";
        		//resp &= checandoSubGridIJDigitok(linha, coluna, num);
        		stvar << checandoSubGridIJDigitok(linha, coluna, num);
        		streturn << "D"<<linha<<coluna<<num;
	      	}
    	}
  	}
	texto += stvar.str(); 
  	texto += streturn.str(); 
  	texto += ";}";
  	return texto;
}

void aumentargrid(){
  for(int i = 0 ; i < 9 ; i++){
    for(int j = 0 ; j < 9 ; j++){
      for(int k = 1 ; k <= 9 ; k++){
        if(grid[i][j][k] == false){
          grid[i][j][k] = true;
          return;
        }
        else{
          grid[i][j][k] = false;
        }
      }
    }
  }
}

int main(){

  /*for(int i = 0; i < 9; i++) {
    for(int j = 0; j < 9; j++) {
      for(int k = 1; k <= 9; k++) {
        grid[i][j][k] = false;
      }
    }
  }

  while(true) {
    if(checandoPeloMenos1dig() && checandoNoMax1dig() && checandoLinhas() && checandoColunas() && checandoSubGrid()){
      printf("Deu Certo\n");
      for(int i = 0 ; i < 9 ; i++){
        for(int j = 0 ; j < 9 ; j++){
          for(int k = 1 ; k <= 9 ; k++){
            if(grid[i][j][k]){
              printf("%d ",k);
              break;
            }
          }
        } printf("\n");
      }
      break;
    }
    else
      aumentargrid();
  }
  */
  
  	ofstream outfile ("js/sudoku.js");

	//function A
	outfile << checandoPeloMenos1dig() << endl;
	
	//function B
	outfile << checandoNoMax1dig() << endl;
	
	//function C
	outfile << checandoLinhas() << endl;
	
	//function E
	outfile << checandoColunas() << endl;
	
	//function D
	outfile << checandoSubGrid() << endl;

	outfile.close();

  return 0;
}
