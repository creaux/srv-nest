import { Test, TestingModule } from '@nestjs/testing';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

describe('Access Controller', () => {
  let controller: AccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessController],
      providers: [
        {
          provide: AccessService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AccessController>(AccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
