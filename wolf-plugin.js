(function($) {
	$.fn.wolf = function(options) {
		//when the form is sent, verify if has errors
		$(this).submit(function() {
			var has_errors = false;

			$('[data-wolf-rule]').each(function() {
				var element = $(this);
				var name    = $(this).attr('name');

				var field   = $(this).data('wolf-field');
				field       = (typeof field !== 'undefined') ? field : name;

				var rule    = $(this).data('wolf-rule');
				var value   = $(this).val();

				if (!howl(element, name, field, rule, value))
					has_errors = true;
			});

			if (has_errors)
				return false;
		});

		//when starts, create wolves id's for all elements
		var wolf = 0;

		$('[data-wolf-rule]').each(function(){
			var element = $(this);

			if (element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {
				var name = $(element).attr('name');
				$('input[name="'+name+'"]').attr('data-wolf-id', wolf);
			} else {
				$(element).attr('data-wolf-id', wolf);
			}

			wolf ++;
		});

		var settings = $.extend({
			showAllErrors: true
		}, options);

		function requiredValidate(value) {
			if (value == '')
				return false;

			return true;
		}

		function requiredValidateRadioOrCheckbox(name) {
			if (!$('input[name="'+name+'"]').is(':checked'))
				return false;
			
			return true;
		}

		function minValidate(value, min) {
			if (value.length < min)
				return false;

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

		function phoneValidate(value) {
			if (value.indexOf('0000') != -1 || value.indexOf('1111') != -1 || value.indexOf('2222') != -1 ||
				value.indexOf('3333') != -1 || value.indexOf('4444') != -1 || value.indexOf('5555') != -1 ||
				value.indexOf('6666') != -1 || value.indexOf('7777') != -1 || value.indexOf('8888') != -1 ||
				value.indexOf('9999') != -1)
					return false;

			return true;
		}

		function integerValidate(value) {
			if (!$.isNumeric(value))
				return false;

			value = parseInt(value);

			if (!Number.isInteger(value))
				return false;

			return true;
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

		//howl is responsible for validate and show errors message
		function howl(element, name, field, rule, value) {
			if (typeof rule !== 'undefined') {
				rule = rule.split('|');

				var error_list = [];

				var is_required = false;

				$.each(rule, function(key, type) {
					
					if (type == 'required') {
						//verify required in radios
						if (element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {
							if (!requiredValidateRadioOrCheckbox(name)) {
								error_list.push('required');
							}	
						}

						if (!requiredValidate(value)) {
							error_list.push('required');
						}

						is_required = true;
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

					if (type == 'phone') {
						if (!phoneValidate(value))
							error_list.push('phone');
					}

					if (type == 'integer') {
						if (!integerValidate(value))
							error_list.push('integer');
					}
				});

				//First, remove messages already sent
				var wolf_id = $(element).data('wolf-id');
				$('[data-wolf-error="'+wolf_id+'"]').remove();

				if (error_list.length > 0 && (is_required || value != '')) {
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

					if (has_errors) {
						if (element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {
							var name = $(element).attr('name');

							var last_radio;

							$('input[name="'+name+'"]').each(function(){
								last_radio = $(this);

								if (last_radio.next().is('label'))
									last_radio = last_radio.next();
							});

							element = last_radio;

						} 

						$(element).after(html_errors);
					}

					return false;

				}

				return true;
			}
		}

		$('[data-wolf-rule]').focusout(function() {
			var element = $(this);
			var name    = $(this).attr('name');

			var field   = $(this).data('wolf-field');
			field       = (typeof field !== 'undefined') ? field : name;

			var rule    = $(this).data('wolf-rule');
			var value   = $(this).val();

			howl(element, name, field, rule, value);
		});
	}
}(jQuery));