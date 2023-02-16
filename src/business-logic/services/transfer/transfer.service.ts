
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransferDTO } from 'src/business-logic/dtos/create-transfer-dto';
import { IDataRangeModel } from 'src/data-access/models/i-data-range-model';
import { PaginationModel } from 'src/data-access/models/i-pagination-model';
import { ITransferModel } from 'src/data-access/models/i-transfer-model';
import { TransferEntity } from 'src/data-access/entities/transfer-entity';
import { TransferRepository } from 'src/data-access/repositories/TransferRepo';
import { AccountService } from '../account';
import { DataRangeDto } from 'src/business-logic/dtos/data-range-dto';

@Injectable()
export class TransferService {
  constructor(private readonly transferRepository: TransferRepository,
              private readonly accountService : AccountService) { }


  //CREA UNA TRANSFERENCIA ENTRE CUENTAS DEL BANCO
  createTransfer(transfer : CreateTransferDTO) : TransferEntity {
    
    const newTransfer = new TransferEntity();
    newTransfer.outcome = this.accountService.removeBalance(transfer.outcome, transfer.amount);
    newTransfer.income = this.accountService.addBalance(transfer.income, transfer.amount);
    newTransfer.amount = transfer.amount;
    newTransfer.reason = transfer.reason;

    return this.transferRepository.register(newTransfer);

  }

  //Traigo todas las transferencias
  findAllTransfer() : TransferEntity[] {
    return this.transferRepository.findAll()
  }


  getHistoryOut(accountId:string, pagination?:PaginationModel,  dataRange?:DataRangeDto ): TransferEntity[] { //dataRange:DataRangeModel
    dataRange = {...{min: 0 ,  max: Date.now()}, ...dataRange}  

    const transferHistory = this.transferRepository.findOutcomeByDataRange(accountId, dataRange.min, dataRange?.max );
    const transfercuentaHistory = transferHistory.filter((account) => account.id === accountId);
    return transfercuentaHistory;
  }


}

