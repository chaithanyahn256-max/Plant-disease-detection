import mysql.connector
import json

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'greenguard_db',
    'port': 3306
}

conn = mysql.connector.connect(**db_config)
c = conn.cursor()

seeds = json.load(open('seeds.json', encoding='utf-8'))
for s in seeds:
    c.execute('''
        INSERT IGNORE INTO products (product_id, name, price, category, description, organic, inStock, image_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (s['id'], s['name'], s['price'], 'Seeds - ' + s['category'], s['description'] + ' ' + s['variety'], 1 if s['organic'] else 0, 1 if s['inStock'] else 0, s['image']))

ferts = json.load(open('fert.json', encoding='utf-8'))
for f in ferts:
    c.execute('''
        INSERT IGNORE INTO products (product_id, name, price, category, description, organic, inStock, image_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (f['id'], f['name'], f['price'], 'Fertilizer', f['description'] + ' NPK: ' + f['npk'], 1 if f['organic'] else 0, 1, f['image']))

conn.commit()
print("Successfully inserted all hardcoded seeds and fertilizers!")
