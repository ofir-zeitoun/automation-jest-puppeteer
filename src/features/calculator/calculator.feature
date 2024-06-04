Feature: Calculator

  Scenario: Add two numbers

    Given first number is 4
    When second number is 3
    Then Their sum should be 7

  Scenario: Add another two numbers

    Given first number is 10
    When second number is 20
    Then Their sum should be 30

    
  Scenario: Subtract two numbers

    Given first number is 30
    When second number is 10
    Then Their diff should be 20