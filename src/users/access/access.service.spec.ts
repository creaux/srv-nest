import { Test, TestingModule } from '@nestjs/testing';
import { AccessService } from './access.service';
import { getModelToken } from '@nestjs/mongoose';
import { ACCESS_MODEL } from '@pyxismedia/lib-model';

const accessModel = {
  title: 'Title',
};

describe('AccessService', () => {
  let service: AccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        {
          provide: getModelToken(ACCESS_MODEL),
          useValue: accessModel,
        },
      ],
    }).compile();

    service = module.get<AccessService>(AccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
