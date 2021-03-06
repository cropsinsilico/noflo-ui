describe('Editing a graph', function() {
  let win = null;
  let doc = null;
  let ui = null;
  let editor = null;
  let graph = null;
  before(function() {
    const iframe = document.getElementById('app');
    win = iframe.contentWindow;
    return doc = iframe.contentDocument;
  });

  describe('initially', function() {
    it('should have a graph editor available', function() {
      ui = doc.querySelector('noflo-ui');
      editor = doc.querySelector('the-graph-editor');
      chai.expect(editor).to.exist;
      graph = doc.querySelector('the-graph-editor the-graph');
      return chai.expect(graph).to.exist;
    });
    it('should have no nodes in the graph editor', function() {
      const nodes = doc.querySelectorAll('the-graph g.nodes g.node');
      return chai.expect(nodes.length).to.equal(0);
    });
  });

  describe.skip('help screen', function() {
    let help = null;
    it('should be visible initially', function() {
      help = doc.querySelector('noflo-help');
      chai.expect(help).to.exist;
      return chai.expect(help.visible).to.equal(true);
    });
    it('should go away after a click', function(done) {
      syn.click(help);
      return setTimeout(function() {
        chai.expect(help.visible).to.equal(false);
        return done();
      }
      , 1);
    });
  });

  describe('runtime', function() {
    let runtime = null;
    it('should be available as an element', () => runtime = doc.querySelector('noflo-runtime'));
    it('should have the IFRAME runtime selected', () => chai.expect(runtime.runtime).to.be.an('object'));
    it('should connect automatically to the IFRAME provider', function(done) {
      this.timeout(45000);
      if (runtime.online) {
        chai.expect(runtime.online).to.equal(true);
        done();
        return;
      }

      return runtime.runtime.on('status', function(status) {
        if (!status.online) { return; }
        chai.expect(runtime.online).to.equal(true);
        return done();
      });
    });
  });

  describe('component search', function() {
    let search = null;
    it('should initially show the breadcrumb', function() {
      search = doc.querySelector('noflo-search');
      chai.expect(search).to.exist;
      return chai.expect(search.classList.contains('overlay')).to.equal(true);
    });
    it('when clicked it should show the search input', function(done) {
      this.timeout(10000);
      const breadcrumb = doc.querySelector('noflo-search #breadcrumb');
      chai.expect(breadcrumb).to.exist;
      return setTimeout(function() {
        syn.click(breadcrumb);
        return setTimeout(function() {
          chai.expect(search.classList.contains('overlay')).to.equal(false);
          return done();
        }
        , 500);
      }
      , 5000);
    });
    it('should initially show results', function(done) {
      this.timeout(30000);
      if (search.searchLibraryResults.length) {
        chai.expect(search.searchLibraryResults.length).to.be.above(10);
        done();
        return;
      }

      var checkResults = function() {
        if (search.searchLibraryResults && (search.searchLibraryResults.length > 20)) {
          chai.expect(search.searchLibraryResults.length).to.be.above(10);
          return done();
        }
        return setTimeout(checkResults, 1000);
      };
      return setTimeout(checkResults, 1000);
    });
    it('should narrow them down when something is written', function(done) {
      this.timeout(10000);
      const input = doc.querySelector('noflo-search #search');
      syn.click(input)
      .type('GetEle');

      var checkResults = function() {
        if (search.searchLibraryResults && (search.searchLibraryResults.length === 1)) {
          chai.expect(search.searchLibraryResults.length).to.equal(1);
          return done();
        }
        return setTimeout(checkResults, 1000);
      };
      return setTimeout(checkResults, 1000);
    });
    it('should add a node when result is clicked', function(done) {
      this.timeout(7000);
      const context = doc.querySelector('noflo-context');
      chai.expect(context).to.exist;
      const results = doc.querySelector('noflo-context noflo-search-library-results');
      chai.expect(results).to.exist;
      return setTimeout(function() {
        const getelement = doc.querySelector('noflo-search-library-results li');
        chai.expect(getelement).to.exist;
        syn.click(getelement);
        return setTimeout(function() {
          const nodes = doc.querySelectorAll('the-graph g.nodes g.node');
          chai.expect(nodes.length).to.equal(1);
          return done();
        }
        , 3000);
      }
      , 10);
    });
  });
});
