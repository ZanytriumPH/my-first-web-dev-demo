import { MidwayConfig } from '@midwayjs/core';
import {User} from "../entity/user.entity";

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1754392846343_9742',
  koa: {
    port: 7001,
  },

  typeorm: {
    dataSource: {
      default: {
        type: 'sqlite',
        database: 'database.sqlite',
        synchronize: true, // 开发环境开启自动同步
        logging: true,
        entities: [
          User
        ],
      }
    }
  }
} as MidwayConfig;
