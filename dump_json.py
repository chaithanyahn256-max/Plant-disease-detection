import mysql.connector
import json

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'greenguard_db',
    'port': 3306
}

with mysql.connector.connect(**db_config) as conn:
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = [t[0] for t in cursor.fetchall()]
    schema = {}
    for t in tables:
        cursor.execute(f"DESCRIBE `{t}`")
        schema[t] = [f"{col[0]}({col[1]})" for col in cursor.fetchall()]
        
    with open('schema.json', 'w') as f:
        json.dump(schema, f, indent=4)
