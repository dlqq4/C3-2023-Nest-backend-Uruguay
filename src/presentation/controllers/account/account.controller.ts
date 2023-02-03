import { Body, Controller, Param, Post, Put, Get, Delete, Patch, Query, ParseUUIDPipe, ParseFloatPipe } from '@nestjs/common';
import { AccountDTO } from 'src/business-logic/dtos/account-dto';
import { CreateAccountDto } from 'src/business-logic/dtos/create-account-dto';
import { PaginationModel } from 'src/data-access/models/i-pagination-model';
import { AccountEntity } from 'src/data-access/entities/account-entity';
import { AccountTypeEntity } from 'src/data-access/entities/account-type-entity';
import { CustomerEntity } from 'src/data-access/entities/customer-entity';
import { AccountService } from 'src/business-logic/services/account/account.service';
import { CustomerService } from 'src/business-logic/services/customer/customer.service';

@Controller('account')
export class AccountController {

    constructor(private readonly accountService : AccountService,
        private readonly customerService : CustomerService){}
    
    
    //FUNCA
    @Post('/create')
    createAccount(@Body() account: AccountDTO): AccountEntity {
        return this.accountService.createAccount(account);
    }
    

    //MUESTRO LAS CUENTAS DE UN USUARIO
    @Get('/get-account-by-customer-id')
    getAccountByCostumerId(@Query('customer') customer: string): AccountEntity[] {
        return this.accountService.getAccountByCustomerId(customer);
    }

    //MUESTRO EL BALANCE DE UNA CUENTA SEGUN ID DE LA CUENTA
    @Get('/get-balance')
    getBalance(@Query('account') account: string): string {
        return this.accountService.getBalance(account).toString();
    }

    //DEPOSITAR DINERO EN UNA CUENTA SEGUN ID DE LA CUENTA
    @Post('addBalance/:id/:amount')
    addBalance(@Param('id', ParseUUIDPipe) accountId: string,@Param('amount', ParseFloatPipe) amount: number): void {
        return this.accountService.addBalance(accountId, amount);
    }

    //REMUEVE SALDO DE UNA CUENTA
    @Post('removebalance/:id/:amount')
    removeBalance(@Param('id') accountId: string, @Param('amount', ParseFloatPipe) amount: number): void {
        return this.accountService.removeBalance(accountId, amount);
    }


    @Delete('/soft-delete/:accountId')
    softDeleteAccount(@Param() accountId: string): void {
        this.accountService.deleteAccount(accountId, true);
    }

    @Delete('/hard-delete/:accountId')
    hardDeleteAccount(@Param() accountId: string): void {
        this.accountService.deleteAccount(accountId);
    }

    @Patch('/change-account-type/:accountId')
    changeAccountType(@Param() accountId: string,@Body() accountTypeId: string): AccountEntity {
        return this.changeAccountType(accountId, accountTypeId);
    }

    @Patch('/change-state/:accountId')
    changeState(accountId: string, state: boolean) {
        this.accountService.changeState(accountId, state);
    }

    @Post('/remove-all-balance/:accountId')
    removeAllBalance(@Param() accountId: string): void {
        return this.accountService.removeBalance(accountId, 0);
    }

    

    /*
    METODOS POR IMPLEMENTAR
    ***********************

    @Put('/update/:accountId')
    updateAccount(@Param() accountId: string, @Body() newAccount: AccountDTO): AccountEntity {
        return this.accountService.updateAccount(accountId, newAccount);
    }


    @Get('/account-type/:accountId')
    getAccountType(@Param() accountId: string): AccountTypeEntity {
        return this.accountService.getAccountType(accountId);
    }


    @Get('/state/:accountId')
    getState(@Param() accountId: string): boolean {
        return this.accountService.getState(accountId);
    }
    
    
    
    */ 


}    




