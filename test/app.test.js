const expect = require('chai').expect;
const supertest = require('supertest');

const app = require('../app');

// Sort by App name

describe('App', () => {
  describe('GET /apps', () => {
    // Smoke Test
    it('Should return array of apps', () => {
      return supertest(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          expect(res.body[0]).to.include.keys(
            'Price',
            'Size',
            'Type',
            'App',
            'Genres'
          );
        });
    });

    // Bad endpoint request test
    it('should return 400 if bad endpoint request', () => {
      return supertest(app)
        .get('/apps?genres=tesst')
        .expect(400);
    });

    // Filter by Genre
    it('Should return an array containing all apps matching valid genre', () => {
      return supertest(app)
        .get('/apps')
        .query({ genres: 'action' })
        .expect(200)
        .then(res => {
          expect(res.body).to.have.lengthOf.at.least(1);
        });
    });

    // Sort by App name
    
    it('Sorts by App name', () => {
      return supertest(app)
        .get('/apps')
        .query({ sort: 'app' })
        .expect(200)
        .then(res => {
          let i = 0, sorted = true;
          while (sorted && i < res.body.length - 1) {
            sorted =
                sorted && res.body[i].App < res.body[i + 1].App;
            i = i + 1;
          }
          expect(sorted).to.be.true;
        });
    });

    it('Should sort by Rating', () => {
      return supertest(app)
        .get('/apps')
        .query({ sort: 'rating' })
        .expect(200)
        .then(res => {
          let i = 0, sorted = true;
          while (sorted && i < res.body.length - 1) {
            sorted =
                sorted && res.body[i].Rating >= res.body[i + 1].Rating;
            i = i + 1;
          }
          expect(sorted).to.be.true;
        });
    });
      
  });
});
