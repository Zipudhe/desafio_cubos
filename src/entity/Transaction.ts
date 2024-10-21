import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { Account } from './Account'

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  receiver_account: string

  @Column()
  description: string

  @Column({ type: 'money', default: 0 })
  value: string

  @CreateDateColumn()
  createdAt: Date // Esse "Date" pode dar problema!

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account
}
