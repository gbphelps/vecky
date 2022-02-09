import { Knex } from 'knex';

const addUpdateTrigger = (table: string) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `;

async function createTable(
  knex: Knex,
  tableName:string,
  callback: (table: Knex.CreateTableBuilder) => void,
) {
  return knex.schema.createTable(tableName, (table) => {
    // set up uuids
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    // set up timestamps
    table.timestamps(true, true);

    // do whatever else user wants to do
    callback(table);
  }).then(
    // add updater
    () => knex.raw(addUpdateTrigger(tableName)),
  );
}

export { createTable };
