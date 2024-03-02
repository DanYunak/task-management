import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TaskStatus } from './taskStatus.enum'
import { User } from '../auth/user.entity'
import { Exclude } from 'class-transformer'

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    status: TaskStatus

    // many tasks for one user
    @ManyToOne(type => User, user => user.tasks, { eager: false })
    @Exclude({ toPlainOnly: true }) // whenever you return the json response, you are going to exclude the user property (object with passoword and other sensitive information)
    user: User
}