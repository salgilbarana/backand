/**
 * 기본 레포지토리 클래스.
 * 레포지토리 확장시 상속해서 사용할 것.
 */
class Repository {
  constructor(model) {
    this.model = model;
  }

  /**
   * @param {*} entity 엔티티
   */
  async build(entity) {
    return this.model.build(entity);
  }

  /**
   * @param {*} entity 엔티티
   */
  async createOne(entity) {
    return this.model.create(entity);
  }

  /**
   * @param {*} seq PK 인덱스 번호
   */
  async findOneByPk(seq) {
    return this.model.findByPk(seq);
  }

  /**
   * @param {*} clauses 조건
   */
  async findOne(clauses = {}) {
    return this.model.findOne(clauses);
  }

  /**
   * @param {*} clauses 조건
   * @param {*} entity 존재하지 않을 경우, 생성할 엔티티
   */
  async findOrCreate(clauses = {}, entity = {}) {
    return this.model.findOrCreate({ ...clauses, defaults: entity });
  }

  /**
   * @param {*} clauses 조건
   */
  async findAll(clauses = {}) {
    return this.model.findAll(clauses);
  }

  /**
   * @param {*} clauses 조건
   */
  async deleteOne(clauses = {}) {
    return this.model.destroy(clauses);
  }

  /**
   * 단일 업데이트
   * @param {*} updateClause 업데이트 쿼리
   * @param {*} whereClause 조건
   */
  async updateOne(updateClause = {}, whereClause = {}) {
    return this.model.update(updateClause, whereClause);
  }
}

module.exports = Repository;
