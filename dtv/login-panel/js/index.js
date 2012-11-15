$(function() {

	// A limited stand in for console.log when missing.
	window.console = window.console || {
		log: function(msg) {
			alert(msg);
		}
	};

	$('.login-panel').loginpanel({
		url: 'mock/login_success.json',
		success: function() {
			console.log("The success callback was triggered.", arguments);
		},

		failure: function() {
			console.log("The failure callback was triggered.", arguments);
		}
	});
});