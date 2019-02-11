## Wolf Plugin - A JQuery Plugin to validate input forms in real time

#### Requirements
Jquery >= 2.2.4

#### Installing Wolf
Inside your project directory use git clone https://github.com/rafaelferreti/wolf-plugin.git

#### Basic Usage
Call Wolf plugin in the page with code below
```
$('form').wolf({
  language: 'path/to/language/pt-BR.json'
});
```
**Note:** configure the _path/to/language/_ based on your project struture

#### Application
The Wolf plugin is used to validate: input text, select, radio and checkbox. You need to use two simple tags:

_data-wolf-rule_ : this tag is used for pass the rules, like as required, email, integer and more.

_data-wolf-field_ : this tag is used for pass the label name. For instance, imagine the input field name is email ```name="email"``` the error will show "The **email** is incorrect". But, you would like to show "The **e-mail** is incorret". In this case, your _data-wolf-field_ is e-mail: ```data-wolf-field="e-mail"```

#### Validate rules
- Required - Required field.
- min:10 - The field need to has 10 chacateres minimum. Just pass the minimum size after colon.
- max:100 - The field need to has 100 chacateres maximun. Just pass the maximun size after colon. 
- email - The field need to be a valid e-mail address.
- phone - The field need to be a valid phone. the field can not have a sequence of the same number: for instance, 1111, or 2222, or 3333 and more.
- integer - The field need to be an integer.
- cpf - The field need to be an brazilian valid CPF.

If you would like to use two or more validation, just use pipe: **required|email|min:20**

#### Usage examples
The input field is required and be a valid email

```<input type="email" data-wolf-rule="required|email">```

The input field has minimum 10 characteres and maximum 99 characteres.

```<input type="text" data-wolf-rule="min:10|max:99" data-wolf-label="my custom label">```
