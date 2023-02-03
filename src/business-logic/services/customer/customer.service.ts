import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepo } from 'src/data-access/repositories/CustomerRepo';
import { AccountService } from '../account/account.service';
import { CustomerEntity } from 'src/data-access/entities/customer-entity';
import { PaginationModel } from 'src/data-access/models/i-pagination-model';
import { DocumentTypeEntity } from 'src/data-access/entities/document-type-entity';
import { UpdateCustomerDTO } from 'src/business-logic/dtos/update-customer-dto';

@Injectable()
export class CustomerService {


    constructor(private readonly customerRepository: CustomerRepo){}

     
    getCustomerInfo(customerId: string): CustomerEntity {

        const currentEntity = this.customerRepository.findOneById(customerId);
        return currentEntity   
            
    }

    findAll(pagination: PaginationModel): CustomerEntity[] { //No esta pronto
        return this.customerRepository.findAll();
    }

   
    updatedCustomer(id: string, newCustomer: UpdateCustomerDTO): CustomerEntity {

        const currentEntity = this.customerRepository.findOneById(id);
        
        if(currentEntity){
          
            currentEntity.document = newCustomer.document  
            currentEntity.fullName = newCustomer.fullName;
            currentEntity.email = newCustomer.email;
            currentEntity.phone = newCustomer.phone;
            currentEntity.password = newCustomer.password;
            currentEntity.state = newCustomer.state;

            return this.customerRepository.update(id, currentEntity);
        }     else throw new NotFoundException('Nada por aca!')
    }


    changeState(customerId: string, state: boolean): void {
        const customer = this.getCustomer(customerId);
        customer.state = state;

        this.customerRepository.update(customerId, customer);
    }

   
    
    unsuscribe(customerId: string, soft?: boolean): void {
        
        if (soft) this.customerRepository.delete(customerId, soft);

        this.customerRepository.delete
    }


    private getCustomer(customerId: string): CustomerEntity {

        return this.customerRepository.findOneById(customerId);
    }


}
