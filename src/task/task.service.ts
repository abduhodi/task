import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './models/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GroupService } from 'src/group/group.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private readonly taskModel: typeof Task,
    private readonly groupService: GroupService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const { task_title, group_id } = createTaskDto;

    const oldTask = await this.taskModel.findOne({
      where: {
        task_title,
      },
    });
    if (oldTask) {
      throw new BadRequestException('Task exists with this name');
    }

    const group = await this.groupService.findOneGroup(group_id);
    if (!group) {
      throw new BadRequestException('Group does not exist with this name');
    }

    const newTask = await this.taskModel.create({ task_title, group_id });

    return newTask;
  }

  async findAllTasks() {
    return this.taskModel.findAll({});
  }

  async findOneTask(task_id: number) {
    const task = await this.taskModel.findByPk(task_id, { include: ['group'] });
    if (!task) {
      throw new BadRequestException('Task not found');
    }
    return task;
  }

  async updateTask(task_id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findByPk(task_id);
    if (!task) {
      throw new BadRequestException('Task not found');
    }

    Object.defineProperty(updateTaskDto, 'task_id', { enumerable: false });

    const updated = await this.taskModel.update(updateTaskDto, {
      where: { task_id },
      returning: true,
    });

    return updated;
  }

  async removeTask(task_id: number) {
    const task = await this.taskModel.findByPk(task_id);
    if (!task) {
      throw new BadRequestException('Task not found');
    }
    this.taskModel.destroy({ where: { task_id } });
    return { message: 'Delete success' };
  }
}
