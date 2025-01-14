import { HTTPError } from '../types';
import { 
  StatusCodes as STATUS_CODES, 
  getReasonPhrase 
} from 'http-status-codes';


export function extractErrorMessage(error: Error | any): string {
  return error instanceof Error ? error.message : String(error);
}



export function createHTTPError(
  statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
  message: string = getReasonPhrase(STATUS_CODES.INTERNAL_SERVER_ERROR)  
): HTTPError {
  const error = new Error(message) as HTTPError;
  error.statusCode = statusCode;
  return error;
}



export function sanitizeUserAndFormat(user: any) {
  const requiredFields = [
    '_id', 'username', 'fullName', 'email',
    'followers', 'following', 'profileImgURL',
    'coverImgURL', 'bio', 'link'
  ];
  const message = `The provided user data is invalid and cannot be formatted or sanitized.`;

  if (typeof user !== 'object' || user === null || Array.isArray(user)) {
    throw new Error(message);
  }

  let { password:_, ...userFields } = user;
  userFields = Object.keys(userFields);

  if (requiredFields.toString() !== userFields.toString()) {
    throw new Error(message);
  }

  return {
    _id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    followers: user.followers,
    following: user.following,
    profileImgURL: user.profileImgURL,
    coverImgURL: user.coverImgURL,
    bio: user.bio,
    link: user.link
  }
}