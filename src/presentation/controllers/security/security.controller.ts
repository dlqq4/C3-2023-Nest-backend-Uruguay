import { Controller, Post, Body } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { SecurityService } from '../../../business-logic/services/security/security.service';
import { SignInDto } from 'src/business-logic/dtos/sign-in-dto';
import { SignUpDto } from 'src/business-logic/dtos/sign-up-dto';

@Controller('security')
export class SecurityController {

    constructor(private readonly securityService: SecurityService) {}

    @Post('/singIn')
    singIn(@Body() user: SignInDto): string {
        return this.securityService.signIn(user);
    }

    @Post('/singUp')
    singUp(@Body() user: SignUpDto) :string{
        return this.securityService.signUp(user);
    }

    @Post('/singOut/:JWToken')
    singOut(@Param('JWToken') JWToken: string): void {
        this.securityService.signOut(JWToken);
    }
}