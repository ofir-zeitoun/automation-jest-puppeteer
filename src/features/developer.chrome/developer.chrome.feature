Feature: Sites

    Scenario: find an element on a site

        Given I open a site "https://developer.chrome.com/"
        When I type "automate beyond recorder" into selector ".devsite-search-field"
        Then The element ".devsite-search-field" should exist
