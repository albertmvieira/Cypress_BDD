beforeEach(function () {
    //Mocha before ou beforeEach não suporta criação de metodos abreviadas exemplo: () => necessário criar do jeito padrão function () {
    // O mesmo serve para o metodo que for chamar e receber a informação
    //fixture define qual o arquivo de example será utilizado para dados pode haver varios .json na pasta fixtures
    cy.fixture('example').then(function (data) {
        //this.variavel = definindo variavel global da classe criada
        this.dados = data
    })
})