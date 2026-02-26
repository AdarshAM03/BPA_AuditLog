sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheCustomersList.iSeeThisPage();
            Then.onTheCustomersList.onTable().iCheckColumns(4, {"customerID":{"header":"customerID"},"name":{"header":"name"},"email":{"header":"email"},"phone":{"header":"phone"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheCustomersList.onFilterBar().iExecuteSearch();
            
            Then.onTheCustomersList.onTable().iCheckRows();

            When.onTheCustomersList.onTable().iPressRow(0);
            Then.onTheCustomersObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});