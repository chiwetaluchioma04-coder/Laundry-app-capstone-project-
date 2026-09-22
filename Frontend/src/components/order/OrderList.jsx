import OrderCard from './OrderCard'
export default function OrderList({ orders }) { return <div className="order-list">{orders.map((order) => <OrderCard key={order._id} order={order} />)}</div> }
