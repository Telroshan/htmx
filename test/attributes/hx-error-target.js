describe('hx-error-target attribute', function() {
  var initialErrorSwapStyle = htmx.config.defaultErrorSwapStyle
  beforeEach(function() {
    this.server = sinon.fakeServer.create()
    var server = this.server
    this.server.respondWithRandomError = function(method, url, html) {
      server.respondWith(method, url, function(xhr) {
        // random error code
        var code = 400 + Math.floor(Math.random() * 199)
        xhr.respond(code, {}, html)
      })
    }
    clearWorkArea()
    htmx.config.defaultErrorSwapStyle = 'innerHTML'
  })
  afterEach(function() {
    htmx.config.defaultErrorSwapStyle = initialErrorSwapStyle
    this.server.restore()
    clearWorkArea()
  })

  it('targets an adjacent element properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var btn = make('<button hx-error-target="#d1" hx-get="/test">Click Me!</button>')
    var div1 = make('<div id="d1"></div>')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('targets a parent element properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div1 = make('<div id="d1"><button id="b1" hx-error-target="#d1" hx-get="/test">Click Me!</button></div>')
    var btn = byId('b1')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('targets a `this` element properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div1 = make('<div hx-error-target="this"><button id="b1" hx-get="/test">Click Me!</button></div>')
    var btn = byId('b1')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('targets a `closest` element properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div1 = make('<div><p><i><button id="b1" hx-error-target="closest div" hx-get="/test">Click Me!</button></i></p></div>')
    var btn = byId('b1')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('targets a `closest` element properly w/ hyperscript syntax', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div1 = make('<div><p><i><button id="b1" hx-error-target="closest <div/>" hx-get="/test">Click Me!</button></i></p></div>')
    var btn = byId('b1')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('targets a `find` element properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div1 = make('<div hx-error-target="find span" hx-get="/test">Click Me! <div><span id="s1"></span><span id="s2"></span></div></div>')
    div1.click()
    this.server.respond()
    var span1 = byId('s1')
    var span2 = byId('s2')
    span1.innerHTML.should.equal('Clicked!')
    span2.innerHTML.should.equal('')
  })

  it('targets a `find` element properly w/ hyperscript syntax', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div1 = make('<div hx-error-target="find <span/>" hx-get="/test">Click Me! <div><span id="s1"></span><span id="s2"></span></div></div>')
    div1.click()
    this.server.respond()
    var span1 = byId('s1')
    var span2 = byId('s2')
    span1.innerHTML.should.equal('Clicked!')
    span2.innerHTML.should.equal('')
  })

  it('targets an inner element properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var btn = make('<button hx-error-target="#d1" hx-get="/test">Click Me!<div id="d1"></div></button>')
    var div1 = byId('d1')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('targets an inner element properly w/ hyperscript syntax', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var btn = make('<button hx-error-target="<#d1/>" hx-get="/test">Click Me!<div id="d1"></div></button>')
    var div1 = byId('d1')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('handles bad target gracefully', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var btn = make('<button hx-error-target="bad" hx-get="/test">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerHTML.should.equal('Click Me!')
  })

  it('targets an adjacent element properly w/ data-* prefix', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var btn = make('<button data-hx-error-target="#d1" data-hx-get="/test">Click Me!</button>')
    var div1 = make('<div id="d1"></div>')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('targets a `next` element properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    make('<div>' +
      '  <div id="d3"></div>' +
      '  <button id="b1" hx-error-target="next div" hx-get="/test">Click Me!</button>' +
      '  <div id="d1"></div>' +
      '  <div id="d2"></div>' +
      '</div>')
    var btn = byId('b1')
    var div1 = byId('d1')
    var div2 = byId('d2')
    var div3 = byId('d3')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
    div2.innerHTML.should.equal('')
    div3.innerHTML.should.equal('')
  })

  it('targets a `next` element properly w/ hyperscript syntax', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    make('<div>' +
      '  <div id="d3"></div>' +
      '  <button id="b1" hx-error-target="next <div/>" hx-get="/test">Click Me!</button>' +
      '  <div id="d1"></div>' +
      '  <div id="d2"></div>' +
      '</div>')
    var btn = byId('b1')
    var div1 = byId('d1')
    var div2 = byId('d2')
    var div3 = byId('d3')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
    div2.innerHTML.should.equal('')
    div3.innerHTML.should.equal('')
  })

  it('targets a `previous` element properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    make('<div>' +
      '  <div id="d3"></div>' +
      '  <button id="b1" hx-error-target="previous div" hx-get="/test">Click Me!</button>' +
      '  <div id="d1"></div>' +
      '  <div id="d2"></div>' +
      '</div>')
    var btn = byId('b1')
    var div1 = byId('d1')
    var div2 = byId('d2')
    var div3 = byId('d3')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('')
    div2.innerHTML.should.equal('')
    div3.innerHTML.should.equal('Clicked!')
  })

  it('targets a `previous` element properly w/ hyperscript syntax', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    make('<div>' +
      '  <div id="d3"></div>' +
      '  <button id="b1" hx-error-target="previous <div/>" hx-get="/test">Click Me!</button>' +
      '  <div id="d1"></div>' +
      '  <div id="d2"></div>' +
      '</div>')
    var btn = byId('b1')
    var div1 = byId('d1')
    var div2 = byId('d2')
    var div3 = byId('d3')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('')
    div2.innerHTML.should.equal('')
    div3.innerHTML.should.equal('Clicked!')
  })

  it('targets a `next` element properly without selector', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    make('<div>' +
      '  <div id="d3"></div>' +
      '  <button id="b1" hx-error-target="next" hx-get="/test">Click Me!</button>' +
      '  <div id="d1"></div>' +
      '  <div id="d2"></div>' +
      '</div>')
    var btn = byId('b1')
    var div1 = byId('d1')
    var div2 = byId('d2')
    var div3 = byId('d3')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
    div2.innerHTML.should.equal('')
    div3.innerHTML.should.equal('')
  })

  it('targets a `previous` element properly without selector', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    make('<div>' +
      '  <div id="d3"></div>' +
      '  <button id="b1" hx-error-target="previous" hx-get="/test">Click Me!</button>' +
      '  <div id="d1"></div>' +
      '  <div id="d2"></div>' +
      '</div>')
    var btn = byId('b1')
    var div1 = byId('d1')
    var div2 = byId('d2')
    var div3 = byId('d3')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('')
    div2.innerHTML.should.equal('')
    div3.innerHTML.should.equal('Clicked!')
  })

  it('"mirror" works properly along hx-target', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var btn = make('<button hx-target="#d1" hx-error-target="mirror" hx-get="/test">Click Me!</button>')
    var div1 = make('<div id="d1"></div>')
    btn.click()
    this.server.respond()
    div1.innerHTML.should.equal('Clicked!')
  })

  it('"mirror" works properly along default target', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var btn = make('<button hx-error-target="mirror" hx-get="/test">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerHTML.should.equal('Clicked!')
  })
})
