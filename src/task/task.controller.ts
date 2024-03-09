import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/decorators/set-public.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create new Task' })
  @Roles(Role.ADMIN, Role.TEACHER)
  @Post('create')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @ApiOperation({ summary: 'Get all Tasks' })
  @Roles(Role.ADMIN)
  @Get('all')
  findAllTasks() {
    return this.taskService.findAllTasks();
  }

  @ApiOperation({ summary: 'Get single Task' })
  @Get(':id')
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOneTask(id);
  }

  @ApiOperation({ summary: 'Update Task' })
  @Roles(Role.ADMIN, Role.TEACHER)
  @Put(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete Task' })
  @Roles(Role.ADMIN, Role.TEACHER)
  @Delete(':id')
  removeTaks(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.removeTask(id);
  }
}
