import { Answer } from '../../../config/type-orm/entities/answer.entity';
import { Question } from '../../../config/type-orm/entities/question.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  hash: string;

  @Column()
  salt: string;

  @Column({
    default: false,
  })
  isVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Question, (question) => question.user, {
    cascade: true,
  })
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user, {
    cascade: true,
  })
  answers: Answer[];
}
