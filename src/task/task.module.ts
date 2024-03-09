import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './models/task.model';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [SequelizeModule.forFeature([Task]), GroupModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
