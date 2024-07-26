import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './comments/email.service';

@Processor('send-email-queue')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<any>) {
    console.log(`Job ${job.id} started`);
    await this.emailService.sendEmail(
      job.data.to,
      job.data.comment,
      job.data.author,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: any) {
    console.log(error);
    console.log(`Job ${job.id} failed`);
  }
}
