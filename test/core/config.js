describe('htmx config test', function() {
  beforeEach(function() {
    this.server = makeServer()
    clearWorkArea()
  })

  afterEach(function() {
    this.server.restore()
    clearWorkArea()
  })

  it('swaps normally with no config update', function() {
    var responseCode = null
    this.server.respondWith('GET', '/test', function(xhr, id) {
      xhr.respond(responseCode, { 'Content-Type': 'text/html' }, '' + responseCode)
    })

    responseCode = 200 // 200 should cause a swap by default
    var btn = make('<button hx-get="/test">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerHTML.should.equal('200')

    responseCode = 204 // 204 should not cause a swap by default
    var btn = make('<button hx-get="/test">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerHTML.should.equal('Click Me!')

    responseCode = 300 // 300 should cause a swap by default
    var btn = make('<button hx-get="/test">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerHTML.should.equal('300')

    responseCode = 400 // 400 should not cause a swap by default
    var btn = make('<button hx-get="/test">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerHTML.should.equal('Click Me!')

    responseCode = 500 // 500 should not cause a swap by default
    var btn = make('<button hx-get="/test">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerHTML.should.equal('Click Me!')
  })
})
