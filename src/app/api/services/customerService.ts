import { MongoDataManager } from "@/app/api/repository/mongoDataManager";
import { Customer } from "@/types/customer";

const customerRepo = new MongoDataManager<Customer>();

export async function getCustomers() {
  return customerRepo.find("customers");
}

export async function getCustomerByEmail(email: string) {
  return customerRepo.findOne("customers", { email });
}

export async function insertCustomer(customer: Customer) {
  return customerRepo.insertOne("customers", customer);
}
