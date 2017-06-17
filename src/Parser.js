import Token from './Token';
import OosException from './OosException';
import Symbol from './Symbol';
import SymbolTable from './SymbolTable';

export default class Parser{
    static buildSymbolTable(tokens){
        let symbols = new SymbolTable();
        while(tokens.next() !== null){
            if(Parser.couldBeStyleGroup(tokens.next()))
               Parser.styleGroup(...arguments, symbols);
            else
               OosException.ParserExpected(['STYLE_GROUP'], tokens.next());
        }

        return symbols;
    };

    static couldBeStyleGroup(token){
        return Parser.couldBeStyleGroupDef(token);
    }
    static styleGroup(tokens, symbols){

        //STYLE_GROUP_DEF ["extends" IDENTIFIER] ["implements" IDENTIFIER] "{" {STYLE} "}";
        if(!Parser.couldBeStyleGroupDef(tokens.next()))
            OosException.ParserExpected(['STYLE_GROUP_DEF'], tokens.next());

        Parser.styleGroupDef(...arguments);

        if(tokens.next().lexeme === 'extends')
        {
            tokens.shift();

            if(!Parser.couldBeIdentifier(tokens.next()))
                OosException.ParserExpected(['extends'], tokens.next());

            Parser.identifier(...arguments);
        }

        if(tokens.next().lexeme === 'implements')
        {
            tokens.shift();

            if(!Parser.couldBeIdentifier(tokens.next()))
                OosException.ParserExpected(['implements'], tokens.next());

            Parser.identifier(...arguments);
        }

        if(!tokens.next().lexeme === '{')
            OosException.ParserExpected(['{'], tokens.next());

        tokens.shift();

        while(Parser.couldBeStyle(tokens.next())){
            Parser.style(...arguments);
        }

        if(!tokens.next().lexeme === '}')
            OosException.ParserExpected(['}'], tokens.next());

        tokens.shift();
    }

    static couldBeStyleGroupDef(token){
        return Parser.couldBeClassDef(token) ||
            Parser.couldBeSelectorDef(token);
    }
    static styleGroupDef(tokens, symbols){
        if(Parser.couldBeClassDef(tokens.next()))
            Parser.classDef(...arguments);
        else if(Parser.couldBeSelectorDef(tokens.next()))
            Parser.selectorDef(...arguments);
        else
            OosException.ParserExpected(['class', 'selector'], tokens.next());
    }

    static couldBeClassDef(token){
        return token.lexeme === "abstract" ||
            token.lexeme === 'class';
    }
    static classDef(tokens, symbols){
        SymbolTable.currentSymbol(new Symbol(tokens.next(), 'class'));

        if(tokens.next().lexeme === "abstract"){
            tokens.shift();
            let symbol = SymbolTable.currentSymbol();
            symbol.data.modifiers.push('abstract');
            SymbolTable.currentSymbol(symbol);
        }

        if(tokens.next().lexeme === "class"){
            tokens.shift();

            if(!Parser.couldBeIdentifier(tokens.next()))
                OosException.ParserExpected(['identifier'], tokens.next());

            Parser.identifier(...arguments);
        }
        else
            OosException.ParserExpected(['abstract', 'class'], tokens.next());

        symbols.commitCurrent();
    }

    static couldBeIdentifier(token){
        return token.type === 'identifier';
    }
    static identifier(tokens, symbols){
        SymbolTable.currentSymbol({...(SymbolTable.currentSymbol()), value: tokens.current().lexeme});
        tokens.shift();
    }

    static couldBeSelectorDef(token){
        return token.lexeme === 'selector';
    }
    static selectorDef(tokens, symbols){
        if(tokens.next().lexeme !== 'selector')
            OosException.ParserExpected(['selector'], tokens.next());

        tokens.shift();

        if(!Parser.couldBeString(tokens.next()))
            OosException.ParserExpected(['string'], tokens.next());

        Parser.string(...arguments);
    }

    static couldBeStyle(token){
        return Parser.couldBeIdentifier(token);
    }
    static style(tokens, symbols){
        if(Parser.couldBeStyle(tokens.next())) {
            tokens.shift();
        }
        else
            OosException.ParserExpected(['identifier'], tokens.next());

        if(tokens.next().lexeme === ':'){
            tokens.shift();

            if(!Parser.couldBeString(tokens.next()))
                OosException.ParserExpected(['string'], tokens.next());

            Parser.string(...arguments);
        }

        if(tokens.next().lexeme !== ';')
            OosException.ParserExpected([';'], tokens.next());

        tokens.shift();
    }

    static couldBeString(token){
        return token.type === 'string';
    }
    static string(tokens, symbols){
        tokens.shift();
    }
}