import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { Account } from './Account'


type TransactionType = 'credit' | 'debit'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  description: string

  @Column({ type: 'money' })
  value: string

  @Column({ type: 'enum', enum: ['credit', 'debit'] })
  type: TransactionType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account

  @ManyToOne(() => Account, (account) => account.id, { nullable: true })
  receiver_account: Account
}
