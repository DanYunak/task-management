import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Task } from '../tasks/task.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    // one user to many tasks
    @OneToMany(type => Task, task => task.user, { eager: true }) // eager: true means that whenever you fetch the user, you are also going to fetch the tasks with it
    tasks: Task[]
}