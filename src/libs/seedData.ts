import { UserRepository } from '../repositories';
import { configuration } from '../config';

const userRepository = new UserRepository();

async function userSeedData() {
  const user = {
    name: 'Vinay',
    role: 'head-trainer',
    address: 'Noida',
    dob: new Date('01-01-1993'),
    email: 'vinay@successive.tech',
    mobileNumber: '1231231230',
    hobbies: ['Traveling'],
    password: configuration.password
  };

  try {
    if ( await userRepository.counts() === 0) {
      console.log('Seeding user data');
      await userRepository.create(user, 'seed');
    }
  } catch (err) {
    console.error(err);
  }
}

export default userSeedData;
