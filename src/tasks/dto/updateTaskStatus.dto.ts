import { IsEnum } from 'class-validator'
import { TaskStatus } from '../taskStatus.enum'

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus
}