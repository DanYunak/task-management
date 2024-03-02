import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersRepository } from './users.repository'
import { AuthCredentialsDto } from './dto/authCredentials.dto'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwtPayload.interface'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService
    ) { }

    async getUsers(): Promise<User[]> {
        return this.usersRepository.getUsers()
    }

    async signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
        return this.usersRepository.createUser(authCredentialDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto

        const user = await this.usersRepository.findOneBy({ username })

        const isPasswordEquals = await bcrypt.compare(password, user.password)

        if (user && isPasswordEquals) {
            const payload: JwtPayload = { username }
            const accessToken: string = await this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException('Please check your login credentials')
        }

    }
}