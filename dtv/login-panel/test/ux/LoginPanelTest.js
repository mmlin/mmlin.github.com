(function() {

	var $panel;

	module('LoginPanel.js', {
		setup: function() {
			$panel = $('#login-panel');
			$panel.loginpanel();
		},
	});

	asyncTest('Responds correctly to success response', function() {
		$panel.loginpanel('option', 'url', '../mock/login_success.json');
		$panel.loginpanel('option', 'success', function() {
			ok(true, 'Success callback was triggered');
			ok($panel.find('.err').is(':not(:visible)'), 'Error is not shown');
			start();
		});
		popAndClick($panel, 'mike', 'p4ssw0rd');
	});

	asyncTest('Responds correctly to failure response', function() {
		$panel.loginpanel('option', 'url', '../mock/login_failure.json');
		$panel.loginpanel('option', 'success', null);
		$panel.loginpanel('option', 'failure', function() {
			var $err = $panel.find('.err');
			ok(true, 'Failure callback was triggered');
			ok($err.is(':visible'), 'Error is shown');
			ok($err.text() == 'The shit hit the fan!', 'Error message is relayed from response');
			start();
		});
		popAndClick($panel, 'mike', 'p4ssw0rd');
	});

	asyncTest('Enter from username submits the login request', function() {
		$panel.loginpanel('option', 'url', '../mock/login_success.json');
		$panel.loginpanel('option', 'failure', null);
		$panel.loginpanel('option', 'success', function() {
			ok(true, 'Success callback was triggered');
			start();
		});
		popAndEnter($panel, 'mike', 'p4ssw0rd', 'username');
	});

	asyncTest('Enter from password submits the login request', function() {
		$panel.loginpanel('option', 'url', '../mock/login_success.json');
		$panel.loginpanel('option', 'failure', null);
		$panel.loginpanel('option', 'success', function() {
			ok(true, 'Success callback was triggered');
			start();
		});
		popAndEnter($panel, 'mike', 'p4ssw0rd', 'password');
	});

	// Whitebox testing - the private method `valid`.
	test('Usernames consist of numbers, letters, underscores, and dots', function() {	
		var widget = $panel.data('loginpanel');
		ok(widget.valid('mike', 'p4ssw0rd'), 'A good username and password');
		ok(widget.valid('mike.m.lin', 'p4ssw0rd'), 'Dots are OK');
		ok(widget.valid('mike212', 'p4ssw0rd'), 'Numbers are OK');
		ok(!widget.valid('', 'p4ssw0rd'), 'Username is required');
		ok(!widget.valid('cas$h', 'p4ssw0rd'), 'Special characters not allowed');
		ok(widget.valid(' mike   ', 'p4ssw0rd'), 'Leading and trailing whitespace is ignored');
		ok(!widget.valid(' ', 'p4ssw0rd'), 'All whitespace is still considered empty');
		ok(!widget.valid('汉字/漢字', 'p4ssw0rd'), 'Chinese characters are not OK');
	});

	// Whitebox testing - the private method `valid`.
	test('Passwords must be 6 characters minimum', function() {	
		var widget = $panel.data('loginpanel');
		ok(widget.valid('mike', 'p4ssw0rd'), 'A good username and password');
		ok(!widget.valid('mike', ''), 'Password is required');
		ok(!widget.valid('mike', '2tiny'), 'Password cannot be less than six chars');
		ok(widget.valid('mike', 'okFine'), 'Six chars is OK');
		ok(widget.valid('mike', 'pass word'), 'Spaces are OK');
		ok(widget.valid('mike', '      '), 'All spaces are OK');
	});

	test('Invalid usernames are not even sent to the server', function() {
		$panel.loginpanel('option', 'url', '../mock/login_success.json');
		$panel.loginpanel('option', 'failure', function() {
			ok(true, 'Failure callback is not triggered');
		});
		$panel.loginpanel('option', 'success', function() {
			ok(false, 'Success callback is not triggered');
		});
		popAndClick($panel, 'mike m', 'p4ssw0rd');
		popAndClick($panel, 'i.give.100%', 'p4ssw0rd');
		popAndClick($panel, '', 'p4ssw0rd');
		popAndClick($panel, '   ', 'p4ssw0rd');
	});

	test('Invalid passwords are not even sent to the server', function() {
		$panel.loginpanel('option', 'url', '../mock/login_success.json');
		$panel.loginpanel('option', 'failure', function() {
			ok(true, 'Failure callback is not triggered');
		});
		$panel.loginpanel('option', 'success', function() {
			ok(false, 'Success callback is not triggered');
		});
		popAndClick($panel, 'mike', '');
		popAndClick($panel, 'mike', '   ');
		popAndClick($panel, 'mike', '2tiny');
	});

	// Helper function to populate a login panel with the username
	function populate($pnl, username, password) {
		$pnl.data('loginpanel').$username.val(username);
		$pnl.data('loginpanel').$password.val(password);
	}

	function popAndClick($pnl, username, password) {
		populate($pnl, username, password);
		$pnl.find('.submit input').click();
	}

	function popAndEnter($pnl, username, password, usernameOrPassword) {
		var $input, evt;
		populate($pnl, username, password);
		if (usernameOrPassword == 'username')
			$input = $pnl.data('loginpanel').$username;
		else
			$input = $pnl.data('loginpanel').$password;
		evt = $.Event('keypress');
		evt.keyCode = 13;
		$input.trigger(evt);
	}
	
}).call(this);



