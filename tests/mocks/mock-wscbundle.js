(function () {
	window.WEBSPELLCHECKER = window.WEBSPELLCHECKER || {
		init: function (config, callback) {
			var instance = {
				destroy: function () { }
			};

			if (typeof callback === 'function') {
				callback(instance);
			}

			return instance;
		}
	};
})();
