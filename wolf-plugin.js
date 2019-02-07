(function($) {
	$.fn.wolf = function(options) {
		//when the form is sent, verify if has errors
		$(this).submit(function() {
			var has_errors = false;

			$('.wolf-errors').each(function(){
				has_errors = true;
			});

			if (has_errors)
				return false;
		});

		//when starts, create wolves id's for all elements
		var wolf = 0;

		$('[data-wolf-rule]').each(function(){
			$(this).attr('data-wolf-id', wolf);
			wolf ++;
		});

		var settings = $.extend({
			showAllErrors: true
		}, options);

		function requiredValidade(value) {
			if (value == '')
				return false;

			return true;
		}

		function minValidate(value, min) {
			if (value.length < min) {
				//console.log('false');
				return false;
			}

			return true;
		}

		function maxValidate(value, max) {
			if (value.length > max)
				return false;

			return true;
		}

		function emailValidate(value) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(String(value).toLowerCase());
		}

		var errors_message = [];

		//get messages text
		$.ajax({
		    url: settings.language,
		    async: false,
		    success: function(data){		    	
		    	errors_message = data;
		    },
		});

		$('[data-wolf-rule]').focusout(function(){

			var element = $(this);
			var name    = $(this).attr('name');

			var field   = $(this).data('wolf-field');
			field       = (typeof field !== 'undefined') ? field : name;

			var rule    = $(this).data('wolf-rule');
			var value   = $(this).val();

			var min;
			var max;

			if (typeof rule !== 'undefined') {
				rule = rule.split('|');

				var error_list = [];

				$.each(rule, function(key, type) {
					
					if (type == 'required') {
						if (!requiredValidade(value)) {
							error_list.push('required');
						}
					}

					if (type.indexOf('min') != -1) {
						min = type.split(':');
						min = min[1];

						if (!minValidate(value, min)) {
							error_list.push('min');
						}
						
					}

					if (type.indexOf('max') != -1) {
						 max = type.split(':');
						 max = max[1]

						if (!maxValidate(value, max)) {
							error_list.push('max');
						}
					}

					if (type == 'email') {
						if (!emailValidate(value)) {
							error_list.push('email');
						}
					}
				});

				//First, remove messages already sent
				var wolf_id = $(element).data('wolf-id');
				$('[data-wolf-error="'+wolf_id+'"]').remove();

				if (error_list.length > 0) {
					//And now, (if necessary) create new errors messages
					var html_errors = '<div class="wolf-errors" data-wolf-error="'+wolf_id+'"><ul>';
					has_errors = true;

					$(element).addClass('wolf-input-error');

					$.each(error_list, function(key, error) {
						var message = errors_message[error];
						
						message = message.replace(':field', field);

						if (error == 'max')
							message = message.replace(':value', max);
						if (error == 'min')
							message = message.replace(':value', min);

						html_errors += '<li>'+message+'</li>';
					});

					html_errors += '</ul></div>';

					if (has_errors)
						$(element).after(html_errors);

				}
			}
		})
	}
}(jQuery));