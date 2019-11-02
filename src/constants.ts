class Constants {
  static readonly ERROR_INVALID_INPUT = 'Invalid parameter';
  static readonly ERROR_INVALID_CREDENTIAL = 'Invalid email or password';
  static readonly ERROR_INVALID_NEW_PASSWORD = 'New password is invalid';
  static readonly ERROR_USER_NOT_FOUND = 'User not found';
  static readonly ERROR_USER_ALREADY_EXIST = 'USer already exist';
  static readonly ERROR_INVALID_JWT_TOKEN = 'Invalid jwt token';
  static readonly ERROR_UNABLE_TO_CREATE_USER = 'Error while creating user';
  static readonly ERROR_START_AT_DATE = 'startAT is an invalid date format';
  static readonly ERROR_END_AT_DATA = 'endAt is an invalid date format';
  static readonly ERROR_APPOINTMENT_NOT_FOUND = 'Appointment not found';
  static readonly ERROR_APPOINTMENT_NOT_OWN = 'You can only validate your own appointments';
  static readonly ERROR_INVALID_DOCTOR = 'Invalid doctor id';
  static readonly ERROR_UNAUTHORIZED_APPOINTMENT_DELETE = 'You can only delete your own appointments';

  static readonly MESSAGE_USER_CREATED = 'User created';
}

export default Constants;
