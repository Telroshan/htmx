describe('hx-error-swap attribute', function() {
  beforeEach(function() {
    const server = makeServer()
    this.server = server
    clearWorkArea()
    this.server.respondWithRandomError = function(method, url, html) {
      server.respondWith(method, url, function(xhr) {
        // random error code
        const code = 400 + Math.floor(Math.random() * 199)
        xhr.respond(code, {}, html)
      })
    }
  })
  afterEach(function() {
    this.server.restore()
    clearWorkArea()
  })

  it('400 content can be swapped with only hx-error-swap set', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var btn = make('<button hx-get="/test" hx-error-swap="innerHTML">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerText.should.equal('Clicked!')
  })

  it('swap innerHTML properly', function() {
    this.server.respondWithRandomError('GET', '/test', '<a hx-get="/test2">Click Me</a>')
    this.server.respondWith('GET', '/test2', 'Clicked!')

    var div = make('<div hx-get="/test" hx-error-swap="innerHTML"></div>')
    div.click()
    this.server.respond()
    div.innerHTML.should.equal('<a hx-get="/test2">Click Me</a>')
    var a = div.querySelector('a')
    a.click()
    this.server.respond()
    a.innerHTML.should.equal('Clicked!')
  })

  it('swap textContent properly with HTML tags', function() {
    this.server.respondWithRandomError('GET', '/test', '<a id="a1" hx-get="/test2">Click Me</a>')

    var d1 = make('<div id="d1" hx-get="/test" hx-error-swap="textContent"></div>')
    d1.click()
    should.equal(byId('d1'), d1)
    this.server.respond()
    d1.textContent.should.equal('<a id="a1" hx-get="/test2">Click Me</a>')
    should.equal(byId('a1'), null)
  })

  it('swap textContent properly with HTML tags and text', function() {
    this.server.respondWithRandomError('GET', '/test', 'text content <a id="a1" hx-get="/test2">Click Me</a>')

    var d1 = make('<div id="d1" hx-get="/test" hx-error-swap="textContent"></div>')
    d1.click()
    should.equal(byId('d1'), d1)
    this.server.respond()
    d1.textContent.should.equal('text content <a id="a1" hx-get="/test2">Click Me</a>')
    should.equal(byId('a1'), null)
  })

  it('swap textContent ignores OOB swaps', function() {
    this.server.respondWithRandomError('GET', '/test', '<span id="d2" hx-swap-oob="true">hi</span> <a id="a1" hx-get="/test2">Click Me</a>')

    var d1 = make('<div id="d1" hx-get="/test" hx-error-swap="textContent"></div>')
    var d2 = make('<div id="d2">some text</div>')
    d1.click()
    should.equal(byId('d1'), d1)
    should.equal(byId('d2'), d2)
    this.server.respond()
    d1.textContent.should.equal('<span id="d2" hx-swap-oob="true">hi</span> <a id="a1" hx-get="/test2">Click Me</a>')
    d2.outerHTML.should.equal('<div id="d2">some text</div>')
    should.equal(byId('a1'), null)
  })

  it('swap textContent properly with text', function() {
    this.server.respondWithRandomError('GET', '/test', 'plain text')

    var div = make('<div id="d1" hx-get="/test" hx-error-swap="textContent"></div>')
    div.click()
    should.equal(byId('d1'), div)
    this.server.respond()
    div.textContent.should.equal('plain text')
    should.equal(byId('a1'), null)
  })

  it('swap outerHTML properly', function() {
    this.server.respondWithRandomError('GET', '/test', '<a id="a1" hx-get="/test2">Click Me</a>')
    this.server.respondWith('GET', '/test2', 'Clicked!')

    var div = make('<div id="d1" hx-get="/test" hx-error-swap="outerHTML"></div>')
    div.click()
    should.equal(byId('d1'), div)
    this.server.respond()
    should.equal(byId('d1'), null)
    byId('a1').click()
    this.server.respond()
    byId('a1').innerHTML.should.equal('Clicked!')
  })

  it('error-swap beforebegin properly', function() {
    var i = 0
    this.server.respondWith('GET', '/test', function(xhr) {
      i++
      xhr.respond(400, {}, '<a id="a' + i + '" hx-get="/test2" hx-error-swap="innerHTML">' + i + '</a>')
    })
    this.server.respondWithRandomError('GET', '/test2', '*')

    var div = make('<div hx-get="/test" hx-swap="outerHTML" hx-error-swap="beforebegin">*</div>')
    var parent = div.parentElement
    div.click()
    this.server.respond()
    div.innerText.should.equal('*')
    removeWhiteSpace(parent.innerText).should.equal('1*')

    byId('a1').click()
    this.server.respond()
    removeWhiteSpace(parent.innerText).should.equal('**')

    div.click()
    this.server.respond()
    div.innerText.should.equal('*')
    removeWhiteSpace(parent.innerText).should.equal('*2*')

    byId('a2').click()
    this.server.respond()
    removeWhiteSpace(parent.innerText).should.equal('***')
  })

  it('error-swap afterbegin properly', function() {
    var i = 0
    this.server.respondWith('GET', '/test', function(xhr) {
      i++
      xhr.respond(435, {}, '' + i)
    })

    var div = make('<div hx-get="/test" hx-error-swap="afterbegin">*</div>')

    div.click()
    this.server.respond()
    div.innerText.should.equal('1*')

    div.click()
    this.server.respond()
    div.innerText.should.equal('21*')

    div.click()
    this.server.respond()
    div.innerText.should.equal('321*')
  })

  it('error-swap afterbegin properly with no initial content', function() {
    var i = 0
    this.server.respondWith('GET', '/test', function(xhr) {
      i++
      xhr.respond(523, {}, '' + i)
    })

    var div = make('<div hx-get="/test" hx-swap="outerHTML" hx-error-swap="afterbegin"></div>')

    div.click()
    this.server.respond()
    div.innerText.should.equal('1')

    div.click()
    this.server.respond()
    div.innerText.should.equal('21')

    div.click()
    this.server.respond()
    div.innerText.should.equal('321')
  })

  it('error-swap afterend properly', function() {
    var i = 0
    this.server.respondWith('GET', '/test', function(xhr) {
      i++
      xhr.respond(404, {}, '<a id="a' + i + '" hx-get="/test2" hx-error-swap="innerHTML">' + i + '</a>')
    })
    this.server.respondWith('GET', '/test2', '*')

    var div = make('<div hx-get="/test" hx-error-swap="afterend">*</div>')
    var parent = div.parentElement
    div.click()
    this.server.respond()
    div.innerText.should.equal('*')
    removeWhiteSpace(parent.innerText).should.equal('*1')

    byId('a1').click()
    this.server.respond()
    removeWhiteSpace(parent.innerText).should.equal('**')

    div.click()
    this.server.respond()
    div.innerText.should.equal('*')
    removeWhiteSpace(parent.innerText).should.equal('*2*')

    byId('a2').click()
    this.server.respond()
    removeWhiteSpace(parent.innerText).should.equal('***')
  })

  it('handles beforeend properly', function() {
    var i = 0
    this.server.respondWith('GET', '/test', function(xhr) {
      i++
      xhr.respond(478, {}, '' + i)
    })

    var div = make('<div hx-get="/test" hx-error-swap="beforeend">*</div>')

    div.click()
    this.server.respond()
    div.innerText.should.equal('*1')

    div.click()
    this.server.respond()
    div.innerText.should.equal('*12')

    div.click()
    this.server.respond()
    div.innerText.should.equal('*123')
  })

  it('handles beforeend properly with no initial content', function() {
    var i = 0
    this.server.respondWith('GET', '/test', function(xhr) {
      i++
      xhr.respond(523, {}, '' + i)
    })

    var div = make('<div hx-get="/test" hx-error-swap="beforeend"></div>')

    div.click()
    this.server.respond()
    div.innerText.should.equal('1')

    div.click()
    this.server.respond()
    div.innerText.should.equal('12')

    div.click()
    this.server.respond()
    div.innerText.should.equal('123')
  })

  it('properly parses various swap specifications', function() {
    var swapSpec = (elt) => htmx._('getSwapSpecification')(elt, elt.getAttribute('hx-error-swap')) // internal function for swap spec
    swapSpec(make('<div/>')).swapStyle.should.equal('innerHTML')
    swapSpec(make("<div hx-error-swap='innerHTML'/>")).swapStyle.should.equal('innerHTML')
    swapSpec(make("<div hx-error-swap='innerHTML'/>")).swapDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML'/>")).settleDelay.should.equal(0) // set to 0 in tests
    swapSpec(make("<div hx-error-swap='innerHTML swap:10'/>")).swapDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='innerHTML swap:0'/>")).swapDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML swap:0ms'/>")).swapDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML settle:10'/>")).settleDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='innerHTML settle:0'/>")).settleDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML settle:0s'/>")).settleDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML swap:10 settle:11'/>")).swapDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='innerHTML swap:10 settle:11'/>")).settleDelay.should.equal(11)
    swapSpec(make("<div hx-error-swap='innerHTML settle:11 swap:10'/>")).swapDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='innerHTML settle:11 swap:10'/>")).settleDelay.should.equal(11)
    swapSpec(make("<div hx-error-swap='innerHTML settle:0 swap:0'/>")).settleDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML settle:0 swap:0'/>")).settleDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML settle:0s swap:0ms'/>")).settleDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML settle:0s swap:0ms'/>")).settleDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='innerHTML nonsense settle:11 swap:10'/>")).settleDelay.should.equal(11)
    swapSpec(make("<div hx-error-swap='innerHTML   nonsense   settle:11   swap:10  '/>")).settleDelay.should.equal(11)

    swapSpec(make("<div hx-error-swap='swap:10'/>")).swapStyle.should.equal('innerHTML')
    swapSpec(make("<div hx-error-swap='swap:10'/>")).swapDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='swap:0'/>")).swapDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='swap:0s'/>")).swapDelay.should.equal(0)

    swapSpec(make("<div hx-error-swap='settle:10'/>")).swapStyle.should.equal('innerHTML')
    swapSpec(make("<div hx-error-swap='settle:10'/>")).settleDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='settle:0'/>")).settleDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='settle:0s'/>")).settleDelay.should.equal(0)

    swapSpec(make("<div hx-error-swap='swap:10 settle:11'/>")).swapStyle.should.equal('innerHTML')
    swapSpec(make("<div hx-error-swap='swap:10 settle:11'/>")).swapDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='swap:10 settle:11'/>")).settleDelay.should.equal(11)
    swapSpec(make("<div hx-error-swap='swap:0s settle:0'/>")).swapDelay.should.equal(0)
    swapSpec(make("<div hx-error-swap='swap:0s settle:0'/>")).settleDelay.should.equal(0)

    swapSpec(make("<div hx-error-swap='settle:11 swap:10'/>")).swapStyle.should.equal('innerHTML')
    swapSpec(make("<div hx-error-swap='settle:11 swap:10'/>")).swapDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='settle:11 swap:10'/>")).settleDelay.should.equal(11)
    swapSpec(make("<div hx-error-swap='settle:0s swap:10'/>")).swapDelay.should.equal(10)
    swapSpec(make("<div hx-error-swap='settle:0s swap:10'/>")).settleDelay.should.equal(0)

    swapSpec(make("<div hx-error-swap='customstyle settle:11 swap:10'/>")).swapStyle.should.equal('customstyle')
  })

  it('works with a swap delay', function(done) {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div = make("<div hx-get='/test' hx-error-swap='innerHTML swap:10ms'></div>")
    div.click()
    this.server.respond()
    div.innerText.should.equal('')
    setTimeout(function() {
      div.innerText.should.equal('Clicked!')
      done()
    }, 30)
  })

  it('works immediately with no swap delay', function(done) {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div = make(
      "<div hx-get='/test' hx-error-swap='innerHTML swap:0ms'></div>"
    )
    div.click()
    this.server.respond()
    div.innerText.should.equal('Clicked!')
    done()
  })

  it('works with a settle delay', function(done) {
    this.server.respondWithRandomError('GET', '/test', "<div id='d1' class='foo' hx-get='/test' hx-error-swap='outerHTML settle:10ms'></div>")
    var div = make("<div id='d1' hx-get='/test' hx-error-swap='outerHTML settle:10ms'></div>")
    div.click()
    this.server.respond()
    div.classList.contains('foo').should.equal(false)
    setTimeout(function() {
      byId('d1').classList.contains('foo').should.equal(true)
      done()
    }, 30)
  })

  it('works with no settle delay', function(done) {
    this.server.respondWithRandomError(
      'GET',
      '/test',
      "<div id='d1' class='foo' hx-get='/test' hx-error-swap='outerHTML settle:0ms'></div>"
    )
    var div = make(
      "<div id='d1' hx-get='/test' hx-error-swap='outerHTML settle:0ms'></div>"
    )
    div.click()
    this.server.respond()
    div.classList.contains('foo').should.equal(false)
    setTimeout(function() {
      byId('d1').classList.contains('foo').should.equal(true)
      done()
    }, 30)
  })

  it('error-swap outerHTML properly  w/ data-* prefix', function() {
    this.server.respondWithRandomError('GET', '/test', '<a id="a1" data-hx-get="/test2">Click Me</a>')
    this.server.respondWith('GET', '/test2', 'Clicked!')

    var div = make('<div id="d1" data-hx-get="/test" data-hx-error-swap="outerHTML"></div>')
    div.click()
    should.equal(byId('d1'), div)
    this.server.respond()
    should.equal(byId('d1'), null)
    byId('a1').click()
    this.server.respond()
    byId('a1').innerHTML.should.equal('Clicked!')
  })

  it('error-swap none works properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Ooops, swapped')

    var div = make('<div hx-error-swap="none" hx-get="/test">Foo</div>')
    div.click()
    this.server.respond()
    div.innerHTML.should.equal('Foo')
  })

  it('error-swap outerHTML does not trigger htmx:afterSwap on original element', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')
    var div = make('<div id="d1" hx-get="/test" hx-error-swap="outerHTML"></div>')
    div.addEventListener('htmx:afterSwap', function() {
      count++
    })
    div.click()
    var count = 0
    should.equal(byId('d1'), div)
    this.server.respond()
    should.equal(byId('d1'), null)
    count.should.equal(0)
  })
  it('error-swap delete works properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Oops, deleted!')

    var div = make('<div id="d1" hx-error-swap="delete" hx-get="/test">Foo</div>')
    div.click()
    this.server.respond()
    should.equal(byId('d1'), null)
  })

  it('in presence of bad swap spec, it uses the default swap strategy', function() {
    var initialSwapStyle = htmx.config.defaultErrorSwapStyle
    htmx.config.defaultErrorSwapStyle = 'outerHTML'
    try {
      this.server.respondWithRandomError('GET', '/test', 'Clicked!')

      var div = make('<div><button id="b1" hx-error-swap="foo" hx-get="/test">Initial</button></div>')
      var b1 = byId('b1')
      b1.click()
      this.server.respond()
      div.innerHTML.should.equal('Clicked!')
    } finally {
      htmx.config.defaultErrorSwapStyle = initialSwapStyle
    }
  })

  it('hx-swap ignoreTitle works', function() {
    window.document.title = 'Test Title'
    this.server.respondWith('GET', '/test', function(xhr) {
      xhr.respond(432, {}, "<title class=''>htmx rocks!</title>Clicked!")
    })
    var btn = make('<button hx-get="/test" hx-error-swap="innerHTML ignoreTitle:true">Click Me!</button>')
    btn.click()
    this.server.respond()
    btn.innerText.should.equal('Clicked!')
    window.document.title.should.equal('Test Title')
  })

  it('error-swap mirror with swap outerHTML works properly', function() {
    this.server.respondWithRandomError('GET', '/test', '<a id="a1" hx-get="/test2">Click Me</a>')
    this.server.respondWith('GET', '/test2', 'Clicked!')

    var div = make('<div id="d1" hx-get="/test" hx-swap="outerHTML" hx-error-swap="mirror"></div>')
    div.click()
    should.equal(byId('d1'), div)
    this.server.respond()
    should.equal(byId('d1'), null)
    byId('a1').click()
    this.server.respond()
    byId('a1').innerHTML.should.equal('Clicked!')
  })

  it('error-swap mirror with swap delete works properly', function() {
    this.server.respondWithRandomError('GET', '/test', 'Oops, deleted!')

    var div = make('<div id="d1" hx-swap="delete" hx-error-swap="mirror" hx-get="/test">Foo</div>')
    div.click()
    this.server.respond()
    should.equal(byId('d1'), null)
  })

  it('error-swap works properly along different hx-swap', function() {
    this.server.respondWithRandomError('GET', '/test', '<a id="a1" hx-swap="delete" hx-error-swap="innerHTML" hx-get="/test2">Click Me</a>')
    this.server.respondWithRandomError('GET', '/test2', 'Clicked!')

    var div = make('<div id="d1" hx-get="/test" hx-swap="innerHTML" hx-error-swap="outerHTML"></div>')
    div.click()
    should.equal(byId('d1'), div)
    this.server.respond()
    should.equal(byId('d1'), null)
    byId('a1').click()
    this.server.respond()
    byId('a1').innerHTML.should.equal('Clicked!')
  })

  it('"mirror" error-swap strategy works properly along default swap strategy', function() {
    this.server.respondWithRandomError('GET', '/test', 'Clicked!')

    var div = make('<div hx-error-swap="mirror" hx-get="/test">Initial</div>')
    div.click()
    this.server.respond()
    div.innerHTML.should.equal('Clicked!')
  })

  it('default error swap style correctly overrides hx-swap', function() {
    var initialSwapStyle = htmx.config.defaultErrorSwapStyle
    htmx.config.defaultErrorSwapStyle = 'innerHTML'
    var initialTarget = htmx.config.defaultErrorTarget
    htmx.config.defaultErrorTarget = '#errorContainer'
    try {
      this.server.respondWithRandomError('GET', '/test', 'Error!')

      var div = make('<div><button id="b1" hx-get="/test" hx-target="this" hx-swap="outerHTML">Initial</button></div>')
      var b1 = byId('b1')
      var errorContainer = make('<div id="errorContainer"></div>')
      b1.click()
      this.server.respond()

      div.nextElementSibling.should.equal(errorContainer)
      div.firstElementChild.should.equal(b1)
      errorContainer.innerHTML.should.equal('Error!')
    } finally {
      htmx.config.defaultErrorSwapStyle = initialSwapStyle
      htmx.config.defaultErrorTarget = initialTarget
    }
  })
})
