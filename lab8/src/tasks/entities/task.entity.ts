import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: 'pending' })
  status: 'pending' | 'in-progress' | 'done';

  @Column({ default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Tag, { onDelete: 'CASCADE' })
  @JoinTable()
  tags: Tag[];
}