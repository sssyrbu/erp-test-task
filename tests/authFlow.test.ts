import request from 'supertest';
import app from '../src/app';

const credentials = { id: 'user@example.com', password: 'Passw0rd!' };

describe('Authentication and files API', () => {
  test('allows user signup, refresh, file lifecycle, and logout', async () => {
    const signupResponse = await request(app).post('/signup').send(credentials).expect(201);
    expect(signupResponse.body.accessToken).toBeDefined();
    expect(signupResponse.body.refreshToken).toBeDefined();

    const infoResponse = await request(app)
      .get('/info')
      .set('Authorization', `Bearer ${signupResponse.body.accessToken}`)
      .expect(200);
    expect(infoResponse.body.id).toEqual(credentials.id);

    const uploadResponse = await request(app)
      .post('/file/upload')
      .set('Authorization', `Bearer ${signupResponse.body.accessToken}`)
      .attach('file', Buffer.from('hello world'), 'greeting.txt')
      .expect(201);

    expect(uploadResponse.body.originalName).toEqual('greeting.txt');

    const listResponse = await request(app)
      .get('/file/list?list_size=5&page=1')
      .set('Authorization', `Bearer ${signupResponse.body.accessToken}`)
      .expect(200);

    expect(listResponse.body.meta.total).toBe(1);

    const refreshResponse = await request(app)
      .post('/signin/new_token')
      .send({ refreshToken: signupResponse.body.refreshToken })
      .expect(200);

    expect(refreshResponse.body.accessToken).not.toEqual(signupResponse.body.accessToken);

    await request(app)
      .get('/logout')
      .set('Authorization', `Bearer ${refreshResponse.body.accessToken}`)
      .expect(204);

    await request(app)
      .get('/info')
      .set('Authorization', `Bearer ${refreshResponse.body.accessToken}`)
      .expect(401);
  });

  test('revokes only the session that logs out', async () => {
    const firstSession = await request(app).post('/signup').send(credentials).expect(201);
    const secondSession = await request(app).post('/signin').send(credentials).expect(200);

    await request(app)
      .get('/logout')
      .set('Authorization', `Bearer ${firstSession.body.accessToken}`)
      .expect(204);

    await request(app)
      .get('/info')
      .set('Authorization', `Bearer ${firstSession.body.accessToken}`)
      .expect(401);

    await request(app)
      .get('/info')
      .set('Authorization', `Bearer ${secondSession.body.accessToken}`)
      .expect(200);
  });
});

