let symid = 0;
export default class Symbol{
    constructor(){
        this.token = undefined;
        this.kind = undefined;
        this.value = '';
        this.symid = undefined;
        this.data = {
            modifiers: []
        };
    }

    static symid(){
        return symid++;
    }
}