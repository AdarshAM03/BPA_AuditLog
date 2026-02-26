const cds = require('@sap/cds')

module.exports = cds.service.impl(async function () {
    const { Customers,Products,ChangeLogs } = this.entities

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
        // 1. Get the Entity definition from the service
        const { ChangeLogs } = cds.entities; // Ensure name matches your srv/service.cds

        const auditEntries = changedFields.map(item => ({
            customerID: data.customerID || oldCustomer.customerID,
            field: item.field,
            oldValue: String(item.oldValue || ""),
            newValue: String(item.newValue || ""),
            createdAt: new Date().toISOString()
        }));

        try {
            // 2. Use the entity reference directly
            await INSERT.into(ChangeLogs).entries(auditEntries);
            console.log(`Saved ${auditEntries.length} entries.`);
        } catch (error) {
            console.error("Insert failed:", error.message);
        }
 }}
    
});

});
// const cds = require('@sap/cds')

// module.exports = cds.service.impl(async function () {
//     // Destructure your projected entities
//     const { Customers, Products, Orders } = this.entities

//     /**
//      * Helper: Returns an array of objects containing changed fields
//      */
//     const getChanges = (oldData, newData) => {
//         const changes = [];
//         for (const key in newData) {
//             // Only track if the field existed in the old record and the value is different
//             if (Object.prototype.hasOwnProperty.call(oldData, key) && newData[key] !== oldData[key]) {
//                 changes.push({
//                     field: key,
//                     oldValue: oldData[key],
//                     newValue: newData[key]
//                 });
//             }
//         }
//         return changes;
//     };

//     // 1. GENERIC BEFORE HANDLER: Runs for Customers, Products, and Orders
//     this.before("UPDATE", [Customers, Products, Orders], async (req) => {
//     // 1. Identify the Primary Key name for the current entity (e.g., 'productID' or 'orderID')
//     const { primaryKeys } = req.target;
//     const pkName = Object.keys(primaryKeys)[0];

//     // 2. Extract only the ID value to avoid passing the whole association object
//     const id = req.data[pkName];

//     if (id) {
//         // 3. Fetch using only the ID value in the where clause
//         const oldRecord = await SELECT.one.from(req.target).where({ [pkName]: id });
//         req.context.oldRecord = oldRecord;
//     }
// });

//     // 2. GENERIC AFTER HANDLER: Compares and logs results
//     this.after("UPDATE", [Customers, Products, Orders], async (data, req) => {
//         const oldRecord = req.context.oldRecord;
//         if (!oldRecord) return;

//         // Use the helper to detect all changed fields
//         const changedFields = getChanges(oldRecord, data);

//         if (changedFields.length > 0) {
//             const entityName = req.target.name.split('.').pop(); // Gets 'Products' or 'Orders'
//             console.log(`--- Changes detected in ${entityName} ---`);
//             console.table(changedFields);
            
//             // You can now process 'changedFields' for audit logging or emails
//         }
//     });
// });
