Feature: Sites

  Scenario: Check the berkeley site's post data

    Given I open a site "https://cgi-lib.berkeley.edu/ex/simple-form.html"
    When I type "Hello" into selector "body > form > input[name='name']"
    And I type "World" into selector "body > form > p > input[name='quest']"
    #When I wait for response
    #When I click on selector "input[type=submit]"
    When I submit a form on "input[type=submit]"
    Then data should have "name" with "Hello"
    Then data should have "quest" with "World"
