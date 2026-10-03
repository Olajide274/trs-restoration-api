// @ts-nocheck
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/prisma';

describe('Jobs API', () => {
  beforeEach(async () => {
    await prisma.statusHistory.deleteMany();
    await prisma.job.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const validJobPayload = {
    customerName: 'Test User',
    customerEmail: 'test@example.com',
    propertyAddress: '100 Test Street',
    damageType: 'WATER',
    damageDescription: 'Test water damage',
    squareFeet: 300,
  };

  async function createJob(overrides: Partial<typeof validJobPayload> = {}) {
    const res = await request(app)
      .post('/jobs')
      .send({ ...validJobPayload, ...overrides });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');

    return res;
  }

  // ---------- CREATE ----------
  it('should create a job with valid data', async () => {
    const res = await createJob();

    expect(res.body.data.status).toBe('NEW');
    expect(res.body.data.estimatedCost).toBe(0);
  });

  it('should fail when required fields are missing', async () => {
    const res = await request(app)
      .post('/jobs')
      .send({
        customerName: 'Test User',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail with invalid damageType', async () => {
    const res = await request(app)
      .post('/jobs')
      .send({
        ...validJobPayload,
        damageType: 'FLOOD',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // ---------- RETRIEVE ----------
  it('should return an existing job', async () => {
    const createRes = await createJob();
    const createdJobId = createRes.body.data.id;

    const res = await request(app).get(`/jobs/${createdJobId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdJobId);
  });

  it('should return 404 for non-existent job', async () => {
    const res = await request(app).get('/jobs/JOB-999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // ---------- STATUS UPDATE ----------
  it('should allow valid status transition', async () => {
    const createRes = await createJob();
    const createdJobId = createRes.body.data.id;

    const res = await request(app)
      .patch(`/jobs/${createdJobId}/status`)
      .send({ status: 'INSPECTION' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('INSPECTION');
  });

  it('should reject invalid status transition', async () => {
    const createRes = await createJob();
    const createdJobId = createRes.body.data.id;

    const res = await request(app)
      .patch(`/jobs/${createdJobId}/status`)
      .send({ status: 'COMPLETED' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid status value', async () => {
    const createRes = await createJob();
    const createdJobId = createRes.body.data.id;

    const res = await request(app)
      .patch(`/jobs/${createdJobId}/status`)
      .send({ status: 'INVALID_STATUS' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // ---------- ESTIMATE ----------
  it('should calculate estimated cost correctly', async () => {
    const createRes = await createJob();
    const createdJobId = createRes.body.data.id;

    const res = await request(app)
      .post(`/jobs/${createdJobId}/estimate`)
      .send({
        laborCost: 1000,
        materialCost: 1500,
        equipmentCost: 500,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.estimatedCost).toBe(3000);
  });

  it('should reject negative costs', async () => {
    const createRes = await createJob();
    const createdJobId = createRes.body.data.id;

    const res = await request(app)
      .post(`/jobs/${createdJobId}/estimate`)
      .send({
        laborCost: -100,
        materialCost: 1500,
        equipmentCost: 500,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});