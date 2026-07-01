import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import io
import uuid
from PIL import Image
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# -------------------- Database Configuration --------------------
db_config = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'database': os.environ.get('DB_NAME', 'greenguard_db'),
    'port': int(os.environ.get('DB_PORT', 3306))
}

def get_db_connection():
    """Create and return a database connection."""
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"Database connection error: {e}")
        return None

# -------------------- Model Loading --------------------
model_path = 'plant_disease_model.h5'  # assumes model is in same folder
model = load_model(model_path)

# Class names (38 classes)
class_names = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 
               'Apple___healthy', 'Blueberry___healthy', 'Cherry___healthy', 
               'Cherry___Powdery_mildew', 'Corn___Cercospora_leaf_spot Gray_leaf_spot', 
               'Corn___Common_rust', 'Corn___healthy', 'Corn___Northern_Leaf_Blight', 
               'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___healthy', 
               'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Orange___Haunglongbing_(Citrus_greening)', 
               'Peach___Bacterial_spot', 'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 
               'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___healthy', 
               'Potato___Late_blight', 'Raspberry___healthy', 'Soybean___healthy', 
               'Squash___Powdery_mildew', 'Strawberry___healthy', 'Strawberry___Leaf_scorch', 
               'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___healthy', 
               'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 
               'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 
               'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus']

def prepare_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# -------------------- Existing Prediction Endpoint --------------------
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    img_bytes = file.read()
    img_array = prepare_image(img_bytes)
    
    preds = model.predict(img_array)
    predicted_class = int(np.argmax(preds[0]))
    confidence = float(np.max(preds[0]))
    
    def get_severity_for_db(disease_name):
        low = ['healthy', 'scab', 'spot', 'mildew']
        medium = ['blight', 'rust', 'mold', 'canker']
        high = ['late blight', 'wilt', 'virus', 'rot', 'yellow leaf curl']
        name = disease_name.lower()
        if any(keyword in name for keyword in high): return 'High'
        if any(keyword in name for keyword in medium): return 'Medium'
        if any(keyword in name for keyword in low): return 'Low'
        return 'Low'

    # Save image to static folder
    upload_dir = os.path.join(app.root_path, 'static', 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.jpg"
    filepath = os.path.join(upload_dir, filename)
    with open(filepath, 'wb') as f:
        f.write(img_bytes)
    image_url = f"http://127.0.0.1:5000/static/uploads/{filename}"

    # Optionally save scan to database if user is logged in
    # (you'll need to pass user_id from frontend when you implement authentication)
    user_id = request.form.get('user_id', None)
    if user_id:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            try:
                full_class_name = class_names[predicted_class]
                plant_name = full_class_name.split('___')[0]
                disease_name = full_class_name.split('___')[1] if '___' in full_class_name else full_class_name
                severity = get_severity_for_db(disease_name)

                # Insert scan record
                cursor.execute('''
                    INSERT INTO scans (user_id, plant_name, disease_id, confidence, image_url, severity, date)
                    VALUES (%s, %s, %s, %s, %s, %s, CURDATE())
                ''', (
                    user_id,
                    plant_name,
                    predicted_class + 1,
                    confidence,
                    image_url,
                    severity
                ))
                conn.commit()
            except Error as e:
                print(f"Error saving scan: {e}")
            finally:
                cursor.close()
                conn.close()
    
    return jsonify({
        'class': class_names[predicted_class],
        'confidence': confidence
    })

# -------------------- New Database Endpoints --------------------

# Get all products
@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT * FROM products')
        products = cursor.fetchall()
        return jsonify(products)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get a single product by ID
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT * FROM products WHERE product_id = %s', (product_id,))
        product = cursor.fetchone()
        if product:
            return jsonify(product)
        else:
            return jsonify({'error': 'Product not found'}), 404
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Add item to cart
@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    user_id = data.get('user_id')
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not user_id or not product_id:
        return jsonify({'error': 'Missing user_id or product_id'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        # Check if item already in cart
        cursor.execute('''
            SELECT cart_id, quantity FROM cart_items 
            WHERE user_id = %s AND product_id = %s
        ''', (user_id, product_id))
        existing = cursor.fetchone()
        
        if existing:
            # Update quantity
            cursor.execute('''
                UPDATE cart_items 
                SET quantity = quantity + %s 
                WHERE user_id = %s AND product_id = %s
            ''', (quantity, user_id, product_id))
        else:
            # Insert new item
            cursor.execute('''
                INSERT INTO cart_items (user_id, product_id, quantity)
                VALUES (%s, %s, %s)
            ''', (user_id, product_id, quantity))
        
        conn.commit()
        return jsonify({'message': 'Item added to cart successfully'})
    except Error as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get user's cart
@app.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''
            SELECT c.*, p.name, p.price, p.image_url
            FROM cart_items c
            JOIN products p ON c.product_id = p.product_id
            WHERE c.user_id = %s
        ''', (user_id,))
        cart_items = cursor.fetchall()
        return jsonify(cart_items)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Remove item from cart
@app.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    data = request.get_json()
    cart_id = data.get('cart_id')
    
    if not cart_id:
        return jsonify({'error': 'Missing cart_id'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM cart_items WHERE cart_id = %s', (cart_id,))
        conn.commit()
        return jsonify({'message': 'Item removed from cart'})
    except Error as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get user's scan history
@app.route('/api/user/<int:user_id>/scans', methods=['GET'])
def get_user_scans(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''
            SELECT s.*, d.name as disease_name, d.symptoms, d.treatment
            FROM scans s
            LEFT JOIN diseases d ON s.disease_id = d.disease_id
            WHERE s.user_id = %s
            ORDER BY s.date DESC
        ''', (user_id,))
        scans = cursor.fetchall()
        return jsonify(scans)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get user's orders
@app.route('/api/user/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''
            SELECT o.*, a.fullName, a.street, a.city, a.state, a.zip, a.country
            FROM orders o
            LEFT JOIN addresses a ON o.address_id = a.address_id
            WHERE o.user_id = %s
            ORDER BY o.date DESC
        ''', (user_id,))
        orders = cursor.fetchall()
        
        # For each order, get its items
        for order in orders:
            cursor.execute('''
                SELECT oi.*, p.name
                FROM order_items oi
                JOIN products p ON oi.product_id = p.product_id
                WHERE oi.order_id = %s
            ''', (order['order_id'],))
            order['items'] = cursor.fetchall()
        
        return jsonify(orders)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get all plants (encyclopedia)
@app.route('/api/plants', methods=['GET'])
def get_plants():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('SELECT * FROM plants')
        plants = cursor.fetchall()
        return jsonify(plants)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Add plant to user's favorites
@app.route('/api/favorites/add', methods=['POST'])
def add_favorite():
    data = request.get_json()
    user_id = data.get('user_id')
    plant_id = data.get('plant_id')
    
    if not user_id or not plant_id:
        return jsonify({'error': 'Missing user_id or plant_id'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO favorites (user_id, plant_id)
            VALUES (%s, %s)
        ''', (user_id, plant_id))
        conn.commit()
        return jsonify({'message': 'Plant added to favorites'})
    except Error as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get user's favorite plants
@app.route('/api/favorites/<int:user_id>', methods=['GET'])
def get_favorites(user_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute('''
            SELECT p.*
            FROM favorites f
            JOIN plants p ON f.plant_id = p.plant_id
            WHERE f.user_id = %s
        ''', (user_id,))
        favorites = cursor.fetchall()
        return jsonify(favorites)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Remove favorite
@app.route('/api/favorites/remove', methods=['POST'])
def remove_favorite():
    data = request.get_json()
    user_id = data.get('user_id')
    plant_id = data.get('plant_id')
    
    if not user_id or not plant_id:
        return jsonify({'error': 'Missing user_id or plant_id'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute('''
            DELETE FROM favorites 
            WHERE user_id = %s AND plant_id = %s
        ''', (user_id, plant_id))
        conn.commit()
        return jsonify({'message': 'Favorite removed'})
    except Error as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# Get all users with their scans and orders (Admin View)
@app.route('/api/admin/users-activity', methods=['GET'])
def get_admin_users_activity():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    try:
        # First, fetch all users
        cursor.execute("SELECT id as user_id, email, first_name as name FROM user")
        users = cursor.fetchall()
        
        # Then, for each user, fetch their scans and orders
        for user in users:
            uid = user.get('user_id') or user.get('id')
            
            # Fetch scans
            cursor.execute('''
                SELECT s.*, d.name as disease_name 
                FROM scans s 
                LEFT JOIN diseases d ON s.disease_id = d.disease_id 
                WHERE s.user_id = %s
                ORDER BY s.date DESC
            ''', (uid,))
            user['scans'] = cursor.fetchall()
            
            # Fetch orders & items
            cursor.execute('''
                SELECT o.*, a.fullName, a.city, a.state
                FROM orders o
                LEFT JOIN addresses a ON o.address_id = a.address_id
                WHERE o.user_id = %s
                ORDER BY o.date DESC
            ''', (uid,))
            orders = cursor.fetchall()
            
            for order in orders:
                cursor.execute('''
                    SELECT oi.*, p.name as product_name, p.price
                    FROM order_items oi
                    JOIN products p ON oi.product_id = p.product_id
                    WHERE oi.order_id = %s
                ''', (order.get('order_id'),))
                order['items'] = cursor.fetchall()
                
            user['orders'] = orders
            
        return jsonify(users)
    except Error as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# -------------------- Test endpoint --------------------
@app.route('/api/test-db', methods=['GET'])
def test_db():
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            conn.close()
            return jsonify({'message': '✅ Database connected successfully!'})
        else:
            return jsonify({'error': 'Database connection failed'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------------------- Auth & Checkout Endpoints --------------------
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    if not email or not password or not name:
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connect failed', 'success': False}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        # Check if exists
        cursor.execute("SELECT id FROM user WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'Email already registered', 'success': False}), 400
            
        cursor.execute("INSERT INTO user (email, password, first_name) VALUES (%s, %s, %s)", (email, password, name))
        conn.commit()
        return jsonify({'message': 'Signup successful', 'success': True})
    except Error as e:
        return jsonify({'error': str(e), 'success': False}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Missing email or password', 'success': False}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed', 'success': False}), 500
        
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, email, first_name as name FROM user WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()
        if user:
            return jsonify({'message': 'Login successful', 'user': user, 'success': True})
        else:
            return jsonify({'error': 'Invalid email or password', 'success': False}), 401
    except Error as e:
        return jsonify({'error': str(e), 'success': False}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/orders/place', methods=['POST'])
def place_order():
    data = request.get_json()
    user_id = data.get('user_id')
    cart_items = data.get('cart_items', [])
    address = data.get('address')
    payment_method = data.get('payment_method')
    total = data.get('total', 0)
    
    if not user_id or not cart_items or not address:
        return jsonify({'error': 'Missing required order details', 'success': False}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connect failed', 'success': False}), 500
        
    cursor = conn.cursor()
    try:
        # Insert address
        cursor.execute('''INSERT INTO addresses (user_id, fullName, street, city, state, zip, country)
                          VALUES (%s, %s, %s, %s, %s, %s, %s)''', 
                          (user_id, address.get('fullName'), address.get('street'), address.get('city'), 
                           address.get('state'), address.get('zip'), address.get('country')))
        address_id = cursor.lastrowid
        
        # Insert order
        cursor.execute('''INSERT INTO orders (user_id, total, date, status, payment_method, address_id)
                          VALUES (%s, %s, CURDATE(), 'Processing', %s, %s)''',
                          (user_id, total, payment_method, address_id))
        order_id = cursor.lastrowid
        
        # Insert order items
        for item in cart_items:
            p_id = item.get('product_id') or item.get('id')
            cursor.execute('''INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
                              VALUES (%s, %s, %s, %s)''',
                              (order_id, p_id, item.get('quantity', 1), item.get('price', 0)))
                              
        conn.commit()
        return jsonify({'message': 'Order placed successfully', 'order_id': order_id, 'success': True})
    except Error as e:
        conn.rollback()
        return jsonify({'error': str(e), 'success': False}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)