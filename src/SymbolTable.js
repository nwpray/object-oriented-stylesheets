import Symbol from './Symbol';

let currentSymbol = new Symbol();
export default class SymbolTable{

    constructor(){
        this.symbols = [];
    }

    push(symbol, type){
        symbol.symid = "" + type + Symbol.symid();
        this.symbols.push(symbol);
    }

    commitCurrent(type){
        this.push(SymbolTable.currentSymbol, type);
        SymbolTable.currentSymbol = new Symbol();
    }

    currentSymbol(symbol){
        if(typeof symbol !== 'undefined')
            currentSymbol = symbol;

        return currentSymbol;
    }
}