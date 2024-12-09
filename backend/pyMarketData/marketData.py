import sys
from yahoo_fin import stock_info as si
symbols = sys.argv[1].split(',')

portfolio={}
for ticker in symbols:
  portfolio[ticker] = si.get_live_price(ticker)

print(portfolio)
sys.stdout.flush()


