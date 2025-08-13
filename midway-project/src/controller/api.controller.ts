// src/controller/api.controller.ts
import { Body, Controller, Inject, Post} from '@midwayjs/core';
import { UserService } from '../service/user.service';

@Controller('/api')
export class APIController {
  @Inject()
  userService: UserService;

  // 注册接口
  @Post('/register')
  async register(@Body() body) {
    try {
      const { username, password } = body;
      const user = await this.userService.registerUser(username, password);
      return { success: true, message: '注册成功', data: user };
    } catch (error) {
      console.error('注册用户时服务错误:', error);

      // 使用错误码判断
      if (error?.code === 'SQLITE_CONSTRAINT' || error?.errno === 19) {
        return { success: false, message: '用户名已存在' };
      }

      return { success: false, message: error.message };
    }
  }

  // 登录接口
  @Post('/login')
  async login(@Body() body) {
    try {
      const { username, password } = body;
      const user = await this.userService.loginUser(username, password);
      return { success: true, message: '登录成功', data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
