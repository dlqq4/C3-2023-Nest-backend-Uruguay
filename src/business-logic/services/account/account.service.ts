
import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { AccountDTO } from 'src/business-logic/dtos/account-dto';
import { CreateAccountDto } from 'src/business-logic/dtos/create-account-dto';
import { PaginationModel } from 'src/data-access/models/i-pagination-model';
import { AccountEntity } from 'src/data-access/entities/account-entity';
import { AccountTypeEntity } from 'src/data-access/entities/account-type-entity';
import { CustomerEntity } from 'src/data-access/entities/customer-entity';
import { AccountRepository } from 'src/data-access/repositories/AccountRepo';
import { AccountTypeRepository } from 'src/data-access/repositories/TypeAccountRepo';
import { CustomerService } from '../customer/customer.service';
import { CustomerRepo } from 'src/data-access/repositories/CustomerRepo';

@Injectable()
export class AccountService {

    constructor(private readonly accountRepository: AccountRepository,
                private readonly accountTypeRepository: AccountTypeRepository,
                private readonly customerService : CustomerService) {}

    createAccount(account: AccountDTO): AccountEntity { 
        
        const newAditionalAccount = new AccountEntity();
        const newAditionalAccountType = new AccountTypeEntity();

        newAditionalAccountType.name = account.accountTypeName;

        newAditionalAccount.accountTypeId = newAditionalAccountType;
        newAditionalAccount.customerId = this.customerService.getCustomerInfo(account.customerId);

        return this.accountRepository.register(newAditionalAccount);
    }

    //MUESTRO TODAS LAS CUENTAS DE UN USUARIO
    getAccountByCustomerId(customerId: string): AccountEntity[] {

        return this.accountRepository.findByCustomer(customerId);
    }
    

    //MUESTRO EL BALANCE DE UNA CUENTA SEGUN ID DE LA CUENTA
    getBalance(accountId: string): number {
        
        const currentEntity = this.accountRepository.findOneById(accountId);

        return currentEntity.balance
    }

    //DEPOSITAR DINERO EN UNA CUENTA SEGUN ID DE LA CUENTA
    addBalance(accountId: string, amount: number): AccountEntity {

        const currentEntity = this.accountRepository.findOneById(accountId);
        
        currentEntity.balance = currentEntity.balance + amount;

        return this.accountRepository.update(accountId, currentEntity)

    }

    removeBalance(accountId: string, amount: number): AccountEntity {

        const currentEntity = this.accountRepository.findOneById(accountId);

        if (currentEntity.balance < amount) {

            throw new NotAcceptableException('Lo siento, no dispone de ese saldo!')

        } else {

            currentEntity.balance = currentEntity.balance - amount;
        }
        return  this.accountRepository.update(accountId, currentEntity)
    }


    private cleanBalance(accountId: string): number {
        return this.getAccount(accountId).balance = 0;
    }

  
    verifyAmountIntoBalance(accountId: string, amount: number): boolean {

        const currentEntity = this.accountRepository.findOneById(accountId);

        if (currentEntity.balance < amount || currentEntity.balance < 1) {

            throw new NotAcceptableException('Lo siento, no dispone de ese saldo!')

        } else return true;
    }

    
    getState(accountId: string): boolean {

        const currentEntity = this.accountRepository.findOneById(accountId);

        return currentEntity.state;
    }


    changeState(accountId: string, state: boolean): void {

        const currentEntity = this.accountRepository.findOneById(accountId);

        currentEntity.state = state;

        this.accountRepository.update(accountId, currentEntity)
    }

   
    getAccountType(accountId: string): AccountTypeEntity {

        const currentEntity = this.accountRepository.findOneById(accountId);

        return currentEntity.accountTypeId;

    }

   
    changeAccountType(accountId: string, accountTypeId: string): AccountTypeEntity {

        const currentEntity = this.accountRepository.findOneById(accountId);
        
        currentEntity.accountTypeId = this.accountTypeRepository.findOneById(accountTypeId);

        return currentEntity.accountTypeId;
    }
   

    //PROBANDO
    deleteAccount(accountId: string, soft?: boolean): void {
        //if (soft) this.accountRepository.delete(accountId, soft); 
        
        this.accountRepository.delete(accountId, soft);
    }



    private getAccount(accountId: string): AccountEntity {

        return this.accountRepository.findOneById(accountId);
    }


    findByCustomer(pagination: PaginationModel, customerId: string): AccountEntity[] {

        const currentEntity: AccountEntity[] = this.accountRepository.findByCustomer(customerId)

        return currentEntity
      }

      //SOLUCIUONAR?
      updateAccount(accountId: string, newAccountData: AccountDTO) : AccountEntity{

        const currentEntity = this.accountRepository.findOneById(accountId);

        return this.accountRepository.update(accountId, currentEntity);
    
      }


      findOneById(accountId: string): AccountEntity {
        
        return this.getAccount(accountId);
      }


      getById(accountId : string):AccountEntity{

        const accountEntity = this.accountRepository.findOneById(accountId); 
    
        return accountEntity;
      }
      

}
