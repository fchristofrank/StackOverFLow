import mongoose from 'mongoose';
import supertest from 'supertest';
import { app, server } from '../server';
import TagModel from '../models/tags'; // Import the TagModel

// Spy on the TagModel.findOne method
const findOneSpy = jest.spyOn(TagModel, 'findOne');

describe('GET /getTagByName/:name', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
    findOneSpy.mockClear(); // Clear the mock after each test
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    server.close();
  });

  it('should return the tag when found', async () => {
    // Mock a tag object to be returned by the findOne method
    const mockTag = { name: 'exampleTag', description: 'This is a test tag' };
    findOneSpy.mockResolvedValueOnce(mockTag); // Mock a resolved promise with the mockTag object

    // Call the endpoint
    const response = await supertest(app).get('/tag/getTagByName/exampleTag');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTag);
  });

  it('should return 500 if the tag is not found', async () => {
    // Mock findOne to return null to simulate tag not found
    findOneSpy.mockResolvedValueOnce(null); // Mock a resolved promise with null (tag not found)
    const response = await supertest(app).get('/tag/getTagByName/nonExistentTag');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when fetching tag: Error fetching tag');
  });

  it('should return 500 if there is an error fetching the tag', async () => {
    // Mock findOne to throw an error
    findOneSpy.mockRejectedValueOnce(new Error('Error fetching tag'));

    // Call the endpoint
    const response = await supertest(app).get('/tag/getTagByName/errorTag');

    // Assertions
    expect(response.status).toBe(500);
    expect(response.text).toContain('Error when fetching tag: Error fetching tag');
  });
});