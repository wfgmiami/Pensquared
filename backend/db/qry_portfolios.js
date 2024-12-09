module.exports = {
  sql_portfolios: `
    select
      p.port_id,
      p.port_name,
      p.currency,
      p.asset_class,
      p.user_id,
      t.symbols,
      t.mv,
      (t.mv - t.bv) as ugl
    from portfolio as p
    left join (
      select
        t.port_id,
        count(distinct t.symbol) as symbols,
        sum(t.shares * cp.current_price) as mv,
        sum(t.shares) * sum(t.purchase_price * t.shares)/sum(t.shares) as bv
      from
        transaction_buy t,
        currentprice cp
      where
        cp.symbol = t.symbol
      group by
        t.port_id
      ) as t
      on p.port_id = t.port_id
      where p.user_id = $1
    `,
  sql_port: `select
    p.port_id,
    p.port_name,
    p.currency,
    p.asset_class,
    p.user_id,
    t.bv
  from portfolio as p

  left join (
    select
      t.port_id,
      count(distinct t.symbol) as symbols,
      case
         when sum(t.shares) = 0 then 0
         else sum(t.shares) * sum(t.purchase_price * t.shares)/sum(t.shares)
      end as bv
    from
      transaction_buy t
    group by
      t.port_id
    ) as t
    on p.port_id = t.port_id
    where p.user_id = $1`,

  sql_create_portfolio: `
    insert into portfolio(port_name, user_id) values($1, $2) returning *
  `,
};
