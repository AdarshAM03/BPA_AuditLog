namespace db;

entity Customer {

    key customerID         : Integer;
        name               : String(100);
        email              : String(150);
        phone              : String(20);
        customerToproducts : Composition of many Product
                                 on customerToproducts.productsToCustomer = $self;
        customerToorder    : Composition of many Order
                                 on customerToorder.orderTocustomer = $self;

}

entity Product {

    key productID          : Integer;
        productName        : String(150);
        price              : Decimal(10, 2);
        category           : String(100);
        productsToCustomer : Association to one Customer;
}

entity Order {

    key orderID         : UUID;
        orderDate       : Date;
        quantity        : Integer;
        totalAmount     : Decimal(12, 2);
        orderTocustomer : Association to one Customer;
}

entity ChangeLogs {
    key ID          : UUID;
        createdAt   : Timestamp @cds.on.insert; // Auto-timestamp
        customerID  : String; // Link to the Customer
        entityName  : String; // e.g., 'Product' or 'Customer'
        entityKey   : String; // e.g., '12' (the ID of the product)
        field       : String; // e.g., 'category'
        oldValue    : String;
        newValue    : String;
        fullPath    : String; // e.g., 'Product[ID:12].category'
        BpaInstanceID : String
}
