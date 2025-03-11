define(
    [
        'Bold_CheckoutPaymentBooster/js/view/form/element/email/fastlane-mixin',
        'Bold_CheckoutPaymentBooster/js/model/fastlane',
        'Bold_BoosterOneStepCheckoutCompatibility/js/action/hide-billing-address'
    ], function (
        fastlaneMixin,
        fastlane,
        hideBillingAddress
    ) {
        'use strict';

        return function (MagentoEmailComponent) {
            var fastlaneComponent = fastlaneMixin(MagentoEmailComponent);

            return fastlaneComponent.extend({
                initialize: function() {
                    this._super();

                    if (!fastlane.isAvailable()) {
                        return;
                    }

                    fastlane.memberAuthenticated.subscribe(function (authenticated) {
                        if (authenticated === true) {
                            hideBillingAddress();
                        }
                    }, this);
                }
            });
        };
    }
);
