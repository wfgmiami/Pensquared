module.exports = {
  sql_holdings: `
  select
    t.symbol,
    cp.current_price,
    sum(t.shares) as shares,
    sum(t.purchase_price * t.shares)/sum(t.shares) as avg_cost_per_share,
    sum(t.shares) * cp.current_price as market_value,
    sum(t.shares) * sum(t.purchase_price * t.shares)/sum(t.shares) as book_value,
    p.port_id
  from
    transaction_buy t,
    currentprice cp,
    portfolio p
  where
    t.symbol = cp.symbol
    and p.port_id = t.port_id
    and p.port_id = $1
  group by
    t.symbol, cp.current_price, p.port_id
  order by
    t.symbol`,
  sql_holding: `select
    t.symbol,
    cp.current_price,
    sum(t.shares) as shares,
    sum(t.purchase_price * t.shares)/sum(t.shares) as avg_cost_per_share,
    sum(t.shares) * cp.current_price as market_value,
    sum(t.shares) * sum(t.purchase_price * t.shares)/sum(t.shares) as book_value,
    p.port_id
  from
    transaction_buy t,
    currentprice cp,
    portfolio p
  where
    t.symbol = cp.symbol
    and p.port_id = t.port_id
    and p.port_id = $1
    and t.symbol = $2
  group by
    t.symbol, cp.current_price,p.port_id`,
};
