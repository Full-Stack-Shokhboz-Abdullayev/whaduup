import { Column, Entity } from 'typeorm';
import { Base } from './base';

@Entity('users')
export class User extends Base {
  @Column({ unique: true })
  username!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;
}
