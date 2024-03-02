import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { AuthCredentialsDto } from './dto/authCredentials.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        repository: Repository<User>
    ) {
        super(repository.target, repository.manager, repository.queryRunner)
    }

    async getUsers(): Promise<User[]> {
        const query = this.createQueryBuilder('user')

        const users = await query.getMany()

        return users
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = this.create({ username, password: hashedPassword })

        try {
            await this.save(user)
        } catch (e) {
            if (e.code === '23505') { // duplicate username
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
}