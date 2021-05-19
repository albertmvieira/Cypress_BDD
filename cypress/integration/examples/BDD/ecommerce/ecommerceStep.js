/// <reference types="Cypress" />
import HomePage from '../../../../support/pageObjects/HomePage'
import ProductPage from '../../../../support/pageObjects/ProductPage'
import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

//cypress run --spec cypress\integration\examples\BDD\*.feature --headed --browser chrome
//npx cypress-tags run -e TAGS="@Smoke" --headed --browser chrome
//add cucumber report options in package.json ->output.json
//use html report plugin create js file (pass the details of output.json)

const homePage = new HomePage()
const productPage = new ProductPage()
//let é variavel que possui escopo de bloco também, neste caso como esta sendo declarada fora de metodo, esta com escopo global, funcionando igual var
let name

Given('I open ecommerce page', () => {
    //pegando a URL direto do cypress.json env - Lugar para criar variaveis globais que podem ser chamadas diretamente através do comando Cypress
    cy.visit(Cypress.env('url') + "/angularpractice/")
})

When('I add items to cart', function () {
    //this.dados.name - utilizando a chave name declarada no arquivo .json de fixtures
    homePage.getEditBox().type(this.dados.name)
    homePage.getGender().select(this.dados.gender)
    homePage.getTwoWayDataBinding().should('have.value', this.dados.name)
    //have.attr extraindo o valor de um atributo de um elemento
    homePage.getEditBox().should('have.attr', 'minlength', '2')
    homePage.getEntreperneaur().should('be.disabled')

    //Cypress.config possibilita sobrepor configurações do cypress.json neste caso sobreponto timeout para o próximo comando. fica válido apenas ao teste
    Cypress.config('defaultCommandTimeout', 10000)
    homePage.getShopTab().click()
    //cy.pause() - para aplicação para poder analisar os script, depois é só clicar em resume no runner do cypress
    //cy.pause()
    //cy.get(':nth-child(2) > .nav-link').click().debug - o debug no final para a execução neste ponto para poder debugar, funciona como o pause
    //chamando comando(metodo) customizado na classe commands.js "selectProduct" nome do comando criado
    //this.dados = utilizando variavel global criada no before que referencia o fixture example.json
    //prductName foi criado como aray no example.json, por isso esta sendo realizado um foreach passando cada elemento deste array para o metodo selectProduct. Irá executar de acrodo com o tamanho do array, clicando nos produtos informados
    this.dados.productName.forEach(function (element) {
        cy.log("Name of the Product selected:  " + element)
        cy.selectProduct(element)
    });
    productPage.getCheckOutButton().click()
})

And('Validate the total prices', () => {
    var sum = 0
    //each = Comando do cypress para foreach. Encontrar um elemento no array
    cy.get('tr td:nth-child(4) strong').each(($el, index, $list) => {
        cy.log("Valor com formatação: " + $el.text())
        const valor = $el.text()
        //utilizando 'var' para criar variavel ao inves de const pois reutilizaremos a varialvel para sobreescrever o proprio valor
        //utilizando os comandos javascript split e trim para formatar o valor
        var res = valor.split(" ")
        res = res[1].trim()
        cy.log("Valor formatado: " + res)
        //Utilizando comando Number para formatar para numero
        sum = Number(sum) + Number(res)
    })
        //utilizando then devido javascript ser assincrono, caso contrario iria imprimir o valor de sum como zero pois não executaria na sequencia
        .then(function () {
            cy.log("Soma dos Valores: " + String(sum))
        })
    cy.get('h3 strong').then(function (element) {
        var total = element.text().split(" ")
        total = total[1].trim()
        expect(Number(total)).to.equal(sum)
    })
})

Then('Select the country submit and verify thankyou message', () => {
    //contains procura um elemento que contém o texto
    cy.contains('Checkout').click()
    cy.get('#country').type('India')
    cy.get('.suggestions > ul > li > a').click()
    //usando force true no clique pois assim clica mesmo que outro elemento estejo encobrindo sua visualização
    cy.get('#checkbox2').click({ force: true })
    cy.get('input[type="submit"]').click()
    //cy.get('.alert').should('have.text','Success! Thank you! Your order will be delivered in next few weeks :-).')
    //validação do texto acima não foi possivel através do should.have.text pq o texto esta vindo com quebras de linhas e outros caracteres
    //necessário armazenar em uma varável e verifica se contem o texto
    cy.get('.alert').then(function (element) {
        const actualText = element.text()
        //validando o texto com .to.be.true do Chai expect 
        expect(actualText.includes("Success! Thank you! Your order will be delivered in next few weeks :-).")).to.be.true
    })
})


When('I fill the form details', function (dataTable) {
    name = dataTable.rawTable[1][0]
    homePage.getEditBox().type(dataTable.rawTable[1][0])
    homePage.getGender().select(dataTable.rawTable[1][1])
})

Then('Validate the forms behaviour', function () {
    homePage.getTwoWayDataBinding().should('have.value', name)
    //have.attr extraindo o valor de um atributo de um elemento
    homePage.getEditBox().should('have.attr', 'minlength', '2')
    homePage.getEntreperneaur().should('be.disabled')

    //Cypress.config possibilita sobrepor configurações do cypress.json neste caso sobreponto timeout para o próximo comando. fica válido apenas ao teste
    Cypress.config('defaultCommandTimeout', 10000)
})

And('Select the Shop Page', () => {
    homePage.getShopTab().click()
})