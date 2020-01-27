const permissions = {
  'getUsers': {
    all: ['head-trainer'],
    read: ['trainee', 'trainer'],
    write: ['trainer'],
    delete: []
  }
}

//list of users
const users = [
  {
    traineeEmail: 'trainee1@successive.tech',
    reviewerEmail: 'reviewer1@successive.tech',
  }
]

export { users, permissions };
