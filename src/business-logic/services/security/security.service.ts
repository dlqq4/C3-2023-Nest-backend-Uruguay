import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AccountEntity } from 'src/data-access/entities/account-entity';
import { AccountTypeEntity } from 'src/data-access/entities/account-type-entity';
import { CustomerEntity } from 'src/data-access/entities/customer-entity';
import { CustomerRepo } from 'src/data-access/repositories/CustomerRepo';
import { AccountService } from '../account';
import { Response } from 'express';
import * as jwt from "jsonwebtoken"
import { SignInDto } from 'src/business-logic/dtos/sign-in-dto';
import { SignUpDto } from 'src/business-logic/dtos/sign-up-dto';
import { DocumentTypeEntity } from 'src/data-access/entities/document-type-entity';
import { DocumentTypeRepository } from 'src/data-access/repositories/DocumentTypeRepo';
import { JwtService } from '@nestjs/jwt/dist';
import { AccountDTO } from 'src/business-logic/dtos/account-dto';

@Injectable()
export class SecurityService {
    constructor(private readonly customerRepository: CustomerRepo,
                private readonly accountService: AccountService,
                private readonly documentTypeRepository : DocumentTypeRepository) {}
    
     
    signIn(user: SignInDto): string {
      const answer = this.customerRepository.findOneByEmailAndPassword(
        user.username,
        user.password,
      );

      if (answer) return jwt.sign({customer : answer}, process.env.TOKEN_SECRET || "tokentest")  
      else throw new UnauthorizedException();
    }

    
    signUp(userDto: SignUpDto): string { //
      const newCustomer = new CustomerEntity();
      const documentType = new DocumentTypeEntity();

      documentType.name = userDto.documentTypeName; //NAME ES EL UNICO DATO QUE LE TENGO QUE PASAR A EL DOCUMENT TYPE ENTITY 

      newCustomer.documentType = documentType; //AL ATRIBUTO DE CUSTOMER ENTITY LE PASO UN DOCUMENT TYPE ENTITY (LA RELACION)
      newCustomer.document = userDto.document;
      newCustomer.fullName = userDto.fullName;
      newCustomer.email = userDto.email;        //CON EL DTO COMPLETO LOS ATRIBUTOS DEL NUEVO CUSTOMER
      newCustomer.phone = userDto.phone;
      newCustomer.password = userDto.password;
  
      const customer = this.customerRepository.register(newCustomer);  //AGREGO EL NUEVO CUSTOMER A EL ARRAY DE CUSTOMERS
      this.documentTypeRepository.register(documentType);       //AGREGO EL NUEVO DOCUMENT TYPE A EL ARRAY DE DOCUMENT TYPE
  
      if (customer) {
          
        const newAccountDTO = new AccountDTO();

        newAccountDTO.accountTypeName = userDto.accountTypeName;
        newAccountDTO.customerId = customer.id;

        const account = this.accountService.createAccount(newAccountDTO); //AGREGO LA NUEVA CUENTA A EL ARRAY DE ACCOUNT
        
        console.log(account.balance)

        if (account)
        
        
      
      return  jwt.sign({customer: customer}, process.env.TOKEN_SECRET || "tokentest");
      //[account, jwt.sign(userDto, process.env.TOKEN_SECRET || "tokentest")]
      

        else throw new InternalServerErrorException();
      } else throw new InternalServerErrorException();
    }
  
   
    signOut(JWToken: string): void {
    
    }
  }


