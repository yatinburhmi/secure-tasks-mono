import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('healthCheck', () => {
    it('should return a health check object with status, message, and timestamp', () => {
      const appController = app.get<AppController>(AppController);
      const healthResponse = appController.healthCheck();
      expect(healthResponse).toHaveProperty('status', 'success');
      expect(healthResponse).toHaveProperty('message', 'API is healthy');
      expect(healthResponse).toHaveProperty('timestamp');
      expect(typeof healthResponse.timestamp).toBe('string'); // Check if timestamp is a string (ISO date)
    });
  });
});
