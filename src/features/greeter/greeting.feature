Feature: Greeting

  Scenario: Say hello

    When the greeter says hello "ofir"
    Then I should have heard "Hello, ofir!"

