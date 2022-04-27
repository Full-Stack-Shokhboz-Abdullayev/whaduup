import { LoginBody } from "./Login.interface";

export interface RegisterBody extends LoginBody {
  name: string;
}
