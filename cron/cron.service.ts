import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppService } from 'src/app.service';

@Injectable()
export class CronService {
  constructor(private appService: AppService) {}

  @Cron('* * * * *')
  handleCron() {
    console.log(`Called on ${new Date()}, runs on every minute`);
  }
}
