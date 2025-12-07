import UserController from './UserController'
import PointController from './PointController'
import UserPrizeController from './UserPrizeController'
import GachaController from './GachaController'
import PrizeController from './PrizeController'

const Api = {
    UserController: Object.assign(UserController, UserController),
    PointController: Object.assign(PointController, PointController),
    UserPrizeController: Object.assign(UserPrizeController, UserPrizeController),
    GachaController: Object.assign(GachaController, GachaController),
    PrizeController: Object.assign(PrizeController, PrizeController),
}

export default Api