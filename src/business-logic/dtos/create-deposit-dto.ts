import { IsNumber, IsPositive, IsString, IsDateString, IsDate } from 'class-validator';
export class CreateDepositDTO {

    @IsString({message: 'An Id Number required'})
    account: string;

    @IsNumber(undefined, {message: 'Amount Number required'})
    @IsPositive({message: 'Amount: Positive Number Requiered'})
    amount: number;
  
    @IsDateString()
    @IsDate()
    @IsNumber()
    dateTime?: Date;

}