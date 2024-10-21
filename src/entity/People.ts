import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Account } from './Account'

@Entity()
export class People {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'varchar', length: 14, unique: true })
  document: string

  @CreateDateColumn()
  createdAt: Date // Esse "Date" pode dar problema!

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Account, (account) => account.person)
  accounts: Account[]
}
