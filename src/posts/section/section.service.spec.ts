import { Test, TestingModule } from '@nestjs/testing';
import { SectionService } from './section.service';
import { getModelToken } from '@nestjs/mongoose';

const sectionModel = {
  title: 'Title',
};

describe('SectionService', () => {
  let service: SectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionService,
        {
          provide: getModelToken('Section'),
          useValue: sectionModel,
        },
      ],
    }).compile();

    service = module.get<SectionService>(SectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
