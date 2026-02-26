using { db } from '../db/schema';

service SimpleService {

    @odata.draft.enabled
    entity Customers as projection on db.Customer;

    entity Products  as projection on db.Product;

    entity Orders    as projection on db.Order;

    entity ChangeLogs as projection on db.ChangeLogs;

}
 