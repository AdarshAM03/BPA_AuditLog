const cds = require('@sap/cds')
const axios = require('axios');

module.exports = cds.service.impl(async function () {
    const { Customers, Products, ChangeLogs } = this.entities

    this.before("UPDATE", Customers, async (req) => {
        console.log("Customers update before triggered")

        // Use .columns() to expand both Products and Orders
        const customer = await SELECT.one
            .from(Customers)
            .where({ customerID: req.data.customerID })
            .columns(c => {
                c('*'),                   // Select all Customer fields
                    c.customerToproducts('*'), // Expand and select all Product fields
                    c.customerToorder('*')    // Expand and select all Order fields
            });

        req.context.oldCustomer = customer;
        console.log(customer)
    });

    // 
    this.after("UPDATE", Customers, async (data, req) => {
        const oldCustomer = req.context.oldCustomer;
        if (!oldCustomer) return;

        const changedFields = [];
        debugger
        // 1. Check top-level Customer fields
        for (const key in data) {
            // Skip the composition arrays for now
            if (key !== 'customerToproducts' && key !== 'customerToorder' && data[key] !== oldCustomer[key]) {
                changedFields.push({
                    field: key,
                    oldValue: oldCustomer[key],
                    newValue: data[key]
                });
            }
        }

        // 2. Check nested Products fields
        if (data.customerToproducts) {
            data.customerToproducts.forEach(newProd => {
                const oldProd = oldCustomer.customerToproducts.find(p => p.productID === newProd.productID);
                if (oldProd) {
                    for (const field in newProd) {
                        if (newProd[field] !== oldProd[field]) {
                            changedFields.push({
                                field: `Product[ID:${newProd.productID}].${field}`,
                                oldValue: oldProd[field],
                                newValue: newProd[field]
                            });
                        }
                    }
                }
            });
        }

        // 3. Check nested Orders fields
        if (data.customerToorder) {
            data.customerToorder.forEach(newOrder => {
                // Match using orderID (UUID)
                const oldOrder = oldCustomer.customerToorder.find(o => o.orderID === newOrder.orderID);
                if (oldOrder) {
                    for (const field in newOrder) {
                        if (newOrder[field] !== oldOrder[field]) {
                            changedFields.push({
                                field: `Order[ID:${newOrder.orderID}].${field}`,
                                oldValue: oldOrder[field],
                                newValue: newOrder[field]
                            });
                        }
                    }
                }
            });
        }

        if (changedFields.length > 0) {
            console.log("Detected Detailed Changes:", JSON.stringify(changedFields, null, 2));
            if (changedFields.length > 0) {

                var client = 'sb-b704a0f4-f7d8-4f17-ae65-d3c9aee05830!b577460|xsuaa!b49390';
                var secret = 'e37ae365-f424-49a0-88d8-d7730b8e9b96$Ci0DnGYfrbrIAVdvGoD4y5bn5LF0IxXIGpEtpa1Phs4=';

                // 1. Get Access Token
                var auth1 = Buffer.from(client + ':' + secret, 'utf-8').toString('base64');
                var response1 = await axios.post('https://8d0b19adtrial.authentication.us10.hana.ondemand.com/oauth/token?grant_type=client_credentials',
                    null, // No body needed for this grant type usually
                    {
                        headers: {
                            'Authorization': 'Basic ' + auth1,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );

                // 2. Define Request Body (Removed redundant JSON.parse/stringify and extra braces)
                var bodyy = {
                    "definitionId": "us10.8d0b19adtrial.auditbpa.process1",
                    "context": {
                        "_name": "3 Dummy Audit Process",
                        "newNumber": 12345,
                        "date": "2023-10-27",
                        "modified": [
                            "Initial setup by system",
                            "Placeholder data applied"
                        ]
                    }
                };

                // 3. Start Workflow Instance
                var response11 = await axios.post(`https://spa-api-gateway-bpi-us-prod.cfapps.us10.hana.ondemand.com/workflow/rest/v1/workflow-instances`,
                    bodyy,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + response1.data.access_token,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const workflowInstanceId = response11.data.id;
                console.log("Workflow Instance ID:", workflowInstanceId);

                // 1. Get the Entity definition from the service

                const { ChangeLogs } = cds.entities; // Ensure name matches your srv/service.cds

                const auditEntries = changedFields.map(item => ({
                    customerID: data.customerID || oldCustomer.customerID,
                    field: item.field,
                    oldValue: String(item.oldValue || ""),
                    newValue: String(item.newValue || ""),
                    createdAt: new Date().toISOString(),
                    BpaInstanceID: workflowInstanceId
                }));

                try {
                    // 2. Use the entity reference directly
                    await INSERT.into(ChangeLogs).entries(auditEntries);
                    console.log(`Saved ${auditEntries.length} entries.`);
                } catch (error) {
                    console.error("Insert failed:", error.message);
                }
            }
        }
    });
});
