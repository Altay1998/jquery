let validationConfig = {
    isLangExists: function (lang) {
        let isExists = false;
        for (let _lang in this.langs) {
            if (_lang == lang) {
                isExists = true;
                break;
            }
        }
        return isExists;
    },
    addValidationConfiguration: function (lang, configClass, errorMessage) {
        if (!this.isLangExists(lang))
            throw new Error('given language is not exists');
        this.langs[lang][configClass] = errorMessage;
    },
    getRuleValueByLang: function (lang, rulename) {
        return this.langs[lang][rulename];
    },
    langs: {
        az: {
            'required': 'Xana bos ola bilmez!!',
            'min-len-': 'Sözün uzunluğu minimum `x` olmalıdır',
            'num-min-': 'Ədədin minimum dəyəri `x` olmalıdır',
            'num-max-': 'Ədədin maksimal dəyəri `x` olmalıdır',
            'number': 'Ədəd olmalıdır'
        },
        ru: {
            'required': 'Polya doljen bit zapolneno',
            'min-len-': 'Minimalniy dlina slova doljen bit `x`',
            'num-min-': 'Minimalnaya znacheniya chislo doljen bit `x`',
            'num-max-': 'Maxsimalnaya znacheniya chislo doljen bit `x`',
            'number': 'Doljen bit chislo'
        },
        en: {
            'required': 'input cant be empty',
            'min-len-': 'minimum length of the input must be `x`',
            'num-min-': 'minimum size of number must be `x`',
            'num-max-': 'maximum size of number must be `x`',
            'number': 'Must be only number!!'
        }
    }
};

function Validator(validationConfig) {
    this._lang = 'en';
    this._validationConfig = validationConfig;
    this._isLangExists = function (lang) {
        return this._validationConfig.isLangExists(lang);
    }
    this.addValidationConfiguration = function (lang, configClass, errorMessage) {
        this._validationConfig.addValidationConfiguration(lang, configClass, errorMessage);
    }
    this.addValidationRule = function (ruleName, callback) {
        this._rules[ruleName] = callback;
    }

    this.configLanguage = function (lang) {
        this._lang = lang;
    }
    this._isRuleExists = function (ruleName) {
        let _innerRule = null;
        for (let f in this._rules.ruleTypes) {
            if (ruleName.includes(f)) {
                _innerRule = f;
                break;
            }
        }
        return _innerRule;
    }

    this._rules = {


        hasValue: function () {

        },
        ruleTypes: {
            _createErrorContainer: function (key, errorMessage) {
                let errorSpan = document.createElement('span');
                errorSpan.className = `error-${key}`;
                errorSpan.innerText = errorMessage;
                return errorSpan;
            },
            _isNumber: function (val) {
                return isNaN(Number(val));
            },
            'number': function (value, errorOn, errorMessage, ruleValue) {
                if (this._isNumber(value)) {
                    let errorSpan = this._createErrorContainer('number', errorMessage);
                    document.getElementById(errorOn).appendChild(errorSpan);
                }
            },
            'required': function (value, errorOn, errorMessage, ruleValue) {
                if (value == null || value == undefined || value.length == 0) {
                    let errorSpan = this._createErrorContainer('required', errorMessage);
                    document.getElementById(errorOn).appendChild(errorSpan);
                }
            },
            'email': function (value, errorOn, errorMessage, ruleValue) {
                if (value == null || value == undefined || value.length == 0) {
                    let errorSpan = this._createErrorContainer('mail', errorMessage);
                    document.getElementById(errorOn).appendChild(errorSpan);
                }
            },
            'min-len-': function (value, errorOn, errorMessage, ruleValue) {
                let errorSpan = this._createErrorContainer('min-len', errorMessage);
                document.getElementById(errorOn).appendChild(errorSpan);
            },
            'max-len-': function (value, errorOn, errorMessage, ruleValue) {
                let errorSpan = this._createErrorContainer('max-len', errorMessage);
                document.getElementById(errorOn).appendChild(errorSpan);
            },
            'num-min-': function (value, errorOn, errorMessage, ruleValue) {
                if (parseInt(value) < parseInt(ruleValue) || value == '' || value == null) {
                    let errorSpan = this._createErrorContainer('num-min', errorMessage);
                    document.getElementById(errorOn).appendChild(errorSpan);
                }

            },
            'num-max-': function (value, errorOn, errorMessage, ruleValue) {
                if (parseInt(value) > parseInt(ruleValue) || value == '' || value == null) {
                    let errorSpan = this._createErrorContainer('num-max', errorMessage);
                    document.getElementById(errorOn).appendChild(errorSpan);
                }

            }
        }
    },
        this._isEmpty = function (value) {
            return value == '' || value == null || value == undefined
        }
    this._getErrorMessage = function (classname, errorMessage) {
        if (this._isEmpty(errorMessage))
            return '';
        else
            if (classname == 'required' || classname == 'email') {
                return errorMessage;
            }
            else {
                let ruleName = this._isRuleExists(classname);
                let num = classname.substr(ruleName.length, classname.length - ruleName.length);
                errorMessage = errorMessage.replace('`x`', num);
                return errorMessage;
            }

    }
    this.validateForm = function (formId) {
        let formToValidate = document.getElementById(formId);
        if (formToValidate == null) {
            throw new Error('given form not exists');
        }
        else {
            let inputstoValidate = formToValidate.getElementsByTagName('input');
            for (let input of inputstoValidate) {
                document.getElementById(input.getAttribute('data-validation-error')).innerHTML = "";
                let inputClAttributes = input.classList;
                for (let inputClAttr of inputClAttributes) {
                    let ruleName = this._isRuleExists(inputClAttr);//min-len-34
                    let ruleValue = inputClAttr.substr(ruleName.length, inputClAttr.length - ruleName.length);
                    if (ruleName != null) {
                        let formalizeErrorMessage = this._getErrorMessage(inputClAttr, this._validationConfig.getRuleValueByLang(this._lang, ruleName));
                        this._rules.ruleTypes[ruleName](input.value, input.getAttribute('data-validation-error'), formalizeErrorMessage, ruleValue);
                    }
                }
            }
        }
    }
}

let validator = new Validator(validationConfig);