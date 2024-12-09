module.exports = {
  sql_transactions: `
    select
      t.trans_buy_id,
      t.symbol,
      t.shares,
      t.trade_date,
      t.purchase_price,
      t.shares * t.purchase_price as book_value,
      t.shares * cp.current_price as market_value,
      (t.shares * cp.current_price) - (t.shares * t.purchase_price) as gain_loss,
      b.broker_name as broker,
      t.comment,
      p.port_id,
      t.broker_id,
      t.user_id
    from
      transaction_buy t
        inner join currentprice cp
          on t.symbol = cp.symbol
        left join broker b
          on t.broker_id = b.broker_id
        left join portfolio p
          on t.port_id = p.port_id
    where
      t.symbol = $1
      and p.port_id = $2
    order by
      t.symbol,
      t.trade_date`,
  sql_update_transaction: `update
      transaction_buy
    set
      symbol=$2,
      shares=$3,
      trade_date=$4,
      purchase_price=$5,
      comment=$6,
      port_id=$7,
      broker_id=$8
    where
      trans_buy_id=$1
    returning *
      `,
  sql_post_transaction: `
      insert into transaction_buy
      (symbol, shares, trade_date, purchase_price, comment, port_id, broker_id, user_id)
      values($1, $2, $3, $4, $5, $6, $7, $8)
      returning *
      `,
  sql_buy_transactions_by_port: `
      select
        t.trans_buy_id,
        t.symbol,
        t.trade_date,
        t.shares,
        t.purchase_price,
        t.shares * t.purchase_price as book_value,
        t.comment,
        t.fee,
        t.tax,
        t.commission,
        t.port_id,
        t.compliance_id,
        t.broker_id,
        b.broker_name
      from
        transaction_buy t
      left join
        broker b
      on
        b.broker_id = t.broker_id
      where
        t.port_id = $1
      `,
  sql_all_buy_transactions: `
    select
      p.port_id,
      p.port_name,
      p.currency,
      p.asset_class,
      t.trans_buy_id,
      t.symbol,
      t.trade_date,
      t.purchase_price,
      t.shares,
      t.shares * t.purchase_price as book_value,
      t.comment,
      t.fee,
      t.tax,
      t.commission,
      t.compliance_id,
      t.broker_id,
      b.broker_name,
      t.user_id
    from
      portfolio p
    left join
      transaction_buy t
    on
      p.port_id = t.port_id
    left join
      broker b
    on
      b.broker_id = t.broker_id
    where
      p.user_id = $1
    order by
      p.port_id,
      t.symbol,
      t.trans_buy_id
      `,
  sql_port_all_buy_transactions: `
      select
        p.port_id,
        p.port_name,
        p.currency,
        p.asset_class,
        t.trans_buy_id,
        t.symbol,
        t.trade_date,
        t.purchase_price,
        t.shares,
        t.shares * t.purchase_price as book_value,
        t.comment,
        t.fee,
        t.tax,
        t.commission,
        t.compliance_id,
        t.broker_id,
        b.broker_name,
        t.user_id
      from
        portfolio p
      left join
        transaction_buy t
      on
        p.port_id = t.port_id
      left join
        broker b
      on
        b.broker_id = t.broker_id
      where
        p.port_id = $1
      order by
        p.port_id,
        t.symbol,
        t.trans_buy_id
        `,
};
