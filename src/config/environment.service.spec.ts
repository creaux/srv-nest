import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from './environment.service';
import { ConfigService } from './config.service';
import { CONFIG_ACCESSORS } from './config.accessors';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentService,
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: CONFIG_ACCESSORS,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EnvironmentService>(EnvironmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
