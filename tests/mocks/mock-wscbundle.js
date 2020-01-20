(function () {
	window.WEBSPELLCHECKER = window.WEBSPELLCHECKER || {
		init: function (config, callback) {
			const instance = {
				destroy: function () { },
				commitOption: function (changedOptions, settings) {
					if (typeof config.onCommitOptions === 'function') {
						settings = settings || {};
						!settings.ignoreCallback && config.onCommitOptions(instance, changedOptions);
					}
				}
			};

			if (typeof callback === 'function') {
				callback(instance);
			}

			return instance;
		},
	};
})();
