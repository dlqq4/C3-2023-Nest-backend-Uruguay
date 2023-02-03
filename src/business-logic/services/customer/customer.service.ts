import { Injectable } from '@nestjs/common';
import { CustomerRepo } from 'src/data-access/repositories/CustomerRepo';
import { AccountService } from '../account/account.service';
import { CustomerEntity } from 'src/data-access/entities/customer-entity';
import { PaginationModel } from 'src/data-access/models/i-pagination-model';
import { CreateCustomerDto } from 'src/business-logic/dtos/create-customer-dto';
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

        const currentEntity = this.customerRepository.findOneById(id); // Creo una constante y la igualo segun Id

        const documentType = new DocumentTypeEntity(); //Creo una constante de tipo Document type Entity
        documentType.id = newCustomer.documentType; //Al ID de mi cosntante DTE le asigno el tipo de documento de mi dto

        currentEntity.documentType = documentType;
        currentEntity.document = newCustomer.document  //igualo atributos
        currentEntity.fullName = newCustomer.fullName;
        currentEntity.email = newCustomer.email;
        currentEntity.phone = newCustomer.phone;
        currentEntity.password = newCustomer.password;

        return this.customerRepository.update(id, currentEntity);
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
