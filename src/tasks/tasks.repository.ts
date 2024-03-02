import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { Repository } from 'typeorm'
import { CreateTaskDto } from './dto/createTask.dto'
import { TaskStatus } from './taskStatus.enum'
import { GetTasksFilterDto } from './dto/getTasksFilter.dto'
import { User } from '../auth/user.entity'

@Injectable()
export class TasksRepository extends Repository<Task> {
    private logger = new Logger('TasksRepository')

    constructor(
        @InjectRepository(Task)
        repository: Repository<Task>
    ) {
        super(repository.target, repository.manager, repository.queryRunner)
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto

        const query = this.createQueryBuilder('task')

        query.where({ user })

        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` } // % means not exactly word
            )
        }

        try {
            const tasks = await query.getMany()
            return tasks
        } catch (e) {
            this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`)
            throw new InternalServerErrorException()
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        })

        await this.save(task)

        return task
    }
}