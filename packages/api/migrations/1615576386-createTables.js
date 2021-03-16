exports.up = async (sql) => {
  await sql`CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
		username VARCHAR (50) NOT NULL,
    email VARCHAR (50) NOT NULL,
		password TEXT NOT NULL
	)`;

  await sql`CREATE TABLE projects (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(70) NOT NULL,
    subtitle VARCHAR(70),
    description TEXT,
		user_id INT REFERENCES users (id)
	)`;

  await sql`CREATE TABLE cell_types (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
		name VARCHAR (20)
	)`;

  await sql`CREATE TABLE cellsData (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
		data TEXT,
    order_of_cells TEXT,
		project_id INT REFERENCES projects(id),
		cell_type_id INT REFERENCES cell_types(id)
	)`;

  await sql`CREATE TABLE sessions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
		token VARCHAR(50),
		expiry_timestamp TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '72 hours',
		user_id INT REFERENCES users(id) ON DELETE CASCADE
	)`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE IF EXISTS sessions CASCADE`;
  await sql`DROP TABLE IF EXISTS cellsData CASCADE`;
  await sql`DROP TABLE IF EXISTS cell_types CASCADE`;
  await sql`DROP TABLE IF EXISTS projects CASCADE`;
  await sql`DROP TABLE IF EXISTS users CASCADE`;
};
