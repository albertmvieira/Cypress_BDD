Feature: End to End Ecommerce validation

    Application regression

    #Scenario utilizando dados através do fixture do cypress (RECOMENDADO)
    @Regression
    Scenario: Ecommerce products delivery
        Given I open ecommerce page
        When I add items to cart
        And Validate the total prices
        Then Select the country submit and verify thankyou message

    #Scenario utilizando data.driven do cucumber (NÃO RECOMENDADO) pois perde as facilidades do cypress
    @Smoke
    Scenario: Filling the form to shop
        Given I open ecommerce page
        When I fill the form details
            | name | gender |
            | Toby | Male   |
        Then Validate the forms behaviour
        And Select the Shop Page