import { ReadStream } from 'tty';
import { HTTPError } from '../types';


export function extractErrorMessage(error: Error | any) {
  return error instanceof Error ? error.message : String(error);
}



export function createHTTPError(statusCode: number, message: string): HTTPError {
  const error = new Error(message) as HTTPError;
  error.statusCode = statusCode;
  return error;
}



export function sanitizeUserAndFormat(user: any) {
  return {
    id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profileImgURL: user.profileImgURL,
    coverImgURL: user.coverImgURL,
    bio: user.bio,
    links: user.links
  }
}