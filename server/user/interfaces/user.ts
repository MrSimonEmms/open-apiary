/**
 * user
 */

/* Node modules */

/* Third-party modules */

/* Files */

export interface IUser {
  id: number;
  name: string;
  emailAddress: string;
  password: string;
  changeOnLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDTO extends Omit<IUser, 'password'>{}

export interface IAuthInputDTO extends Pick<IUser, 'emailAddress' | 'password'>{}

export interface IUserLoginDTO {
  user: IUserDTO;
  token: string;
  expires: Date;
}

export interface IUserTokenPayload {
  id: number;
  emailAddress: string;
}
