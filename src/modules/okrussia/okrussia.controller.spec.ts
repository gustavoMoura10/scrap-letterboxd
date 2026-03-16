import { Test, TestingModule } from '@nestjs/testing';
import { OkrussiaController } from './okrussia.controller';

describe('OkrussiaController', () => {
  let controller: OkrussiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OkrussiaController],
    }).compile();

    controller = module.get<OkrussiaController>(OkrussiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
