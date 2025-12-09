import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
   
    {
      provide: AuthService, 
      useValue: {           
        validateUser: jest.fn(() => ({ id: 1, name: 'Test' })), 
        login: jest.fn(() => ({ access_token: 'xyz' })),
      },
    },
  ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
