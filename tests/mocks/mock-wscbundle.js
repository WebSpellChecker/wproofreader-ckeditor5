(function () {
	window.WEBSPELLCHECKER = window.WEBSPELLCHECKER || {
		init: function (config, callback) {
			const instance = {
				disabled: false,
				destroy: function() {},
				commitOption: function(changedOptions, settings) {
					if (typeof config.onCommitOptions === 'function') {
						settings = settings || {};
						!settings.ignoreCallback && config.onCommitOptions(changedOptions, instance);
					}
				},
				getStaticActions: function() {
					return [
						{
							name: 'toggle',
							localization: {
								default: 'Toggle',
								enable: 'Enable',
								disable: 'Disable'
							}
						},
						{
							name: 'settings',
							localization: {
								default: 'Settings'
							}
						},
						{
							name: 'proofreadDialog',
							localization: {
								default: 'Proofread in dialog'
							}
						}
					];
				},
				isDisabled: function() {
					return this.disabled;
				},
				enable: function() {},
				disable: function() {},
				openSettings: function() {},
				openDialog: function() {}
			};

			if (typeof callback === 'function') {
				callback(instance);
			}

			return instance;
		}
	};
})();
