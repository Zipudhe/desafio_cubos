import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { Account } from './Account'

export type CardType = 'physical' | 'virtual'

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: ['physical', 'virtual'], default: 'physical' })
  type: CardType

  @Column({ type: 'char', length: 19 })
  number: string

  @Column({ type: 'char', length: 3 })
  cvv: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Account, (account) => account.cards)
  account: Account
}
