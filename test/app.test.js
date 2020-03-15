const app = require("../app");
const { expect } = require("chai");
const supertest = require("supertest");

describe("GET /books test", () => {
  it("Should display array of books", () => {
    return supertest(app)
      .get("/books")
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf.at.least(1);
        const book = res.body[0];
        expect(book).to.include.all.keys(
          "bestsellers_date", "author", "description", "title"
        );
      });
  })

  it("Should be 400 if sort is incorrect", () => {
    return supertest(app)
      .get("/books")
      .query({ sort: "MISTAKE" })
      .expect(400, "Sort must be one of the title or rank");
  });

  it("Should sort by title", () => {
    return supertest(app)
      .get("/books")
      .query({ sort: "title" })
      .expect(200)
      .expect("Content-Type", /json/)
      .then(res => {
        expect(res.body).to.be.an("array");
        let sorted = true;

        let i = 0;
        while (i < res.body.length - 1) {
          const bookAtI = res.body[i];
          const bookAtIPlus1 = res.body[i + 1];
          if (bookAtIPlus1.title < bookAtI.title) {
            sorted = false;
            break;
          }
          i++;
        }
        expected(sorted).to.be.true;
      });
  });
});