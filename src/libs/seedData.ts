import { UserRepository } from '../repositories';

const userRepository = new UserRepository();

async function userSeedData() {
  const user = {
    name: 'Vinay',
    role: 'head-trainer',
    address: 'Noida',
    dob: new Date('01-01-1993'),
    email: 'vinay@successive.tech',
    mobileNumber: '1231231230',
    hobbies: ['Traveling']
  };

  try {
    if ( await userRepository.counts() === 0)
      await userRepository.create(user, 'seed');
  } catch (err) {
    console.error(err);
  }
}

export default userSeedData;
