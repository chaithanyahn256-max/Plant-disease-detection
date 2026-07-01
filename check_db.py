import mysql.connector
from mysql.connector import Error

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'greenguard_db',
    'port': 3306
}

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("Tables in greenguard_db:")
    for table in tables:
        print(f"- {table[0]}")
        
    for table in tables:
        print(f"\nSchema for {table[0]}:")
        cursor.execute(f"DESCRIBE {table[0]}")
        for row in cursor.fetchall():
            print(row)

except Error as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()
