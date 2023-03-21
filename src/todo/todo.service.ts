import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  /**
   * 該当するuserIdのだけのタスクの一覧を取得
   * @param userId
   * @returns
   */
  getTasks(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 特定のタスクだけを取得
   * @param userId
   * @param taskId
   * @returns
   */
  getTaskById(userId: number, taskId: number): Promise<Task> {
    return this.prisma.task.findFirst({
      where: {
        userId,
        id: taskId,
      },
    });
  }

  /**
   * タスクを作成
   * @param userId
   * @param dto
   * @returns
   */
  async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        userId,
        ...dto,
      },
    });
    return task;
  }

  /**
   * タスクを更新
   * @param userId
   * @param taskId
   * @param dto
   * @returns
   */
  async updateTaskById(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if ((!task || task.userId) !== userId) {
      throw new ForbiddenException('No Permision to update');
    }
    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
  }

  /**
   * タスクを削除
   * @param userId
   * @param taskId
   */
  async deleteTaskById(userId: number, taskId: number): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if ((!task || task.userId) !== userId) {
      throw new ForbiddenException('No Permision to update');
    }
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
