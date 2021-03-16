const cellTypes = [{ name: 'code' }, { name: 'text' }, { name: 'sketch' }];

exports.up = async (sql) => {
  await sql`INSERT INTO cell_types ${sql(cellTypes, 'name')}
	`;
};

exports.down = async (sql) => {
  for (const cellType of cellTypes) {
    await sql`
  	DELETE FROM cell_types WHERE name=${cellType.name}
  	`;
  }
};
