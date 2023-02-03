import { IsString, IsNumber, IsPositive, IsNotEmpty, Min, IsDate } from 'class-validator';
export class CreateTransferDTO {

    @IsString({message: 'OutCome: Id String Requiered'})
    outcome: string;
    
    @IsString({message: 'Income: Id String Requiered'})
    income: string;
    
    @IsNumber(undefined, { message: "Not a valid format."})
    @IsNotEmpty({ message: "This slot must not be empty."})
    @IsPositive({ message: "Needs a positive value."})
    @Min(1, { message: "The minimun value is 1."})
    amount: number;

    @IsString({message: 'Reason: Id String Requiered'})
    reason: string;

    /*
    @IsDate({ message: "Not a valid format."})
    @IsNotEmpty({ message: "This slot must not be empty."})
    dateTime: Date;
    */

}