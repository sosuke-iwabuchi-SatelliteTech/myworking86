import DashboardController from './DashboardController'
import UserController from './UserController'
import TradeController from './TradeController'

const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    UserController: Object.assign(UserController, UserController),
    TradeController: Object.assign(TradeController, TradeController),
}

export default Admin