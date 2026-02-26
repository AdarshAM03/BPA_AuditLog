using SimpleService as service from '../../srv/service';
annotate service.Customers with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'customerID',
                Value : customerID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'phone',
                Value : phone,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Products',
            ID : 'Products',
            Target : 'customerToproducts/@UI.LineItem#Products',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Orders',
            ID : 'Orders',
            Target : 'customerToorder/@UI.LineItem#Orders',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'customerID',
            Value : customerID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'email',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Label : 'phone',
            Value : phone,
        },
    ],
);

annotate service.Products with @(
    UI.LineItem #Products : [
        {
            $Type : 'UI.DataField',
            Value : productID,
            Label : 'productID',
        },
        {
            $Type : 'UI.DataField',
            Value : price,
            Label : 'price',
        },
        {
            $Type : 'UI.DataField',
            Value : category,
            Label : 'category',
        },
        {
            $Type : 'UI.DataField',
            Value : productName,
            Label : 'productName',
        },
    ],
    UI.HeaderFacets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Product',
            ID : 'Product',
            Target : '@UI.FieldGroup#Product',
        },
    ],
    UI.FieldGroup #Product : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : category,
                Label : 'category',
            },
            {
                $Type : 'UI.DataField',
                Value : price,
                Label : 'price',
            },
            {
                $Type : 'UI.DataField',
                Value : productID,
                Label : 'productID',
            },
            {
                $Type : 'UI.DataField',
                Value : productName,
                Label : 'productName',
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Product',
            ID : 'Product',
            Target : '@UI.FieldGroup#Product1',
        },
    ],
    UI.FieldGroup #Product1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : productID,
                Label : 'productID',
            },
            {
                $Type : 'UI.DataField',
                Value : price,
                Label : 'price',
            },
            {
                $Type : 'UI.DataField',
                Value : category,
                Label : 'category',
            },
            {
                $Type : 'UI.DataField',
                Value : productName,
                Label : 'productName',
            },
        ],
    },
);

annotate service.Orders with @(
    UI.LineItem #Orders : [
        {
            $Type : 'UI.DataField',
            Value : orderID,
            Label : 'orderID',
        },
        {
            $Type : 'UI.DataField',
            Value : orderDate,
            Label : 'orderDate',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : totalAmount,
            Label : 'totalAmount',
        },
    ]
);

