import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { registerDecorator } from 'class-validator';
import { TransferEntity } from 'src/data-access/entities/transfer-entity';
import { TransferService } from 'src/business-logic/services/transfer/transfer.service';
import { PaginationModel } from 'src/data-access/models/i-pagination-model';
import { CreateTransferDTO } from 'src/business-logic/dtos/create-transfer-dto';

@Controller('transfer')
export class TransferController {
    constructor(private readonly transferService: TransferService) {}


    @Post('/createtransfer')
    createTransfer(@Body() transfer: CreateTransferDTO ): TransferEntity {
        return this.transferService.createTransfer(transfer);
    }


}