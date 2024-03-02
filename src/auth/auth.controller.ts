import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/authCredentials.dto'
import { User } from './user.entity'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get()
    getUsers(): Promise<User[]> {
        return this.authService.getUsers()
    }

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.signUp(authCredentialsDto)
    }

    @Post('/signin')
    signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto)
    }
}
