import Token from './Token';

const token_groups = [
    {
        group: "keyword",
        lexemes: ["class", "abstract", "selector", "extends", "implements"]
    },
    {
        group: "string",
        lexemes: ["'.*'"]
    },
    {
        group:"symbol",
        lexemes: ["\\{", "\\}", "\\:", "\\;"]
    },
    {
        group:"newline",
        lexemes: ['\\\n']
    },
    {
        group:"whitespace",
        lexemes: ['\\s']
    },
    {
        group:"identifier",
        lexemes: ['[a-zA-Z_][a-zA-Z1-9_-]+']
    },
    {
        group:"unknown",
        lexemes: ['.']
    }
];

export default class Tokenizer{

    static tokenize(string){
        let tokens = [];
        let line = 1;

        while(string.length > 0){
           for(let group in token_groups){
               let re = new RegExp("^(" + token_groups[group].lexemes.join("|") + ")");
               let matches = string.match(re);
               if(matches){
                   if(token_groups[group].group != 'whitespace' && token_groups[group].group != 'newline')
                       tokens.push(new Token(token_groups[group].group, matches[0], line));

                   string = string.slice(matches[0].length);

                   if(token_groups[group].group === 'newline')
                       line++;

                   break;
               }
           }
        }

        return {
            tokens: tokens,
            next: function(){
                if(this.tokens.length < 1)
                    return null;

                return this.tokens[0];
            },
            peek: function(count){
                if(this.tokens.length < 2)
                    return null;

                return this.tokens[count];
            },
            shift: function(){
                if(this.tokens.length > 0)
                    this.tokens = this.tokens.slice(1);
            }
        };
    }

};