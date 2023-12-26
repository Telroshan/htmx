describe("hx-disinherit attribute", function() {

    beforeEach(function () {
        this.server = makeServer();
        clearWorkArea();
    });
    afterEach(function () {
        this.server.restore();
        clearWorkArea();
    });

    it('basic inheritance sanity-check', function () {
        var response = '<div id="snowflake" class="">Hello world</div>'
        this.server.respondWith("GET", "/test", response);

        var div = make('<div hx-target="#cta" hx-swap="outerHTML"><button id="bx1" hx-get="/test"><span id="cta">Click Me!</span></button></div>')
        var btn = byId("bx1");
        btn.click();
        this.server.respond();
        btn.firstChild.id.should.equal("snowflake");
        btn.innerText.should.equal("Hello world");
    })


    it('disinherit exclude single attribute', function () {
        var response = '<div id="snowflake">Hello world</div>'
        this.server.respondWith("GET", "/test", response);

        var div = make('<div hx-target="#cta" hx-swap="beforebegin" hx-disinherit="hx-target"><button id="bx1" hx-get="/test"><span id="cta">Click Me!</span></button></div>')
        var btn = byId("bx1");
        btn.click();
        this.server.respond();
        btn.previousElementSibling.id.should.equal("snowflake")
        btn.childNodes[0].innerText.should.equal("Click Me!")
    });

    it('disinherit exclude multiple attributes', function () {
        var response = '<div id="snowflake">Hello world</div>'
        this.server.respondWith("GET", "/test", response);

        var div = make('<div hx-target="#cta" hx-swap="beforebegin" hx-disinherit="hx-target hx-swap">' +
            '  <button id="bx1" hx-get="/test"><span id="cta">Click Me!</span></button>' +
            '</div>')
        var btn = byId("bx1");
        btn.click();
        this.server.respond();
        btn.firstChild.id.should.equal("snowflake")
    });

    it('disinherit exclude all attributes', function () {
        var response = '<div id="snowflake">Hello world</div>'
        this.server.respondWith("GET", "/test", response);
        var div = make('<div hx-target="#cta" hx-swap="beforebegin" hx-disinherit="*">' +
            '  <button id="bx1" hx-get="/test">' +
            '    <span id="cta">Click Me!</span>' +
            '  </button>' +
            '</div>')
        var btn = byId("bx1");
        btn.click();
        this.server.respond();
        btn.firstChild.id.should.equal("snowflake")
    });

    it('same-element inheritance disable', function () {
        var response = '<div id="snowflake" class="">Hello world</div>'
        this.server.respondWith("GET", "/test", response);

        var btn = make('<button hx-target="#container" hx-trigger="click" hx-get="/test" hx-swap="outerHTML" hx-disinherit="*"><div id="container"></div></button>')
        btn.click();
        this.server.respond();
        btn.firstChild.id.should.equal("snowflake");
        btn.firstChild.innerText.should.equal("Hello world");
    });

    it('same-element inheritance disable with child nodes', function () {
        var response = '<div id="snowflake" class="">Hello world</div>'
        this.server.respondWith("GET", "/test", response);
        this.server.respondWith("GET", "/test2", 'unique-snowflake');

        var div = make('<div hx-target="#container" hx-get="/test" hx-swap="outerHTML" hx-trigger="keyup" hx-disinherit="*"><div id="container"><button id="bx1" hx-get="/test2" hx-trigger="click" hx-target="#target"><div id="target"></div></button></div></div>')
        var btn = byId("bx1");
        btn.click();
        this.server.respond();
        btn.firstChild.id.should.equal('target');
        btn.firstChild.innerText.should.equal('unique-snowflake');
        var count = (div.parentElement.innerHTML.match(/snowflake/g) || []).length;
        count.should.equal(1);
    });
});

