import { join } from "path";

export const ENV_FILE_PATH = join(__dirname, "../../../.env");

export const USER_REQUIRED_FIELDS_FOR_FORMAT_AND_SANITIZE = [
  '_id', 'username', 'fullName', 'email',
  'followers', 'following', 'profileImgURL',
  'coverImgURL', 'bio', 'link'
]; 