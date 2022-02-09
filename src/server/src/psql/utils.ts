import { Knex } from 'knex';

const addUpdateTrigger = (table: string) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `;

function createTable(
  knex: Knex,
  tableName:string,
  callback: (table: Knex.CreateTableBuilder) => void,
) {
  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    callback(table);
  });
}

export { addUpdateTrigger, createTable };
