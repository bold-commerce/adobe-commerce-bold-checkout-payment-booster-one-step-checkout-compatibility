define([
        'Bold_CheckoutPaymentBooster/js/model/fastlane',
    ],
    function (
        fastlane
    ) {
        'use strict';

        return function (billingAddressComponent) {
            return billingAddressComponent.extend({
                validate: function () {
                    if (!fastlane.isAvailable() || !fastlane.memberAuthenticated()) {
                        return this._super();
                    }

                    return true;
                }
            });
        };
    }
);
