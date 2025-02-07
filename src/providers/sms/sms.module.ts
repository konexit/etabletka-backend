import { Module, Global } from '@nestjs/common';
import { SMSProvider } from './sms.provider';

@Global()
@Module({
    providers: [SMSProvider],
    exports: [SMSProvider],
})
export class SMSModule { }