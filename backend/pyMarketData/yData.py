import requests
from requests.exceptions import HTTPError
import sys

symbols = sys.argv[1]
# symbols = sys.argv[1].split(',')

url = 'https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&fields=symbol,regularMarketPrice&symbols=' + symbols

try:
  response = requests.get(url)
  jsonResponse = response.json()
  print(jsonResponse)
except HTTPError as http_err:
  print(f'HTTP error occurred: {http_err}')
except Exception as err:
  print(f'Other error occurred: {err}')

# for key, value in jsonResponse.items():
#   print(key, ":", value)

# r = requests.get(url)
# print(r.json())
# sys.stdout.flush()
