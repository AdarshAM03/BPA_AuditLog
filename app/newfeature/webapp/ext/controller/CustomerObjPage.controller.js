sap.ui.define([
	"sap/ui/core/mvc/ControllerExtension"
], function (ControllerExtension) {
	"use strict";

	return ControllerExtension.extend("newfeature.ext.controller.CustomerObjPage", {

		override: {

			onInit: function () {
				// Call AJAX once during initialization
				this._fetchChangeLogs();
				const nameField = "sapUiFormCLCellsS12 sapUiFormCLCellsL12"
				const emailField = "sapMText sapUiSelectable sapMTextBreakWord sapMTextMaxWidth sapMTextRenderWhitespaceWrap"
				const phoneField = "sapMText sapUiSelectable sapMTextBreakWord sapMTextMaxWidth sapMTextRenderWhitespaceWrap"
			},
			routing: {
				onAfterBinding: async function (oBindingContext) {
					// Give the framework a tiny moment to finish the final DOM paint
					setTimeout(function () {
						const sId = "newfeature::CustomersObjectPage--fe::FormContainer::GeneratedFacet1::FormElement::DataField::name::Field-display";

						// Use attribute selector for IDs with double colons
						const $field = $('[id="' + sId + '"]');

						if ($field.length) {
							$field.addClass("highlightYellow");
							// Ensure the background applies even if there's an inner span
							$field.find("*").addClass("highlightYellow");
						}
					}, 200);
				}
			},
			// onAfterRendering: function () {
			// 	debugger
			// 	setTimeout(function () {
			// 		// Use attribute selector [id="..."] to handle double colons safely
			// 		var sId = "newfeature::CustomersObjectPage--fe::FormContainer::GeneratedFacet1::FormElement::DataField::name::Field-display";

			// 		$('[id="' + sId + '"]').addClass("highlightYellow");

			// 		// Alternatively, if the above doesn't work, target the inner text span directly:
			// 		$('[id="' + sId + '"]').css("background-color", "yellow");

			// 	}, 1000);
			// }
		},

		_fetchChangeLogs: function () {
			var that = this;

			// ⚠️ Use relative path (recommended)
			var sUrl = "/odata/v4/simple/ChangeLogs";
			
			console.log("Starting AJAX call...");

			$.ajax({
				url: sUrl,
				method: "GET",
				async: true,
				contentType: "application/json",
				dataType: "json",
				headers: {
					"Accept": "application/json"
				},

				success: function (oData) {

					setTimeout(function () {
						if (oData && oData.value) {
							// Calculate cutoff for "last 1 minute"
							var oneMinuteAgo = Date.now() - 60000;

							var aFilteredData = oData.value.filter(function (item) {
								var itemTime = new Date(item.createdAt).getTime();
								return itemTime > oneMinuteAgo;
							});

							console.log("Newly Generated Data (Last 1 Minute):");
							console.table(aFilteredData);
						}
					}, 5000); // 1000ms delay (adjust as needed)
				},

				error: function (oError) {
					console.error("AJAX Fetch Failed:");

					if (oError.responseJSON) {
						console.error(oError.responseJSON);
					} else {
						console.error(oError.statusText);
					}
				}
			});
		}

	});

});