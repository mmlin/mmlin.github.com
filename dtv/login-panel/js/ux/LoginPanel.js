/**
 * A reusable login panel. Use it like this:
 *
	$('.my-placeholder').loginpanel({
		url: '/my/callback/url/',
		success: function() {...};
		failure: function(err) {...};
	});
 *
 * It expects the URL to return this for a success:
 *
 	{
		"success": true
 	}
 *
 * And this for a failure:
 *
 	{
		"success": false,
 		"errormsg": "The flux capacitor is on the fritz."
 	}
 *
 * Don't forget to include LoginPanel.css for the default styling.
 *
 */

(function() {

	var DEFAULT_ERR = 'The username or password was entered incorrectly.';

	$.widget('ux.loginpanel', {
		options: {
			success: null,
			failure: null,
			url: null
		},

		_create: function() {
			var $inputs, el, markup;

			el = this.element;
			markup = [
				"<div class='err'></div>",
				"<label for='username'>Username</label><input id='username' type='text'>",
				"<label for='password'>Password</label><input id='password' type='password'>",
				"<div class='submit'><input type='submit' value='Log In'></div>"
			];

			// Add the markup.
			el.addClass('ux-login-panel');
			el.html(markup.join(''));

			// Event handlers should always be called in this context.
			this.enter = $.proxy(this.enter, this);
			this.submit = $.proxy(this.submit, this);
			this.ajaxSuccess = $.proxy(this.ajaxSuccess, this);
			this.ajaxError = $.proxy(this.ajaxError, this);

			// Cache important elements.
			$inputs = el.find('> input');
			this.$username = $($inputs[0]);
			this.$password = $($inputs[1]);
			this.$err = this.element.find('.err');

			// Bind the event handlers.
			$inputs.keypress(this.enter);
			el.find('.submit input').click(this.submit);
		},

		enter: function(e) {
			if (e.keyCode != 13)
				return;
			this.submit();
		},

		submit: function() {
			var $fields, data, username, password;

			username = this.$username.val();
			password = this.$password.val();

			this.$err.hide();
			if (!this.valid(username, password))
				return this.doFailure();

			if (typeof this.options.url == 'string') {
				data = { username: username, password: password};
				$.getJSON(this.options.url, data, this.ajaxSuccess)
					.error(this.ajaxError);
			}
		},

		valid: function(username, password) {
			// Username can only contain letters, numbers, underscore, or dot.
			if (!/^\s*[\w.]+\s*$/.test(username))
				return false;

			// Password can contain anything, but must be at least 6 chars.
			if (password.length < 6)
				return false;

			return true;
		},

		ajaxSuccess: function(data) {
			if (data && data.success)
				return this.doSuccess();
			else
				return this.doFailure(data && data.errmsg);
		},

		ajaxError: function(jqXHR, textStatus, errorThrown) {
			var errmsg = 'A system error has occurred';
			if (textStatus) {
				if (textStatus == 'error')
					textStatus += ' / ' + errorThrown;
				errmsg += ': ' + textStatus;
			}
			this.doFailure(errmsg);
		},

		doSuccess: function() {
			if (typeof this.options.success == 'function')
				this.options.success();
		},

		doFailure: function(errmsg) {
			errmsg = errmsg || DEFAULT_ERR;
			this.$err.text(errmsg).fadeIn();
			this.element.effect('shake', {distance: 5});
			if (typeof this.options.failure == 'function')
				this.options.failure(errmsg);
		}
	});

}).call(this);