import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { UserService } from '../../src/service/user.service';

describe('test/controller/api.controller.test.ts', () => {
  let app;
  let request;
  const testUsername = 'testUser';

  // 声明服务和Repository
  let userService: UserService;
  let userRepository;

  beforeAll(async () => {
    // 创建应用实例
    app = await createApp<Framework>();
    request = createHttpRequest(app);

    // 获取服务实例
    userService = await app.getApplicationContext().getAsync(UserService);

    // 通过服务获取Repository实例
    userRepository = userService.userModel;

    // 清理可能存在的测试用户
    await userRepository.delete({ username: testUsername });
  });

  afterAll(async () => {
    // 清理测试数据
    await userRepository.delete({ username: testUsername });

    // 关闭应用
    await close(app);
  });

  // 注册-正常
  it('should register a new user', async () => {
    const username = testUsername;
    const password = 'testPassword';

    const result = await request
      .post('/api/register')
      .send({ username, password })
      .expect(200);

    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe('注册成功');
    expect(result.body.data.username).toBe(username);
  });

  // 注册-"用户名已存在"
  it('should fail to register when user already exists', async () => {
    const username = testUsername;
    const password = 'testPassword';

    const result = await request
      .post('/api/register')
      .send({ username, password })
      .expect(200);

    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe('用户名已存在');
  });

  // 登录-正常
  it('should login an existing user', async () => {
    const username = testUsername;
    const password = 'testPassword';
    const result = await request
      .post('/api/login')
      .send({ username, password })
      .expect(200);

    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe('登录成功');
    expect(result.body.data.username).toBe(username);
  });

  // 登录-"用户不存在"
  it('should fail to login when user does not exist', async () => {
    const username = '智能软件与工程学院';
    const password = 'testPassword';
    const result = await request
      .post('/api/login')
      .send({ username, password })
      .expect(200);

    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe('用户不存在');
  });

  // 登录-"密码错误"
  it('should fail to login when password is incorrect', async () => {
    const username = testUsername;
    const password = 'wrongPassword';
    const result = await request
      .post('/api/login')
      .send({ username, password })
      .expect(200);

    expect(result.body.success).toBe(false);
    expect(result.body.message).toBe('密码错误');
  });
});
