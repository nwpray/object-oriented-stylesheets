export default class OosException{
    static ParserExpected(expected, found){
        console.log(`Line: ${found.line} - Expected [${expected.join(' | ')}] but found ${found.type} '${found.lexeme}'`);
        process.exit();
    }
}