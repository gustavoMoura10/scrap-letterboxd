import { Test, TestingModule } from '@nestjs/testing';
import { OkrussiaService } from './okrussia.service';

describe('OkrussiaService', () => {
  let service: OkrussiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OkrussiaService],
    }).compile();

    service = module.get<OkrussiaService>(OkrussiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
