import { Test } from '@nestjs/testing';
import { InfluencersModule } from './influencers.module';
import { InfluencersService } from './influencers.service';
import { InfluencersController } from './influencers.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Influencer } from './schemas/influencer.schema';

describe('InfluencersModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [InfluencersModule],
    })
      .overrideProvider(getModelToken(Influencer.name))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
    expect(module.get(InfluencersService)).toBeInstanceOf(InfluencersService);
    expect(module.get(InfluencersController)).toBeInstanceOf(
      InfluencersController,
    );
  });
});
