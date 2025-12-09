import { TypegooseModuleOptions } from '@m8a/nestjs-typegoose';
import { ConfigService } from '@nestjs/config';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
  };
};

const getMongoString = (configService: ConfigService) => {


  const user = configService.get<string>('MONGO_DB_USER');
  const pass = configService.get<string>('MONGO_DB_PASS');
  const ext = configService.get<string>('MONGO_DB_EXTENSION');
  const dbName = configService.get<string>('MONGO_DB_NAME');
  const appName = configService.get<string>('MONGO_DB_APP_NAME');

  if (!user || !pass || !ext || !dbName) {
    console.log('?');
    throw new Error('❌ Missing MongoDB environment variables');
  }

  return `mongodb+srv://${user}:${pass}@${ext}/${dbName}?appName=${appName}&tls=true&w=majority`;
};

