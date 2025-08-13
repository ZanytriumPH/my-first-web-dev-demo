import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // 类装饰器：声明这是一个数据库实体类
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'real', default: 100 })
  balance: number;
}
