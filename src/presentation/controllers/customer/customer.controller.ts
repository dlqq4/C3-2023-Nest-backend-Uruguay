import { Body, Controller, Param, Post, Put, Delete, Get, Patch } from '@nestjs/common';
import { UpdateCustomerDTO } from 'src/business-logic/dtos/update-customer-dto';
import { PaginationModel } from 'src/data-access/models/i-pagination-model';
import { CustomerEntity } from 'src/data-access/entities/customer-entity';
import { CustomerService } from 'src/business-logic/services/customer/customer.service';
import { CustomerRepo } from 'src/data-access/repositories/CustomerRepo';

@Controller('customer')
export class CustomerController {

    constructor(private readonly customerService : CustomerService,
                private readonly customerRepo :CustomerRepo ){}
    
    //INFORMACION DEL CUSTOMER SEGUN ID
    @Get('/find/:id')
    getCustomerInfo(@Param('id') id: string) {
        return this.customerService.getCustomerInfo(id);
    }

    //MODIFICAR UN USUARIO
    @Put('/update/:id')
    updateCustomer(@Param('id') id: string ,@Body() newCustomer: UpdateCustomerDTO ): CustomerEntity {
        return this.customerService.updatedCustomer(id, newCustomer);
    }

    //FUNCa
    @Get('/findall')
    findAll(pagination: PaginationModel): CustomerEntity[] {
        return this.customerService.findAll(pagination);
    }

    //TRAIGO POR MAIL
    @Get('/get/:username')
    getCustomerInfoByEmail(@Param('username') username: string) : CustomerEntity{
        return this.customerRepo.findOneByEmail(username);
    }

    @Delete('/softdelete/:id')
    unsuscribe(id: string): void {
        this.customerService.unsuscribe(id);
    }
    @Delete('/harddelete/:id')
    hardDelete(id: string): void {
        this.customerService.unsuscribe(id);
    }

    /*
    @Get('/find-all')
    findAll(pagination: PaginationModel): CustomerEntity[] {
        return this.customerService.findAll(pagination);
    }
    */

    @Patch('/change-state/:id')
    changeState(@Param() id: string, @Body() state: boolean): void {
        this.customerService.changeState(id, state);
    }

}
