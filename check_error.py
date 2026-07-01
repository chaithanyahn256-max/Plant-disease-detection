import urllib.request, json
data = json.dumps({'user_id': 1, 'product_id': 1, 'quantity': 1}).encode()
req = urllib.request.Request('http://127.0.0.1:5000/api/cart/add', data=data, headers={'Content-Type': 'application/json'})
try:
    urllib.request.urlopen(req)
except Exception as e:
    open('err.txt', 'wb').write(e.read())
