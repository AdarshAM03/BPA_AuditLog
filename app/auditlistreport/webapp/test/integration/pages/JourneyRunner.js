sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"auditlistreport/test/integration/pages/CustomersList",
	"auditlistreport/test/integration/pages/CustomersObjectPage",
	"auditlistreport/test/integration/pages/ProductsObjectPage"
], function (JourneyRunner, CustomersList, CustomersObjectPage, ProductsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('auditlistreport') + '/test/flp.html#app-preview',
        pages: {
			onTheCustomersList: CustomersList,
			onTheCustomersObjectPage: CustomersObjectPage,
			onTheProductsObjectPage: ProductsObjectPage
        },
        async: true
    });

    return runner;
});

