import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryService } from './mongo-memory.service';
import { MONGO_MEMORY_CONFIG } from './mongo-memory.config';
import { MONGO_MEMORY } from './mongo-memory.dependecy';

describe('MemoryService', () => {
  let service: MongoMemoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoMemoryService,
        {
          provide: MONGO_MEMORY,
          useValue: class {},
        },
        {
          provide: MONGO_MEMORY_CONFIG,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MongoMemoryService>(MongoMemoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
