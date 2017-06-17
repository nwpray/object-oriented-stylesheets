import Tokenizer from './src/Tokenizer';
import Parser from './src/Parser';
import path from 'path';
import fs from 'fs';

fs.readFile("sample.oos", 'utf8', function(err, data){
    let symbols = Parser.buildSymbolTable(Tokenizer.tokenize(data));
    console.log(symbols);
});