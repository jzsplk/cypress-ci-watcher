"use strict";
/// <reference types="cypress" />
context('Spies, Stubs, and Clock', function () {
    it('cy.spy() - wrap a method in a spy', function () {
        // https://on.cypress.io/spy
        cy.visit('https://example.cypress.io/commands/spies-stubs-clocks');
        var obj = {
            foo: function () { },
        };
        var spy = cy.spy(obj, 'foo').as('anyArgs');
        obj.foo();
        expect(spy).to.be.called;
    });
    it('cy.spy() retries until assertions pass', function () {
        cy.visit('https://example.cypress.io/commands/spies-stubs-clocks');
        var obj = {
            /**
             * Prints the argument passed
             * @param x {any}
            */
            foo: function (x) {
                console.log('obj.foo called with', x);
            },
        };
        cy.spy(obj, 'foo').as('foo');
        setTimeout(function () {
            obj.foo('first');
        }, 500);
        setTimeout(function () {
            obj.foo('second');
        }, 2500);
        cy.get('@foo').should('have.been.calledTwice');
    });
    it('cy.stub() - create a stub and/or replace a function with stub', function () {
        // https://on.cypress.io/stub
        cy.visit('https://example.cypress.io/commands/spies-stubs-clocks');
        var obj = {
            /**
             * prints both arguments to the console
             * @param a {string}
             * @param b {string}
            */
            foo: function (a, b) {
                console.log('a', a, 'b', b);
            },
        };
        var stub = cy.stub(obj, 'foo').as('foo');
        obj.foo('foo', 'bar');
        expect(stub).to.be.called;
    });
    it('cy.clock() - control time in the browser', function () {
        // https://on.cypress.io/clock
        // create the date in UTC so its always the same
        // no matter what local timezone the browser is running in
        var now = new Date(Date.UTC(2017, 2, 14)).getTime();
        cy.clock(now);
        cy.visit('https://example.cypress.io/commands/spies-stubs-clocks');
        cy.get('#clock-div').click()
            .should('have.text', '1489449600');
    });
    it('cy.tick() - move time in the browser', function () {
        // https://on.cypress.io/tick
        // create the date in UTC so its always the same
        // no matter what local timezone the browser is running in
        var now = new Date(Date.UTC(2017, 2, 14)).getTime();
        cy.clock(now);
        cy.visit('https://example.cypress.io/commands/spies-stubs-clocks');
        cy.get('#tick-div').click()
            .should('have.text', '1489449600');
        cy.tick(10000); // 10 seconds passed
        cy.get('#tick-div').click()
            .should('have.text', '1489449610');
    });
});
