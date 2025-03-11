define([
    "uiComponent",
    "uiRegistry",
    "mage/utils/wrapper",
    "jquery",
    "ko",
    "Magento_Ui/js/lib/view/utils/dom-observer",
    "Magento_Checkout/js/model/payment/additional-validators",
    "Magento_Checkout/js/model/quote"
], function (uiComponent, uiRegistry, wrapper, jQuery, ko, domObserver, additionalValidators, quote) {
    'use strict';

    return function (target) {
        return target.extend({
            initialize: function () {
                var emailComponent = "checkout.steps.shipping-step.shippingAddress.customer-email";
                if (quote.isVirtual()) {
                    emailComponent = "checkout.steps.billing-step.payment.customer-email";
                }
                var _checkEmailAvailability = null;
                uiRegistry.async(emailComponent)(
                    function (emailView) {
                        if (this.cnf.registeronsuccess !== "1") {
                            domObserver.get("#customer-email-fieldset span.note", function (elem) {
                                jQuery(elem).remove();
                            });
                        }

                        if (
                            this.cnf.optionalpwd !== "1" &&
                            this.cnf.requiredpwd !== "1"
                        ) {
                            _checkEmailAvailability = emailView.checkEmailAvailability;
                            emailView.checkEmailAvailability = wrapper.wrap(emailView.checkEmailAvailability, function (originalMethod) {
                                return originalMethod();
                            });
                        }

                        if (this.cnf.requiredpwd == "1") {
                            this.showPwdVisible(false);
                            this.showPwd(true);
                        }

                        if (
                            this.cnf.optionalpwd == "1" ||
                            this.cnf.requiredpwd == "1"
                        ) {
                            emailView.isPasswordVisible.subscribe(
                                function (newValue) {
                                    this.isExistingPasswordVisible(newValue);
                                }.bind(this)
                            );
                            uiRegistry.async('checkoutProvider')(
                                function (checkoutProvider) {
                                    this.source = checkoutProvider;
                                }.bind(this)
                            );
                            domObserver.get(".opc-wrapper .form-login > .fieldset", function (elem) {
                                domObserver.get("#iosc-summary .iosc-registration", function (subelem) {
                                    jQuery(elem).append(jQuery('#iosc-summary .iosc-registration'));
                                    jQuery('.opc-sidebar .iosc-registration').remove();
                                    this.isMoved(true);
                                    this.isExistingPasswordVisible(emailView.isPasswordVisible());
                                    return false;
                                }.bind(this));
                                return false;
                            }.bind(this));
                            domObserver.get(".iosc-register-pwd input", function (elem) {
                                jQuery(elem)
                                    .attr('data-password-min-length', this.pwdrules["password-min-length"])
                                    .attr('data-password-min-character-sets', this.pwdrules["password-min-character-sets"]);
                            }.bind(this));
                            uiRegistry.async('checkout.iosc.ajax')(
                                function (ajax) {
                                    ajax.addMethod('params', 'registration', this.paramsHandler.bind(this));
                                }.bind(this)
                            );
                            additionalValidators.registerValidator(this.getValidator());
                        }
                    }.bind(this)
                );
                this._super();
                uiRegistry.async(emailComponent)(
                    function (emailView) {
                        if (_checkEmailAvailability) {
                            emailView.checkEmailAvailability = _checkEmailAvailability;
                        }
                    }
                );

                return this;
            }
        });
    };
});
