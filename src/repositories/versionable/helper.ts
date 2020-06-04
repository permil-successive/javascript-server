const ERROR_CODE: number = 422;
const DEFAULT_USER = '000000000000000000000000';

export function getUpdatedInfo(currentUser: string, doneAt: Date = new Date()) {
  if (!currentUser)
    throw new Error('current user is not provided');
  return {
    updatedBy: currentUser,
    updatedAt: doneAt.toISOString(),
  };
}

export function getCreatedInfo(currentUser: string, doneAt: Date = new Date()) {
  if (!currentUser)
    throw new Error('current user is not provided');
  return {
    createdBy: currentUser,
    createdAt: doneAt.toISOString(),
  };
}

export function getDeletedInfo(currentUser: string) {
  if (!currentUser)
    throw new Error('current user is not provided');
  return {
    deletedBy: currentUser,
    deletedAt: new Date(),
  };
}

export function isOperationSuccess(res) {
  if (!res)
    throw {
      message: 'operation not performed',
      code: this.ERROR_CODE
    };
  return true;
}
