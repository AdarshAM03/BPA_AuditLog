sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"newfeature/test/integration/pages/CustomersList",
	"newfeature/test/integration/pages/CustomersObjectPage",
	"newfeature/test/integration/pages/ProductsObjectPage"
], function (JourneyRunner, CustomersList, CustomersObjectPage, ProductsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('newfeature') + '/test/flp.html#app-preview',
        pages: {
			onTheCustomersList: CustomersList,
			onTheCustomersObjectPage: CustomersObjectPage,
			onTheProductsObjectPage: ProductsObjectPage
        },
        async: true
    });

    return runner;
});

