module.exports = {
  sql_brokers_select: `
    select
      broker_name
    from
      broker
  `,
  sql_brokers: `
    select
      b.broker_id,
      b.broker_name,
      b.broker_acc_number,
      b.user_id,
      t.symbols,
      t.mv,
      (t.mv - t.bv) as ugl

    from broker as b

    left join (
      select
        t.broker_id,
        count(distinct t.symbol) as symbols,
        sum(t.shares * cp.current_price) as mv,
        sum(t.shares) * sum(t.purchase_price * t.shares)/sum(t.shares) as bv
      from
        transaction_buy t,
        currentprice cp
      where
        cp.symbol = t.symbol
      group by
        t.broker_id
      ) as t
      on b.broker_id = t.broker_id
      where b.user_id = $1
    `,
  sql_add_broker: `
    insert into broker(broker_name, user_id) values($1, $2) returning *
  `,
};
