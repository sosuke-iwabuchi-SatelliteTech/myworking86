import HomeController from './HomeController'
import DashboardController from './DashboardController'
import PrizeController from './PrizeController'
import Admin from './Admin'

const Web = {
    HomeController: Object.assign(HomeController, HomeController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    PrizeController: Object.assign(PrizeController, PrizeController),
    Admin: Object.assign(Admin, Admin),
}

export default Web