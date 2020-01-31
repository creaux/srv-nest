import { Test, TestingModule } from '@nestjs/testing';
import { ConfigFacade } from './config.facade';
import { ConfigService } from './config.service';
import { CONFIG_ACCESSORS } from './config.accessors';

describe('EnvironmentService', () => {
  let service: ConfigFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigFacade,
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

    service = module.get<ConfigFacade>(ConfigFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
