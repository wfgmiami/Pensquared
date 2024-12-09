module.exports = {
  sql_create_user: `
  INSERT INTO appuser (email, password, user_name) VALUES ($1, crypt($2, gen_salt('bf')),$3) returning *
`,
  sql_find_user: `
  SELECT user_id, user_name FROM appuser WHERE email = $1 AND password = crypt($2, password)

`,
};
