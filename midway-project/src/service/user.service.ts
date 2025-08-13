import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs'; // 修改这里

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  async registerUser(username: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User();
      user.username = username;
      user.password = hashedPassword;
      return this.userModel.save(user);
    } catch (error) {
      // 更精确的错误处理
      if (error instanceof QueryFailedError) {
        // 检查 SQLite 的唯一约束错误
        if (error.message.includes('SQLITE_CONSTRAINT') &&
          error.message.includes('UNIQUE constraint failed: user.username')) {
          throw new Error('用户名已存在');
        }

        // 检查其他数据库的唯一约束错误格式
        if (error.message.includes('UNIQUE constraint failed: user.username')) {
          throw new Error('用户名已存在');
        }
      }

      // 如果不是唯一约束错误，重新抛出原始错误
      throw error;
    }
  }

  async loginUser(username: string, password: string) {
    const user = await this.userModel.findOne({ where: { username } });
    if (!user) throw new Error('用户不存在');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('密码错误');

    return user;
  }
}
