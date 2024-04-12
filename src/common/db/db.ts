import mongoose from 'mongoose';

import { env } from '../utils/envConfig';

const connect = async () => {
  await mongoose.connect(env.MONGO_URI);
};

export default { connect };
