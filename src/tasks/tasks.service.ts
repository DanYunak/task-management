import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateTaskDto } from './dto/createTask.dto'
import { Task } from './task.entity'
import { TasksRepository } from './tasks.repository'
import { TaskStatus } from './taskStatus.enum'
import { GetTasksFilterDto } from './dto/getTasksFilter.dto'
import { User } from '../auth/user.entity'

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository
    ) { }

    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user)
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.tasksRepository.findOneBy({ id, user })

        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`)
        }

        return found
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user)
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.tasksRepository.delete({ id, user })

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`)
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user)

        task.status = status
        await this.tasksRepository.save(task)

        return task
    }
}
