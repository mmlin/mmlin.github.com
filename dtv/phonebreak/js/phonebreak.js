$.widget('mike.phonebreak', {
  
  charMap: {
    'A': 2, 'B': 2, 'C': 2, 'D': 3, 'E': 3, 'F': 3, 'G': 4, 'H': 4, 'I': 4,
    'J': 5, 'K': 5, 'L': 5, 'M': 6, 'N': 6, 'O': 6, 'P': 7, 'Q': 7, 'R': 7,
    'S': 7, 'T': 8, 'U': 8, 'V': 8, 'W': 9, 'X': 9, 'Y': 9, 'Z': 9
  },
  
  options: {
    submit: null,
    url: null,
    clientSide: false
  },
  
  _create: function() {
    this.element.addClass('mike-phonebreak');
    
    // Add the title.
    this.header = $('<h2>', {
      'class': 'title',
      text: 'Phonebreak'
    })
    .appendTo(this.element);
    
    // Add the title.
    this.description = $('<p>', {
      'class': 'description',
      text: 'Break a phone number into its parts.'
    })
    .appendTo(this.element);
    
    // Add the input field.
    this.field = $('<input>', {
      'class': 'field',
      type: 'text'
    })
    .appendTo(this.element);
    
    // Add the button.
    this.button = $('<input>', {
      'class': 'submit',
      type: 'button',
      value: 'Go'
    })
    .appendTo(this.element);
    
    // Attach the button handler.
    this._on(this.button, {
      click: "go"
    });
    
    // Pressing enter is the same clicking 'Go'.
    this._on(this.field, {
      keypress: 'enter'
    });
  },
  
  go: function() {
    var clientSide, raw, submit, url;
    
    submit = this.options.submit;
    if (typeof submit == 'function') {
      
      // If this is marked for client-side processing only,
      // then don't even bother with the AJAX request.
      clientSide = this.options.clientSide;
      if (clientSide) {
        raw = this.field.val();
        return submit(this.parse(raw));
      }
    
      // The AJAX request.
      url = this.options.url;
      if (url) {
        raw = this.field.val();
        $.getJSON(url, {
          phone: raw,
          
          // For testing, ensure response isn't cached.
          t: new Date().getTime()
        }, submit);
      }
    }
  },
  
  enter: function(e) {
    if (e.keyCode == 13) this.go();
  },
  
  parse: function(val) {
    var parts, result, stripped;
    
    result = { raw: val, success: false };

    // Standardize input--strip useless chars, convert alpha to numeric.
    stripped = val.toUpperCase().replace(/[^0-9A-Z]/g, '');
    for (var c in this.charMap) {
      stripped = stripped.replace(new RegExp(c, 'g'), this.charMap[c]);
    }

    // Extract the parts, if possible.
    parts = stripped.match(/^1?([2-9]\d\d)([2-9]\d\d)(\d{4})$/);
    if (parts) {
      result.success = true;
      result.full_number = parts[1] + parts[2] + parts[3];
      result.area_code = parts[1];
      result.prefix = parts[2];
      result.line_number = parts[3];
      result.formatted = '(' + parts[1] + ') ' + parts[2] + '-' + parts[3];
    } else {
      result.error = 'Not a valid phone number';
    }
    
    return result;
  },
  
  setField: function(s) {
    this.field.val(s);
  },
  
  _destroy: function() {
    // Remove generated elements.
    this.header.remove();
    this.description.remove();
    this.field.remove();
    this.button.remove();
    
    this.element.removeClass('mike-phonebreak');
  }
  
});