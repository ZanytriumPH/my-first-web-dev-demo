// src/middleware/upload.middleware.ts
import { Provide } from '@midwayjs/core';
import multer from 'multer'; // 处理 multipart/form-data 类型请求（主要用于文件上传）的主流库
import { join } from 'path'; // 用于处理和拼接文件路径
import * as fs from "node:fs"; // 用于操作文件和目录

@Provide()
export class UploadMiddleware {
  private upload;

  constructor() {
    // 使用绝对路径并确保目录存在
    const dest = join(process.cwd(), 'public', 'uploads', 'avatar');
    // 确保目录存在
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dest); // 指定文件保存到 dest 目录
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // 指定文件名
      }
    });

    this.upload = multer({
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 10 // 限制文件大小为 10MB
      }
    });
  }

  // 指定当前上传逻辑处理的是 “单个文件”
  single(fieldName: string) {
    return this.upload.single(fieldName);
  }
}
