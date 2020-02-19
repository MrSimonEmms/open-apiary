/**
 * media
 */

/* Node modules */

/* Third-party modules */

/* Files */
import { IUser } from '../../user/interfaces/user';

export interface IMedia {
  id: number;
  uuid: string;
  originalFileName: string;
  uploadedFileName: string;
  mimeType: string;
  size: number;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}
