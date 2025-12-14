import HomeController from './HomeController'
import DashboardController from './DashboardController'
import PrizeController from './PrizeController'
import TradeController from './TradeController'
import Admin from './Admin'

const Web = {
    HomeController: Object.assign(HomeController, HomeController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    PrizeController: Object.assign(PrizeController, PrizeController),
    TradeController: Object.assign(TradeController, TradeController),
    Admin: Object.assign(Admin, Admin),
}

export default Web