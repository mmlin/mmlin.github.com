describe('Phonebreak.js', function() {
  
  var $widget;
  
  before(function(done) {
    $(function() {
      $widget = $('<div>', { id: 'my-widget' }).appendTo(document.body);
      $widget.phonebreak();
      done();
    });
  });
  
  describe('Server-side option', function() {
    it('Should relay success', function(done) {
      $widget.phonebreak('option', 'url', 'data/800-DIRECTV.json');
      $widget.phonebreak('option', 'submit', function(result) {
        assert(result.success === true);
        assert(result.raw == '1-800-DIRECTV');
        assert(result.formatted == '(800) 347-3288');
        assert(result.area_code == '800');
        assert(result.prefix == '347');
        assert(result.line_number == '3288');
        assert(typeof result.error == 'undefined');
        done();
      });
      $widget.phonebreak('go');
    });
    
    it('Should relay failure', function(done) {
      $widget.phonebreak('option', 'url', 'data/error-invalid.json');
      $widget.phonebreak('option', 'submit', function(result) {
        assert(result.success === false);
        assert(result.raw == '510-415-523');
        assert(typeof result.formatted == 'undefined');
        assert(typeof result.area_code == 'undefined');
        assert(typeof result.prefix == 'undefined');
        assert(typeof result.line_number == 'undefined');
        assert(result.error == 'Not a valid phone number');
        done();
      });
      $widget.phonebreak('go');
    });
  });
  
  function parseTest(entered, expected) {
    return function(done) {
      var key;
      
      $widget.phonebreak('option', 'clientSide', true);
      $widget.phonebreak('setField', entered);
      $widget.phonebreak('option', 'submit', function(result) {
        // Check that `result` is as `expected`.
        for (key in result) assert(result[key] === expected[key]);
        for (key in expected) assert(expected[key] === result[key]);
        done();
      });
      $widget.phonebreak('go');
    }
  }
  
  describe('Client-side option', function() {
    it('Should override URL option', function(done) {
      $widget.phonebreak('option', 'url', 'data/error-invalid.json');
      $widget.phonebreak('option', 'clientSide', true);
      $widget.phonebreak('setField', '5104155235');
      $widget.phonebreak('option', 'submit', function(result) {
        assert(result.formatted == '(510) 415-5235');
        assert(result.prefix == '415');
        assert(result.prefix == '415');
        done();
      });
      $widget.phonebreak('go');
      
    });
    
    it('Should parse 10 digits', parseTest('5104155235', {
      success: true,
      raw: '5104155235',
      full_number: '5104155235',
      formatted: '(510) 415-5235',
      area_code: '510',
      prefix: '415',
      line_number: '5235'
    }));
    
    it('Should parse "1" plus 10 digits', parseTest('15104155235', {
      success: true,
      raw: '15104155235',
      full_number: '5104155235',
      formatted: '(510) 415-5235',
      area_code: '510',
      prefix: '415',
      line_number: '5235'
    }));
    
    it('Should ignore invalid characters', parseTest('  1^51-==-0415  5235 ', {
      success: true,
      raw: '  1^51-==-0415  5235 ',
      full_number: '5104155235',
      formatted: '(510) 415-5235',
      area_code: '510',
      prefix: '415',
      line_number: '5235'
    }));
    
    it('Should translate alpha characters', parseTest('1-800-DIRECTV', {
      success: true,
      raw: '1-800-DIRECTV',
      full_number: '8003473288',
      formatted: '(800) 347-3288',
      area_code: '800',
      prefix: '347',
      line_number: '3288'
    }));
    
    it('Should fail for less than 10 digits', parseTest('510415523', {
      success: false,
      raw: '510415523',
      error: 'Not a valid phone number'
    }));
    
    it('Should fail if area code is less than 200', parseTest('1104155235', {
      success: false,
      raw: '1104155235',
      error: 'Not a valid phone number'
    }));
    
    it('Should fail if prefix is less than 200', parseTest('5101155235', {
      success: false,
      raw: '5101155235',
      error: 'Not a valid phone number'
    }));
  });
  
  after(function() {
    $widget.phonebreak('destroy').remove();
  });
});
