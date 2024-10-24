import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { People } from './People'

import { Card } from './Card'
import { Transaction } from './Transaction'

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'char', length: 3 })
  branch: string

  @Column({ type: 'char', length: 9, unique: true })
  account: string

  @Column({ type: 'money' })
  balance: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => People, (person) => person.accounts)
  person: People

  @OneToMany(() => Card, (card) => card.account)
  cards: Card[]

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[]
}
