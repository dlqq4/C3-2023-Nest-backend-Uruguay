import { Injectable } from '@nestjs/common';
import { IAccountModel } from 'src/models/i-account-model';
import { AccountEntity } from 'src/persistence/entities/account-entity';
import { AccountTypeEntity } from 'src/persistence/entities/account-type-entity';
import { AccountRepository } from 'src/persistence/repositories/AccountRepo';
import { AccountTypeRepository } from 'src/persistence/repositories/TypeAccountRepo';

@Injectable()
export class AccountService {


    constructor(private readonly  accountRepository : AccountRepository,
                private readonly accountTypeRepository : AccountTypeRepository){
    }

    /**
   * Crear una cuenta
   *
   * @param {AccountModel} account
   * @return {*}  {AccountEntity}
   * @memberof AccountService
   */
  createAccount(account: IAccountModel): AccountEntity {
    const newAccount = new AccountEntity();
    newAccount.customerId = account.customerId;
    newAccount.accountTypeId = account.accountTypeId;
    return this.accountRepository.register(newAccount);
  }

  /**
   * Obtener el balance de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {number}
   * @memberof AccountService
   */
  getBalance(accountId: string): number {
    return this.getAccount(accountId).balance;
  }

  /**
   * Agregar balance a una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  addBalance(accountId: string, amount: number): void {
    const account = this.getAccount(accountId);
    account.balance += amount;

    this.accountRepository.update(accountId , account);
  }

  /**
   * Remover balance de una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  removeBalance(accountId: string, amount: number, removeAll?: boolean): void {

    if(this.verifyAmountIntoBalance(accountId, amount)) throw new Error('Not enough funds');

    if(removeAll) this.cleanBalance(accountId);

    const account = this.getAccount(accountId);
    account.balance -= amount;

    this.accountRepository.update(accountId , account);
  }

  private cleanBalance(accountId: string): number {
    return this.getAccount(accountId).balance = 0; 
  }

  /**
   * Verificar la disponibilidad de un monto a retirar en una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  verifyAmountIntoBalance(accountId: string, amount: number): boolean {
    if(this.getAccount(accountId).balance < amount) {
        return true
    }

    return false;
  }

  /**
   * Obtener el estado de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  getState(accountId: string): boolean {
    return this.getAccount(accountId).state;
  }

  /**
   * Cambiar el estado de una cuenta
   *
   * @param {string} accountId
   * @param {boolean} state
   * @memberof AccountService
   */
  changeState(accountId: string, state: boolean): void {
    this.getAccount(accountId).state = state;
  }

  /**
   * Obtener el tipo de cuenta de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  getAccountType(accountId: string): AccountTypeEntity {
    return this.getAccount(accountId).accountTypeId;
  }

  /**
   * Cambiar el tipo de cuenta a una cuenta
   *
   * @param {string} accountId
   * @param {string} accountTypeId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  changeAccountType(
    accountId: string,
    accountTypeId: string,
  ): AccountTypeEntity {
    const account = this.getAccount(accountId);
    account.accountTypeId = this.accountTypeRepository.findOneById(accountTypeId);

    return account.accountTypeId;
  }

  /**
   * Borrar una cuenta
   *
   * @param {string} accountId
   * @memberof AccountService
   */
  deleteAccount(accountId: string, soft?: boolean): void {
    if(soft) this.accountRepository.delete(accountId, soft);
    
    this.accountRepository.delete(accountId);
  }

  private getAccount(accountId: string): AccountEntity {
    return this.accountRepository.findOneById(accountId);
  }


}
